import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
  Account,
  TransactionInstruction
} from "@solana/web3.js";

import Wallet from "@project-serum/sol-wallet-adapter";

export type DisplayEncoding = "utf8" | "hex";
export type PhantomEvent = "disconnect" | "connect";
export type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

export interface ConnectOpts {
  onlyIfTrusted: boolean;
}

export interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  autoApprove: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<void>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<any>;
}

// Get The Solana Provider 
const getProvider = ()=> {
  if ("solana" in window) {
    const provider = (window as any).solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  window.open("https://phantom.app/", "_blank");
};

const wallet = getProvider()

const NETWORK = clusterApiUrl("devnet");

  export const sendTxUsingExternalSignature = async (
    instructions: TransactionInstruction[],
    connection: Connection,
    feePayer: Account | null,
    signersExceptWallet: Account[],
    wallet: Wallet
  ) => {
  
    let tx = new Transaction().add(...instructions);
    
    tx.setSigners(
      //@ts-expect-error
      ...(feePayer
        ? [(feePayer as Account).publicKey, wallet.publicKey]
        : [wallet.publicKey]),
      ...signersExceptWallet.map(s => s.publicKey)
    );
    
    tx.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;
    signersExceptWallet.forEach(acc => {
      tx.partialSign(acc);
    });
    let signed = await wallet.signTransaction(tx);
    let txid = await connection.sendRawTransaction(signed.serialize(), {
      skipPreflight: false,
      preflightCommitment: "singleGossip"
    });
    return connection.confirmTransaction(txid, "singleGossip");
  };

  export const createTransferTransaction = async (
    instructions: TransactionInstruction[], 
    connection: Connection,
    wallet: Wallet) => {

    let tx = new Transaction().add(
      ...instructions
    );
    //@ts-expect-error
    tx.feePayer = wallet.publicKey;
    
    const anyTransaction: any = tx;
    anyTransaction.recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;
    return tx;
  };

  export const sendMultipleTxUsingExternalSignature = async (
    csvInfo,
    instructions: TransactionInstruction[][],
    connection: Connection,
    feePayer: Account | null,
    signersExceptWallet: Account[],
    wallet: Wallet
  ) => {

    const transactions=[];

    for (let i = 0; i < instructions.length; i++) {
      const transaction=await createTransferTransaction(instructions[i],connection,wallet);
      //@ts-expect-error
      transactions.push(transaction);
    }

    let signed = await wallet.signAllTransactions(transactions);
    const transactionResult = await sendAllSignedTransactions(csvInfo, connection, signed);
    return transactionResult;
    //let txid = await connection.sendRawTransaction(signed.serialize());
    //return connection.confirmTransaction(txid, "singleGossip");
  };

  export async function sendAllSignedTransactions(csvInfo, connection: Connection, signedTransactions:Transaction[]) {
    var transactions = [];
    var csvResults = [];

    //@ts-expect-error
    csvResults.push(["Recipient Address", "Amount", "Transaction Status", "View Transaction"])

    for (let i=0; i<signedTransactions.length; i++) {
      try{
        let signedTransaction=signedTransactions[i];
        console.log("signed transaction starting", signedTransaction);
        const rawTransaction = signedTransaction.serialize();
        const txId = await connection.sendRawTransaction(rawTransaction, {
            skipPreflight: true,
            preflightCommitment: "confirmed",
        });

        console.log("Sending transaction ID:", txId);

        //@ts-expect-error
        transactions.push(txId);
        const confirm = await connection.confirmTransaction(txId, "singleGossip");
        console.log(confirm);
        
        if(!confirm.value.err){
          //@ts-expect-error;
        csvResults.push([csvInfo[i][0], csvInfo[i][1].replace(/(\r\n|\n|\r)/gm, ""), "Successful", "https://explorer.solana.com/tx/"+txId+"?cluster=devnet"]);
        }
        else{
          //@ts-expect-error;
        csvResults.push([csvInfo[i][0], csvInfo[i][1].replace(/(\r\n|\n|\r)/gm, ""), "Failed", "https://explorer.solana.com/tx/"+txId+"?cluster=devnet"]);

        }
        
      }catch (error) {
        console.log(error);
        //@ts-expect-error
        csvResults.push([csvInfo[i][0], csvInfo[i][1].replace(/(\r\n|\n|\r)/gm, ""), "Failed", "https://explorer.solana.com/tx/"+txId+"?cluster=devnet"]);
      }
        

    }

    return csvResults;
}
  
  const connectToWallet = () => {
    if (wallet) {
      return wallet.connect() as Promise<void>;
    } else {
      return Promise.resolve();
    }
  };
  
  export const UtilizeWallet = async (): Promise<Wallet> => {
    await connectToWallet();
    return wallet;
  };