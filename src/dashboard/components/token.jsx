/* eslint-disable default-case */
import {useState} from 'react'
import { Connection,  clusterApiUrl , PublicKey} from "@solana/web3.js";
import { useHistory } from 'react-router-dom'
// CSS 
import "../CSS/token.css"
//Utils
import { createNewToken , createAssociatedTokenAccount, mintToken } from '../lib/createUtils'
import {TOKEN_PROGRAM_ID } from '@solana/spl-token';
import TokenSteps from './TokenSteps';
import { getAccountExplorerURL  } from '../lib/utils';


function TokenCreator(props) {

  const [step , setStep ] = useState(1)
  const [tokenAddress , setTokenAddress ] =  useState()
  const [tokenAccountAddress , setTokenAccountAddress ] = useState()
  const [mintAuthorityAddress , setMintAuthority ] = useState()
  const [tokenSupply , settokenSupply ] = useState()
  const [ explorer , setExplorer ] = useState()


  const networks = {
    mainnet: { url: "https://solana-api.projectserum.com", displayName: "Mainnet Beta" },
    devnet: { url: clusterApiUrl("devnet"), displayName: "Devnet" },
    testnet: { url: clusterApiUrl("testnet"), displayName: "Testnet" },
  };
  const history = useHistory();
  const solanaNetwork = networks.devnet;
  const connection = new Connection(solanaNetwork.url);

  const getConnection = () => connection;

  const  explorerURL = () => {
    window.open(explorer)
  }

async function createToken() { 

    let decimals = document.getElementById("decimals").value;
 
    let name = document.getElementById("name").value
    let symbol = document.getElementById("symbol").value
    let tokenSupply = document.getElementById("token-supply").value
    settokenSupply(tokenSupply);
    
     try {
    const tokenInit = await createNewToken(props.provider.publicKey , null, decimals).then((data) =>
      {
      console.log(data)
      console.log("Mint Address" , data.publicKey.toString())
      setMintAuthority(props.provider.publicKey)
      setTokenAddress(data.publicKey.toString())


      let mintAddr = data.publicKey.toString();
      setExplorer(getAccountExplorerURL(mintAddr.toString()))
      let newObj = {
          tokenSymbol : symbol,
          mintAddress : mintAddr,
          tokenName : name,
          icon: "https://raw.githubusercontent.com/trustwallet/assets/08d734b5e6ec95227dc50efef3a9cdfea4c398a1/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png",
      }

      localStorage.setItem("mintedTokens", JSON.stringify(newObj));

      setStep(2)
      })

     } catch (error) {
       console.log(error)
     }
  
}

async function createTokenAcc() {
 try {
  await createAssociatedTokenAccount(tokenAddress , mintAuthorityAddress, tokenSupply).then((data) => {
    console.log("Associated Token Account " , data)
    setTokenAccountAddress(data)
    setStep(3) 
  })

  console.log(tokenAddress)
  const tokenAccounts = await connection.getTokenAccountsByOwner(new PublicKey(props.provider.publicKey.toString()) , {
    programId: TOKEN_PROGRAM_ID})
  console.log(tokenAccounts.value)
  console.log(tokenAddress)

 } catch (error) {
   console.log(error)
 }
}

const getId = (step) => {
  switch(step) {
    case 1 :
      return 'create-mint';
    case 2 :
      return 'initialize-token-account';
    case 3 :
      return 'transfer-token';
  }
}

const getOnClick = (step) => {
  switch(step) {
    case 1 :
      return ()=>createToken();
    case 2 :
      return ()=>createTokenAcc();
    case 3 :
      return ()=>explorerURL();
    }
}

return (
  
  <TokenSteps 
    step={step}
    id={getId(step)}
    onClick={getOnClick(step)}
  />
)

}

export default TokenCreator