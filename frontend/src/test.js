// const {Web3} = require('web3');

// const DEHTokenBuild = require('./contracts/DEHToken.json');

// const web3 = new Web3(Web3.givenProvider || 'http://127.0.0.1:7545');

// // Smart Contract Addresses
// const DEHTokenAddress = DEHTokenBuild.networks[5777].address;

// // Smart Contracts
// const DEHTokenContract = new web3.eth.Contract(DEHTokenBuild.abi, DEHTokenAddress);

// const context = { web3, DEHTokenContract};
// const getBrokers = async () => {
//   const response = await DEHTokenContract.methods.mint('0xC379e80660235B77642dA73f0d4D3b0A7dD92158',100).call();
//   const response1 = await DEHTokenContract.methods.balanceOf('0xC379e80660235B77642dA73f0d4D3b0A7dD92158').call();
//   console.log(response1);
// };

// getBrokers();

const { ethers } = require('ethers');
const DEHTokenBuild = require('./contracts/DEHToken.json');

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545'); // Replace with your Ganache URL
const signer = provider.getSigner();
//console.log('0x62a73044C6eC898954f4000CFf5B1bA20C20D96b', DEHTokenBuild.abi, signer);
const DEHTokenContract = new ethers.Contract('0x62a73044C6eC898954f4000CFf5B1bA20C20D96b', DEHTokenBuild.abi, signer);

const getBrokers = async () => {
  const response = await DEHTokenContract.mint('0xC379e80660235B77642dA73f0d4D3b0A7dD92158',100);
  const response1 = await DEHTokenContract.balanceOf('0xC379e80660235B77642dA73f0d4D3b0A7dD92158');
  console.log(response1.toNumber());
};

getBrokers();
