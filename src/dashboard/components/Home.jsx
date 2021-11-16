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

    
    <div className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-indigo-500 sm:text-4xl">
          SPLdrop
          </p>
          <p className="mt-4 max-w-2xl font-bold text-xl text-gray-400 lg:mx-auto">
           Create and airdrop SPL-Tokens to thousands of addresses in seconds!
          </p>
          <div className="mt-5 flex lg:mt-0 lg:ml-4"></div>
          <span className="hidden sm:block">
          <button
           
            className="inline-flex items-center px-4 py-2 duration-200 hover:text-black rounded-md shadow-sm hover:shadow-md text-sm font-medium text-gray-700 bg-white "
          >
             <Link to="/app" type="button">Launch App</Link>
          </button>
          </span>
          <span className="hidden sm:block">
          <button
           
            className="inline-flex items-center px-4 py-2 duration-200 hover:text-black rounded-md shadow-sm hover:shadow-md text-sm font-medium text-gray-700 bg-white "
          >
             <Link to="/docs" type="button">Read the Docs</Link>
          </button>
        </span>
        </div>       
      </div>
    </div>
    <Footer />
    </>
  )
}