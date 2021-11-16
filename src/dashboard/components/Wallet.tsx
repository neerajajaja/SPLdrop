import { useState, useEffect } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import "../CSS/connect.scss"
import { Link } from "react-router-dom";

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
const getProvider = () => {
  if ("solana" in window) {
    const provider = (window as any).solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
};


const NETWORK = clusterApiUrl("devnet");

export default function Connect(props : any) {

  const provider = getProvider();
  
  const [logs, setLogs] = useState<string[]>([]);
  const addLog = (log: string) => setLogs([...logs, log]);

  const connection = new Connection(NETWORK);
  
  const [, setConnected] = useState<boolean>(false);

  useEffect(() => {
    if (provider) {
      provider.on("connect", () => {
        setConnected(true);
        props.setProvider(provider)
      });
      provider.on("disconnect", () => {
        setConnected(false);
      });
      // try to eagerly connect
      provider.connect()
      return () => {
        provider.disconnect();
      };
    }
  }, [provider]);
  


  return (

<div className="lg:flex lg:items-center lg:justify-between  p-2 ">
      <div className="flex-1 min-w-0">
      <img src="spldrop.png" className ="bg-indigo-800 w-30 h-8 ml-5"  />
 
      </div>
      <div className="mt-5 flex lg:mt-0 lg:ml-4">
      <span className="hidden sm:block ml-3">
          <button
            className="inline-flex items-center px-4 py-2 duration-200 hover:text-indigo-800 rounded-md hover:shadow-md shadow-sm text-sm font-medium text-gray-700 bg-white "
          >
           <Link to="/" type="button">Home</Link>
        
          </button>
        </span>
      <span className="hidden sm:block">
          <button
           
            className="inline-flex items-center px-4 py-2 duration-200 hover:text-black rounded-md shadow-sm hover:shadow-md text-sm font-medium text-gray-700 bg-white "
          >
             <Link to="/app" type="button">App</Link>
          </button>
        </span>
        <span className="hidden sm:block">
          <button
           
            className="inline-flex items-center px-4 py-2 duration-200 hover:text-black rounded-md shadow-sm hover:shadow-md text-sm font-medium text-gray-700 bg-white "
          >
             <Link to="/docs" type="button">Docs</Link>
          </button>
        </span>

        <span className="sm:ml-3">
        {provider && provider.publicKey ? (
           <button  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => provider.disconnect()}> 
             {provider.publicKey.toString().slice(0,4)}...{provider.publicKey.toString().slice(-4)}  
           </button>
    ) : (
          <button  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => provider?.connect()}>
           Connect Wallet
             </button>
       )}
        </span>


      </div>
    </div>
  );
}