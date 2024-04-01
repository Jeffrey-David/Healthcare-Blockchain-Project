const fs = require('fs');
const DEHToken = artifacts.require("DEHToken");
const TokenInitializer = artifacts.require("TokenInitializer");
const MedicalRecordAccess = artifacts.require("MedicalRecordAccess");
const MedicalAppointment = artifacts.require("MedicalAppointment");

module.exports = async function (deployer, network, accounts) {
  const ownerAddress = accounts[0];
  
  // Deploy DEHToken contract
  await deployer.deploy(DEHToken);
  const DEHTokenInstance = await DEHToken.deployed();

  // Deploy TokenInitializer contract and pass DEHTokenInstance's address as argument
  await deployer.deploy(TokenInitializer, DEHTokenInstance.address);
  const TokenInitializerInstance = await TokenInitializer.deployed();

  // Deploy MedicalRecordAccess contract and pass TokenInitializerInstance's address as argument
  await deployer.deploy(MedicalRecordAccess);
  const MedicalRecordAccessInstance = await MedicalRecordAccess.deployed();
  
  // Deploy MedicalAppointment contract and pass TokenInitializerInstance's address as argument
  await deployer.deploy(MedicalAppointment, ownerAddress, DEHTokenInstance.address, MedicalRecordAccessInstance.address);
  const MedicalAppointmentInstance = await MedicalAppointment.deployed();

};
