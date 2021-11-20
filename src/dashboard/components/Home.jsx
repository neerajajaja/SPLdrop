/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* This example requires Tailwind CSS v2.0+ */
import { Link } from "react-router-dom";
import Footer from "./footer";

import "../../build/tailwind.css"

export default function Home() {
  return (
      <>
{/* Use Cases  */}
    <div className="py-12 bg-gradient-to-r from-indigo-200 via-purple-300 to-indigo-400 flex justify-center items-center h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
        <div className="lg:text-center">
          <p className="py-5 mt-2 text-3xl leading-8 font-extrabold tracking-tight text-indigo-500 sm:text-6xl flex justify-center items-center">
          SPLdrop
          </p>
          <p className=" mt-4 max-w-2xl font-bold text-xl text-gray-800 lg:mx-auto flex justify-center items-center">
           Create your own crypotokens. Transfer, airdrop SPL-tokens to thousands of addresses.
          </p>
          <p className="py-5 mt-4 max-w-2xl font-bold text-xl text-gray-800 lg:mx-auto flex justify-center items-center">
           Secure. No Code. Within seconds.
          </p>
          <div className="mt-5 flex lg:mt-0 lg:ml-4"></div>
          <span className="hidden sm:block">
          <button
           
            className="inline-flex items-center px-4 py-2 duration-200 hover:text-black rounded-md shadow-sm hover:shadow-md text-sm font-medium text-gray-700 bg-white "
          >
             <Link to="/app" type="button">Launch App</Link>
          </button>
          &nbsp;
          &nbsp;
          &nbsp;
          &nbsp;
          <button
           
            className="inline-flex items-center px-4 py-2 duration-200 hover:text-black rounded-md shadow-sm hover:shadow-md text-sm font-medium text-gray-700 bg-white " onClick={ ()=>window.open("https://j-neeraja.gitbook.io/spldrop/")}
          >
             Read Docs
             </button>
          </span>
        </div>       
      </div>
    </div>
    <Footer />
    </>
  )
}