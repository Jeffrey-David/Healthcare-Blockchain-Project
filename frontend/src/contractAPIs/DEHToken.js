const { ethers } = require('ethers');

const DEHTokenBuild = require('../contracts/DEHToken.json');

const DEHTOKEN_CONTRACT_ADDRESS= DEHTokenBuild.networks['5777'].address;

//const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545'); // Replace with your Ganache URL
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const DEHTokenContract = new ethers.Contract(DEHTOKEN_CONTRACT_ADDRESS, DEHTokenBuild.abi, signer);

// Call totalSupply function
async function callTotalSupply() {
  const totalSupply = await DEHTokenContract.totalSupply();
  console.log('Total Supply:', totalSupply.toString());
  return totalSupply.toString();
}

// Call balanceOf function
async function callBalanceOf(address) {
  const balance = await DEHTokenContract.balanceOf(address);
  console.log(`Balance of ${address}:`, balance.toString());
  return balance.toNumber();
}

// Call transfer function
async function callTransfer(to, value) {
  const tx = await DEHTokenContract.transfer(to, value);
  await tx.wait(); // Wait for transaction to be mined
  console.log('Transfer successful');
  return true;
}

// Call transferFrom function
async function callTransferFrom(from, to, value) {
  const tx = await DEHTokenContract.transferFrom(from, to, value);
  await tx.wait(); // Wait for transaction to be mined
  console.log('Transfer successful');
  return true;
}

// Call mint function
async function callMint(to, amount) {
  const tx = await DEHTokenContract.mint(to, amount);
  await tx.wait(); // Wait for transaction to be mined
  console.log('Minting successful');
}

// Call approve function
async function callApprove(spender, value) {
  const tx = await DEHTokenContract.approve(spender, value);
  await tx.wait(); // Wait for transaction to be mined
  console.log('Approval successful');
}

// Call allowance function
async function callAllowance(owner, spender) {
  const allowance = await DEHTokenContract.allowance(owner, spender);
  console.log(`Allowance of ${spender} for ${owner}:`, allowance.toString());
}


// callTransferFrom('0x66ADaFa0c3fc957D703f19309FCd00329cCd6A65', '0xC379e80660235B77642dA73f0d4D3b0A7dD92158', 300)

//callMint('0x858ef375635A9Ca42d1e0a692dEFF09c2fF92B8E', 100);
//callBalanceOf('0x858ef375635A9Ca42d1e0a692dEFF09c2fF92B8E');

callBalanceOf('0xc82098A69E92e4A4484C42e01b9Cb67115a177eC');

module.exports = {
  callTotalSupply,
  callBalanceOf,
  callTransfer,
  callTransferFrom,
  callMint,
  callApprove,
  callAllowance
};
