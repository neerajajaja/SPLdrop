// Datahub Node's RPC URL
export const getNodeRpcURL = () => {
    return process.env.REACT_APP_USE_DATAHUB === "true"
      ? `https://${process.env.REACT_APP_DATAHUB_DEVNET_RPC_URL}/apikey/${process.env.REACT_APP_DATAHUB_API_KEY}`
      : process.env.REACT_APP_DEVNET_URL;
  }
  
  // Datahub Node's WS (Web Socket) URL
  export const getNodeWsURL = () => {
    return process.env.REACT_APP_USE_DATAHUB === "true"
      ? `wss://${process.env.REACT_APP_DATAHUB_DEVNET_WS_URL}/apikey/${process.env.REACT_APP_DATAHUB_API_KEY}`
      : process.env.REACT_APP_DEVNET_URL;
  }
  
  // Helper for generating an account URL on Solana Explorer
  export const getAccountExplorerURL = (address) => {
    return `https://explorer.solana.com/address/${address}?cluster=devnet`;
  }
  
  // Helper for generating a transaction URL on Solana Explorer
  export const getTxExplorerURL = (signature) => {
    return `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
  }