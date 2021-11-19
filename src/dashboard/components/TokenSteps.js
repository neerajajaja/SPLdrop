import  "../CSS/token.css"

const TokenSteps = ({
    id,
    step,
    onClick=()=>{},
}) => {
    const findStep = () => {
        switch(step) {
            case 1:
                return  <>
                    <button className="font-mono font-normal text-indigo-800">STEP-1</button>
                    <br/>
                    <p className="text-indigo-500 text-lg tracking-wide font-bold ">Initialize Token Mint</p>

                         <input type="text" name="name" id="name" className="focus:ring-indigo-500 focus:border-indigo-500 block w-80 text-black mb-5 duration-100 p-2 sm:text-sm border-gray-300 rounded-md" autocomplete="off" placeholder="Name" />
                         <input type="text" name="symbol" id="symbol" className="focus:ring-indigo-500 focus:border-indigo-500 block text-black w-80 mb-5 duration-100 p-2 sm:text-sm border-gray-300 rounded-md" autocomplete="off" placeholder="Symbol" />
                         <input id="token-supply"  className="focus:ring-indigo-500 focus:border-indigo-500 block text-black w-80 mb-5 duration-100 p-2 sm:text-sm border-gray-300 rounded-md" autocomplete="off" placeholder= "Token Supply" type="text"></input>
                         <input id="decimals"  className="focus:ring-indigo-500 focus:border-indigo-500 block w-80 mb-5 duration-100 p-2 text-black sm:text-sm border-gray-300 rounded-md" autocomplete="off" placeholder= "Decimals" type="text"></input>
                         <p className="text-black font-sans text-xs">*Total number of SPL-Tokens created is based on its smallest denomination i.e. if you enter a token supply of 2 decimals and type in decimals of 500, 5 tokens will be created.</p><br/>
                         <button variant="contained" color="primary" className = "p-2 mb-30 rounded-md shadow-lg bg-indigo-500 hover:shadow-xl duration-300 hover:bg-indigo-600 text-white" onClick={  onClick } >Create Token </button>
                        </>
            case 2:

                return  <>
                        <button className="font-mono font-normal text-indigo-800" >Step 2</button> <br/>
                        <button variant="contained" color="primary"  className = "p-2 mb-30 rounded-md shadow-lg bg-indigo-500 hover:shadow-xl duration-300 hover:bg-indigo-600 text-white" onClick={ onClick } > Mint tokens </button>        
                        </> 
            case 3:  
                return <>
                <p className="text-black font-sans"> Congratulations your token has been successfully created! </p><br/>
                <button variant="contained" color="primary"  className = "p-2 mb-30 rounded-md shadow-lg bg-indigo-500 hover:shadow-xl duration-300 hover:bg-indigo-600 text-white" onClick={ onClick } > View Token </button>
                  </>

            default:
          }

    }

    return (
        <div id="create-token" className=" ">
          <div className = "step" id={`${id}`}>
              {findStep()}
          </div>
        </div>
    )
    
};

export default TokenSteps;
