import{ useState } from 'react'
import './App.scss';

import {BrowserRouter as Router, Route} from "react-router-dom";
import LandingPage from './dashboard/components/LandingPage.js';
import Connect from './dashboard/components/Wallet';
import Home from './dashboard/components/Home';

function App() {

const [ provider, setProvider ] = useState() 
const [token , setToken ] = useState({ mintAddress : null , accountAddress : null })


return (
   <>
<Router>
<Connect setProvider = {setProvider}/>
   <Route exact path='/'>
      <Home />
   </Route> 
 <Route exact path='/app'>
      <LandingPage  setToken=  {setToken} provider = {provider}/>
   </Route>

 </Router>
   </>
  );
}

export default App;