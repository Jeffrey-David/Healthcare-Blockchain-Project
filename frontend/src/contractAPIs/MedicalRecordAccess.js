const { ethers } = require('ethers');

const MedicalRecordAccessBuild = require('../contracts/MedicalRecordAccess.json');
const MEDICALRECORDACCESS_CONTRACT_ADDRESS = MedicalRecordAccessBuild.networks['5777'].address;
//const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545'); // Replace with your Ganache URL
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const MedicalRecordAccessContract = new ethers.Contract(MEDICALRECORDACCESS_CONTRACT_ADDRESS, MedicalRecordAccessBuild.abi, signer);


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

async function getAddress() {
    const address = await signer.getAddress().then(console.log('done'));
    return address;
}

// Call addThirdParty(address _thirdParty)
async function callAddThirdParty(address){
    const tx = await MedicalRecordAccessContract.addThirdParty(address);
    await tx.wait();
    return true;
}

async function isThirdParty(address) {
    return await MedicalRecordAccessContract.checkIsThirdParty(address);
}

module.exports = {
    callStoreRecord,
    callGrantAccess,
    callRequestAccess,
    callRevokeAccess,
    callListAccessList,
    callGetAccessRequests,
    callGetMedicalRecords,
    callAddThirdParty,
    isThirdParty,
    getAddress
}


//callStoreRecord('0x858ef375635A9Ca42d1e0a692dEFF09c2fF92B8E', "John", "Dummy",21, '21-02-2022');  //2nd Address
//callStoreRecord('0x54c39202d9689e7fDFea05ba712E86D992bC931d', "Jeff", "Dummy",22, '02-05-2022');
//callRequestAccess('0x858ef375635A9Ca42d1e0a692dEFF09c2fF92B8E');
//callGrantAccess('0x858ef375635A9Ca42d1e0a692dEFF09c2fF92B8E');
//callGetMedicalRecords('0xc82098A69E92e4A4484C42e01b9Cb67115a177eC');
// callRevokeAccess('0xc82098A69E92e4A4484C42e01b9Cb67115a177eC');
//callListAccessList();
//callGetAccessRequests();





