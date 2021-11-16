
import {
  Account,
  PublicKey,
  SystemProgram,
  Connection, clusterApiUrl, SYSVAR_RENT_PUBKEY, TransactionInstruction,
} from "@solana/web3.js";
import {
  MintLayout,
  Token,
  AccountLayout,
  TOKEN_PROGRAM_ID,
  u64,
} from "@solana/spl-token";
import { createAccount } from "./account";
import { UtilizeWallet, sendTxUsingExternalSignature } from "./Transaction";

const networks = {
  mainnet: { url: "https://solana-api.projectserum.com", displayName: "Mainnet Beta" },
  devnet: { url: clusterApiUrl("devnet"), displayName: "Devnet" },
  testnet: { url: clusterApiUrl("testnet"), displayName: "Testnet" },
};

const solanaNetwork = networks.devnet;
const connection = new Connection(solanaNetwork.url);
const getConnection = () => connection;

export const getMintPubkeyFromTokenAccountPubkey = async (
  tokenAccountPubkey: PublicKey
) => {
  try {
    const tokenMintData = (
      await getConnection().getParsedAccountInfo(
        tokenAccountPubkey,
        "singleGossip"
      )
    ).value!.data;
    //@ts-expect-error (doing the data parsing into steps so this ignore line is not moved around by formatting)
    const tokenMintAddress = tokenMintData.parsed.info.mint;

    return new PublicKey(tokenMintAddress);
  } catch (err) {
    throw new Error(
      "Error calculating mint address from token account. Are you sure you inserted a valid token account address?"
    );
  }
};

export const createNewToken = async (
  mintAuthority: string,
  freezeAuthority: string,
  decimals: number
) => {
  const connection = getConnection();
  const wallet = await UtilizeWallet();
  const mintAccount = new Account();
  const createAccIx = SystemProgram.createAccount({
    //@ts-expect-error
    fromPubkey: wallet.publicKey,
    newAccountPubkey: mintAccount.publicKey,
    lamports: await connection.getMinimumBalanceForRentExemption(
      MintLayout.span,
      "singleGossip"
    ),
    space: MintLayout.span,
    programId: TOKEN_PROGRAM_ID
  });

  const initMintIx = Token.createInitMintInstruction(
    TOKEN_PROGRAM_ID,
    mintAccount.publicKey,
    decimals,
    new PublicKey(mintAuthority),
    freezeAuthority ? new PublicKey(freezeAuthority) : null
  );

  await sendTxUsingExternalSignature(
    [createAccIx, initMintIx],
    connection,
    null,
    [mintAccount],
    wallet
  ).then((d) => {
    console.log(d)
  });


  return mintAccount;

  
};

export const createTokenAccount = async (
  tokenMintAddress: string,
  owner: string
) => {
  const tokenMintPubkey = new PublicKey(tokenMintAddress);
  const ownerPubkey = new PublicKey(owner);
  const wallet = await UtilizeWallet();

  const connection = getConnection();

  const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(
    connection
  );
  const newAccount = new Account();
  const createAccIx = SystemProgram.createAccount({
    //@ts-expect-error
    fromPubkey: wallet.publicKey,
    newAccountPubkey: newAccount.publicKey,
    lamports: balanceNeeded,
    space: AccountLayout.span,
    programId: TOKEN_PROGRAM_ID
  });

  const createTokenAccountIx = Token.createInitAccountInstruction(
    TOKEN_PROGRAM_ID,
    tokenMintPubkey,
    newAccount.publicKey,
    ownerPubkey
  );

  await sendTxUsingExternalSignature(
    [createAccIx, createTokenAccountIx],
    connection,
    null,
    [newAccount],
    wallet
  );

  return newAccount;
};

// Creates tokens out of nowhere
export const mintToken = async (
  destinationAccountAddress: string,
  amount: u64
) => {
  const destinationPubkey = new PublicKey(destinationAccountAddress);
  const tokenMintPubkey = await getMintPubkeyFromTokenAccountPubkey(
    destinationPubkey
  );
  const connection = getConnection();
  const wallet = await UtilizeWallet();

  const mintAuthorityAccOrWallet = wallet;

  const mintIx = Token.createMintToInstruction(
    TOKEN_PROGRAM_ID,
    tokenMintPubkey,
    destinationPubkey,
    //@ts-expect-error
    mintAuthorityAccOrWallet.publicKey,
    [],
    amount
  );

  const ix = Token.createSetAuthorityInstruction(
    TOKEN_PROGRAM_ID,
    tokenMintPubkey,
    null,
    "MintTokens",
    //@ts-expect-error
    mintAuthorityAccOrWallet,
    []
  );

  await sendTxUsingExternalSignature(
    [mintIx, ix],
    connection,
    null,
    [],
    wallet
  );

  return destinationPubkey.toBase58();
  
};

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export const createIx = (
  funderPubkey: PublicKey,
  associatedTokenAccountPublicKey: PublicKey,
  ownerPublicKey: PublicKey,
  tokenMintPublicKey: PublicKey
) =>
  new TransactionInstruction({
    programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    data: Buffer.from([]),
    keys: [
      { pubkey: funderPubkey, isSigner: true, isWritable: true },
      {
        pubkey: associatedTokenAccountPublicKey,
        isSigner: false,
        isWritable: true
      },
      { pubkey: ownerPublicKey, isSigner: false, isWritable: false },
      { pubkey: tokenMintPublicKey, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }
    ]
  });

  //Finds Associated Token Account Public key
export const findAssociatedTokenAccountPublicKey = async (
  ownerPublicKey: PublicKey,
  tokenMintPublicKey: PublicKey
) =>
  (
    await PublicKey.findProgramAddress(
      [
        ownerPublicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        tokenMintPublicKey.toBuffer()
      ],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
  )[0];


// Create Instructions 
export const createAssociatedTokenAccount = async (
  tokenMintAddress: string,
  ownerAddress: string,
  amount: u64
) => {
  const tokenMintPublicKey = new PublicKey(tokenMintAddress);
  console.log(ownerAddress);
  const ownerPublicKey = new PublicKey(ownerAddress);
  const associatedTokenAccountPublicKey = await findAssociatedTokenAccountPublicKey(
    ownerPublicKey,
    tokenMintPublicKey
  );
  const connection = getConnection();

  const wallet = await UtilizeWallet();
  const ix = createIx(
    //@ts-expect-error   
    wallet.publicKey,
    associatedTokenAccountPublicKey,
    ownerPublicKey,
    tokenMintPublicKey
  );

  const mintIx = Token.createMintToInstruction(
    TOKEN_PROGRAM_ID,
    tokenMintPublicKey,
    associatedTokenAccountPublicKey,
    //@ts-expect-error
    wallet.publicKey,
    [],
    amount
  );

  const mintauthix = Token.createSetAuthorityInstruction(
    TOKEN_PROGRAM_ID,
    tokenMintPublicKey,
    null,
    "MintTokens",
    //@ts-expect-error
    wallet.publicKey,
    []
  );



  await sendTxUsingExternalSignature([ix, mintIx, mintauthix], connection, null, [], wallet);
  
  return associatedTokenAccountPublicKey.toBase58();
};