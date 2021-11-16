import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
  Account,
  TransactionInstruction
} from "@solana/web3.js";


import Wallet from "@project-serum/sol-wallet-adapter";

type DisplayEncoding = "utf8" | "hex";
type PhantomEvent = "disconnect" | "connect";
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
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