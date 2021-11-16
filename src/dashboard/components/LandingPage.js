/* eslint-disable default-case */
import { useState, Fragment } from 'react';
import TabControls from './TabControls';
import TokenCreator from './token.jsx';
import AirdropPage from './AirdropPage.js';
import Footer from "./footer";
import "../CSS/LandingPage.scss"

function LandingPage(props) {
     const COIN_TYPE_LABELS = {
        social:'social',
        airdrop:'airdrop',
        transfer:'transfer',
        mint:'mint'
      }
       const COIN_TYPE_TABS = [
        {
          label: 'Create Tokens',
          key: 'social',
          value: 0,
        },
        {
          label: 'Airdrop Tokens',
          key: 'airdrop',
          value: 1,
        }
      ]

    const [activeTab, setActiveTab] = useState(COIN_TYPE_TABS[0]);

    const handleTabClick = (item) => {
        setActiveTab(item);
    }
    const renderTabContent = () => {
        let tabNode;
        switch (activeTab.key) {
            case COIN_TYPE_LABELS.social :
                tabNode = (
                    <TokenCreator setToken=  {props.setToken} provider = {props.provider}/>
                );
                break;
            case COIN_TYPE_LABELS.airdrop :
                tabNode = (
                    <AirdropPage setToken=  {props.setToken} provider = {props.provider}/>
                )
                break;
        }
        return tabNode;
    }
    return (

        <Fragment>
        <div className="py-20 bg-gradient-to-br from-indigo-100 to-indigo-400 flex justify-center items-center h-screen">
        <div className = 'main-container bg-white font-sans shadow-lg rounded-lg p-8'>
            <TabControls
                menuItems={COIN_TYPE_TABS}
                selectedItem={activeTab}
                containerClassName="searchResultMenu"
                hidden={false}
                onMenuItemClick={handleTabClick}
            />
            <div className="tabContainer">
                <div className="tabs">
                    {renderTabContent()}
                </div>
            </div>
         </div>
         </div>
         <Footer />
        </Fragment>
        
    )
}

export default LandingPage;