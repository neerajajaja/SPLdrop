/* eslint-disable default-case */
import { useState } from "react";
import {
  findAssociatedTokenAccountPublicKey,
  createIx
} from "../lib/createUtils";
import "../CSS/token.css"

import {
  Token,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";

import { UtilizeWallet, sendTxUsingExternalSignature, sendMultipleTxUsingExternalSignature } from "../lib/Transaction";

import { PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";

const getProvider = () => {
  if ("solana" in window) {
    const provider = window.solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
};

const networks = {
  mainnet: { url: "https://solana-api.projectserum.com", displayName: "Mainnet Beta" },
  devnet: { url: clusterApiUrl("devnet"), displayName: "Devnet" },
  testnet: { url: clusterApiUrl("testnet"), displayName: "Testnet" },
};

const solanaNetwork = networks.devnet;
const connection = new Connection(solanaNetwork.url);
const getConnection = () => connection;

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
  );
  
  function AirdropPage(props) {
    const [csvFile, setCsvFile] = useState();
    const [csvArray, setCsvArray] = useState([]);
  
    async function findAssociatedTokenAddress(walletAddress, tokenMintAddress) {
      return (
        await PublicKey.findProgramAddress(
          [
            walletAddress.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            tokenMintAddress.toBuffer(),
          ],
          SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
        )
      )[0];
    }
  
    const provider = getProvider();
  
    async function airdropall(TokenMintAddress) {
      try {
        const transactions = [];

      const sourceAddress = await findAssociatedTokenAddress(
        new PublicKey(provider.publicKey.toString()),
        new PublicKey(TokenMintAddress)
      );

      const sourcePubkey = new PublicKey(sourceAddress.toString());
      const tokenMintPublicKey = new PublicKey(TokenMintAddress);
      const connection = getConnection();
      const wallet = await UtilizeWallet();

      const csvInfo = [];

      for (let i = 0; i < csvArray.length; i++) {
        console.log(csvArray[i].recipient);
        const ownerPublicKey = new PublicKey(csvArray[i].recipient);
        const associatedTokenAccountPublicKey = await findAssociatedTokenAccountPublicKey(
          ownerPublicKey,
          tokenMintPublicKey
        );

        const ix = createIx(
          //@ts-expect-error   
          wallet.publicKey,
          associatedTokenAccountPublicKey,
          ownerPublicKey,
          tokenMintPublicKey
        );

        const destinationPubkey = new PublicKey(associatedTokenAccountPublicKey.toString());

        const transferIx = Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          sourcePubkey,
          destinationPubkey,
          //@ts-expect-error
          wallet.publicKey,
          [],
          csvArray[i].amount
        );

        csvInfo.push([csvArray[i].recipient,csvArray[i].amount])
        transactions.push([ix, transferIx]);
        
      }
      console.log(csvArray);
      const transactioncsv = await sendMultipleTxUsingExternalSignature(
        csvInfo,
        transactions,
        connection,
        null,
        //@ts-expect-error
        [],
        wallet
      );
      alert("Token airdrop is over. You can now view the Airdrop summary.");
      
      console.log(transactioncsv);

      var csvFile = '';
      for (var i = 0; i < transactioncsv.length; i++) {
          csvFile += processRow(transactioncsv[i]);
      }

      console.log(csvFile);

      var pom = document.createElement('a');
      var blob = new Blob([csvFile],{type: 'text/csv;charset=utf-8;'});
      var url = URL.createObjectURL(blob);
      pom.href = url;
      pom.setAttribute('download', 'TransferSummary.csv');
      pom.click();

       } catch (error) {
         console.log(error);
         if(csvArray.length==0){
          alert("Error. Enter Token Mint Address and .csv file. Click on Upload before Airdropping. Refer to Docs if error persists.");
         };
       }
      
    }

    var processRow = function (row) {
      var finalVal = '';
      for (var j = 0; j < row.length; j++) {
          var innerValue = row[j] === null ? '' : row[j].toString();
          if (row[j] instanceof Date) {
              innerValue = row[j].toLocaleString();
          };
          var result = innerValue.replace(/"/g, '""');
          if (result.search(/("|,|\n)/g) >= 0)
              result = '"' + result + '"';
          if (j > 0)
              finalVal += ',';
          finalVal += result;
      }
      return finalVal + '\n';
  };


    async function transferall(TokenMintAddress) {
      try {
        const transactions = [];

      const sourceAddress = await findAssociatedTokenAddress(
        new PublicKey(provider.publicKey.toString()),
        new PublicKey(TokenMintAddress)
      );

      const sourcePubkey = new PublicKey(sourceAddress.toString());
      const tokenMintPublicKey = new PublicKey(TokenMintAddress);
      const connection = getConnection();
      const wallet = await UtilizeWallet();

      const csvInfo = [];

      for (let i = 0; i < csvArray.length; i++) {
        console.log(csvArray[i].recipient);
        const ownerPublicKey = new PublicKey(csvArray[i].recipient);
        const associatedTokenAccountPublicKey = await findAssociatedTokenAccountPublicKey(
          ownerPublicKey,
          tokenMintPublicKey
        );

        const destinationPubkey = new PublicKey(associatedTokenAccountPublicKey.toString());

        const transferIx = Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          sourcePubkey,
          destinationPubkey,
          //@ts-expect-error
          wallet.publicKey,
          [],
          csvArray[i].amount
        );

        csvInfo.push([csvArray[i].recipient,csvArray[i].amount])
        transactions.push([transferIx]);
        
      }
      console.log(csvArray);
      const transactioncsv = await sendMultipleTxUsingExternalSignature(
        csvInfo,
        transactions,
        connection,
        null,
        //@ts-expect-error
        [],
        wallet
      );
      alert("Token transfer is over. You can now view the Transfer summary.");
      
      console.log(transactioncsv);

      var csvFile = '';
      for (var i = 0; i < transactioncsv.length; i++) {
          csvFile += processRow(transactioncsv[i]);
      }

      console.log(csvFile);

      var pom = document.createElement('a');
      var blob = new Blob([csvFile],{type: 'text/csv;charset=utf-8;'});
      var url = URL.createObjectURL(blob);
      pom.href = url;
      pom.setAttribute('download', 'TransferSummary.csv');
      pom.click();

       } catch (error) {
         console.log(error);
         if(csvArray.length==0){
          alert("Error. Enter Token Mint Address and .csv file. Click on Upload before Transfering. Refer to Docs if error persists.");
         };
       }
      
      
    }

    async function airdrop(TokenMintAddress) {
      try {
        const transactions = [];

      const sourceAddress = await findAssociatedTokenAddress(
        new PublicKey(provider.publicKey.toString()),
        new PublicKey(TokenMintAddress)
      );

      const sourcePubkey = new PublicKey(sourceAddress.toString());
      const tokenMintPublicKey = new PublicKey(TokenMintAddress);
      const connection = getConnection();
      const wallet = await UtilizeWallet();

      for (let i = 0; i < csvArray.length; i++) {
        console.log(csvArray[i].recipient);
        const ownerPublicKey = new PublicKey(csvArray[i].recipient);
        const associatedTokenAccountPublicKey = await findAssociatedTokenAccountPublicKey(
          ownerPublicKey,
          tokenMintPublicKey
        );

        const ix = createIx(
          //@ts-expect-error   
          wallet.publicKey,
          associatedTokenAccountPublicKey,
          ownerPublicKey,
          tokenMintPublicKey
        );

        const destinationPubkey = new PublicKey(associatedTokenAccountPublicKey.toString());

        const transferIx = Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          sourcePubkey,
          destinationPubkey,
          //@ts-expect-error
          wallet.publicKey,
          [],
          csvArray[i].amount
        );

        transactions.push(ix);
        transactions.push(transferIx);
        
      }
      console.log(csvArray);
      await sendTxUsingExternalSignature(
        transactions,
        connection,
        null,
        //@ts-expect-error
        [],
        wallet
      );

      alert("Congratulations your token has been successfully airdropped!");
            
      
       } catch (error) {
        console.log(error);
        if(csvArray.length==0){
         alert("Error. Enter Token Mint Address and .csv file. Click on Upload before Airdropping.");
        };
      }
      
    }

    async function transfer(TokenMintAddress) {
      try {
        const transactions = [];

      const sourceAddress = await findAssociatedTokenAddress(
        new PublicKey(provider.publicKey.toString()),
        new PublicKey(TokenMintAddress)
      );

      const sourcePubkey = new PublicKey(sourceAddress.toString());
      const tokenMintPublicKey = new PublicKey(TokenMintAddress);
      const connection = getConnection();
      const wallet = await UtilizeWallet();

      for (let i = 0; i < csvArray.length; i++) {
        console.log(csvArray[i].recipient);
        const ownerPublicKey = new PublicKey(csvArray[i].recipient);
        const associatedTokenAccountPublicKey = await findAssociatedTokenAccountPublicKey(
          ownerPublicKey,
          tokenMintPublicKey
        );

        const destinationPubkey = new PublicKey(associatedTokenAccountPublicKey.toString());

        const transferIx = Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          sourcePubkey,
          destinationPubkey,
          //@ts-expect-error
          wallet.publicKey,
          [],
          csvArray[i].amount
        );

        transactions.push(transferIx);
        
      }
      console.log(csvArray);
      await sendTxUsingExternalSignature(
        transactions,
        connection,
        null,
        //@ts-expect-error
        [],
        wallet
      );

      alert("Congratulations your token has been successfully transferred!");
            
      
       } catch (error) {
         console.log(error);
         alert("Error. Click Upload before Transfer");
       }            
    }

    const processCSV = (str, delim=',') => {
        const firstrow = str.slice(0,str.indexOf('\n'));
        const rows = str.slice(str.indexOf('\n')+1).split('\n');
        rows[rows.length-1]=firstrow;
        console.log(rows);
        const headers = ["recipient", "amount"];

        const newArray = rows.map( row => {
            const values = row.split(delim);
            const eachObject = headers.reduce((obj, header, i) => {
                obj[header] = values[i];
                return obj;
            }, {})
            return eachObject;
        })

        console.log(newArray);

        setCsvArray(newArray)
    }

    const submit = () => {
        const file = csvFile;
        const reader = new FileReader();

        reader.onload = function(e) {
            const text = e.target.result;
            console.log(text);
            processCSV(text) // plugged in here
        }

        reader.readAsText(file);
        alert("File uploaded. You can Transfer or Airdrop tokens now!");
    }
  
    return (
      <>
        <input  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full text-black mb-5 duration-100 p-2 sm:text-sm border-gray-300 rounded-md" autocomplete="off" placeholder='Token Mint Address' type="text" id="TokenMintAddress"></input>
  
        <input className="focus:ring-indigo-500 focus:border-indigo-500 block w-full text-black mb-5 duration-100 p-2 sm:text-sm border-gray-300 rounded-md"
            type='file'
            accept='.csv'
            id='csvFile'
            onChange={(e) => {
                setCsvFile(e.target.files[0])
            }}
        >
        </input>
        <br/>
        <p className="text-black font-sans text-xs">*Go through Docs for more details on file format and specifications</p><br/>
        <button className = "p-2 mb-30 rounded-md shadow-lg bg-gray-300 mt-5 hover:shadow-xl duration-300 hover:bg-gray-400"
                onClick={(e) => {
                    e.preventDefault()
                    if(csvFile)submit()
                }}
            >
                Upload
        </button>        

        &nbsp;
        &nbsp;
        <br/> 
        <button
           className = "p-2 mb-30 rounded-md shadow-lg bg-indigo-500 mt-5 hover:shadow-xl duration-300 hover:bg-indigo-600 text-white"
      
          onClick={(e) => {
            airdropall(
              document.getElementById("TokenMintAddress").value
            );
          }
          }
        >
          Airdrop
        </button>
        &nbsp;
        &nbsp;
        <br/> 
        <button
           className = "p-2 mb-30 rounded-md shadow-lg bg-indigo-500 mt-5 hover:shadow-xl duration-300 hover:bg-indigo-600 text-white"
      
          onClick={(e) => {
            transferall(
              document.getElementById("TokenMintAddress").value
            );
          }
          }
        >
          Transfer
        </button>
        <br/>
      </>
    );
  }
  
  export default AirdropPage;
