// Load the 'dotenv' module to access environment variables
const dotenv = require('dotenv').config({ path: '../../.env' });



const DEHToken = artifacts.require("DEHToken");
const TokenInitializer = artifacts.require("TokenInitializer");
const MedicalRecordAccess = artifacts.require("MedicalRecordAccess");
const MedicalAppointment = artifacts.require("MedicalAppointment");

module.exports = function (deployer, network, accounts) {
  // Deploy DEHToken contract
  console.log("Hi" , process.env.MEDICALAPPOINTMENT_CONTRACT_ADDRESS)

  const ownerAddress = accounts[0];
  deployer.deploy(DEHToken).then(async () => {
    // Get the deployed instance of DEHToken contract
    const DEHTokenInstance = await DEHToken.deployed(); 
    process.env.DEHTOKEN_CONTRACT_ADDRESS = DEHTokenInstance.address;

    // Deploy TokenInitializer contract and pass DEHTokenInstance's address as argument
    await deployer.deploy(TokenInitializer, DEHTokenInstance.address);
    const TokenInitializerInstance = await TokenInitializer.deployed();
    process.env.TOKENINITIALIZER_CONTRACT_ADDRESS = TokenInitializerInstance.address;

    // Deploy MedicalRecordAccess contract and pass TokenInitializerInstance's address as argument
    await deployer.deploy(MedicalRecordAccess);
    const MedicalRecordAccessInstance = await MedicalRecordAccess.deployed();
    process.env.MEDICALRECORDACCESS_CONTRACT_ADDRESS = MedicalRecordAccessInstance.address;
    
    // Deploy MedicalAppointment contract and pass TokenInitializerInstance's address as argument
    await deployer.deploy(MedicalAppointment, ownerAddress, DEHTokenInstance.address, MedicalRecordAccessInstance.address);
    const MedicalAppointmentInstance = await MedicalAppointment.deployed();
    process.env.MEDICALAPPOINTMENT_CONTRACT_ADDRESS = MedicalAppointmentInstance.address;

 
  });
};
