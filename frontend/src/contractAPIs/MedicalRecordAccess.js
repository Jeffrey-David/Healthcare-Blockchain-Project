const { ethers } = require('ethers');
require("dotenv").config({path:"../../../.env"})

const MedicalRecordAccessBuild = require('../contracts/MedicalRecordAccess.json');

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545'); // Replace with your Ganache URL
//const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner(2);
const MedicalRecordAccessContract = new ethers.Contract(process.env.MEDICALRECORDACCESS_CONTRACT_ADDRESS, MedicalRecordAccessBuild.abi, signer);


// function storeRecord(address _patientAddress, string memory _patientName, string memory _medicalRecord, uint age, string memory _date)
async function callStoreRecord(patientAddress, name, record, age, date) {
    const tx = await MedicalRecordAccessContract.storeRecord(patientAddress, name, record, age, date);
    await tx.wait();
    return true;
}

//function grantAccess(address _thirdParty)
async function callGrantAccess(thirdPartyAddress) {
    const tx = await MedicalRecordAccessContract.grantAccess(thirdPartyAddress);
    await tx.wait();
    return true;
}


//function revokeAccess(address _thirdParty)
async function callRevokeAccess(thirdPartyAddress) {
    const tx = await MedicalRecordAccessContract.revokeAccess(thirdPartyAddress);
    await tx.wait();
    return true;
}


//function listAccessList()
async function callListAccessList() {
    const accessList = await MedicalRecordAccessContract.listAccessList();
    console.log(accessList)
    return accessList;
}

//function requestAccess(address _patient)
async function callRequestAccess(patientAddress) {
    const tx = await MedicalRecordAccessContract.requestAccess(patientAddress);
    await tx.wait();
    return true;
}

//function getAccessRequests()
async function callGetAccessRequests() {
    const accessList = await MedicalRecordAccessContract.getAccessRequests();
    console.log(accessList)
    return accessList;
}


//Call function getMedicalRecords(address _patient)
async function callGetMedicalRecords(patientAddress) {
    const records = await MedicalRecordAccessContract.getMedicalRecords(patientAddress);
    console.log(records);
    return records;
};


//callStoreRecord('0x858ef375635A9Ca42d1e0a692dEFF09c2fF92B8E', "John", "Dummy",21, '21-02-2022');  //2nd Address
//callStoreRecord('0x54c39202d9689e7fDFea05ba712E86D992bC931d', "Jeff", "Dummy",22, '02-05-2022');
//callRequestAccess('0x858ef375635A9Ca42d1e0a692dEFF09c2fF92B8E');
//callGrantAccess('0xc82098A69E92e4A4484C42e01b9Cb67115a177eC');
//callGetMedicalRecords('0x858ef375635A9Ca42d1e0a692dEFF09c2fF92B8E');
// callRevokeAccess('0xc82098A69E92e4A4484C42e01b9Cb67115a177eC');
//callListAccessList();
//callGetAccessRequests();



