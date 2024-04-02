const { ethers } = require('ethers');
const TOKENINITIALIZER_CONTRACT_ADDRESS="0xfa9340d6d612EC6D382aBd166DD10b55F9A61Eaf";

const TokenInitializerBuild = require('../contracts/TokenInitializer.json');

//const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545'); // Replace with your Ganache URL
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const TokenInitializerContract = new ethers.Contract(TOKENINITIALIZER_CONTRACT_ADDRESS, TokenInitializerBuild.abi, signer);


//Call function rechargeTokens()
async function callRechargeTokens() {
    const tx = await TokenInitializerContract.rechargeTokens();
    await tx.wait()
    return true;
  }

  module.exports = {
    callRechargeTokens
  };