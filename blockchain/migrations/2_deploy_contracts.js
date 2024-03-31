const DEHToken = artifacts.require("DEHToken");
const TokenInitializer = artifacts.require("TokenInitializer");
const MedicalRecordAccess = artifacts.require("MedicalRecordAccess");
const MedicalAppointment = artifacts.require("MedicalAppointment");

module.exports = function (deployer, network, accounts) {
  // Deploy DEHToken contract
  const ownerAddress = accounts[0];
  deployer.deploy(DEHToken).then(async () => {
    // Get the deployed instance of DEHToken contract
    const DEHTokenInstance = await DEHToken.deployed(); 
    
    // Deploy TokenInitializer contract and pass DEHTokenInstance's address as argument
    await deployer.deploy(TokenInitializer, DEHTokenInstance.address);
    
    // Get the deployed instance of TokenInitializer contract
    const TokenInitializerInstance = await TokenInitializer.deployed();
    
    // Deploy MedicalRecordAccess contract and pass TokenInitializerInstance's address as argument
    await deployer.deploy(MedicalRecordAccess);

    const  MedicalRecordAccessInstance = await MedicalRecordAccess.deployed();
    
    // Deploy MedicalAppointment contract and pass TokenInitializerInstance's address as argument
    await deployer.deploy(MedicalAppointment, ownerAddress, DEHTokenInstance.address, MedicalRecordAccessInstance.address);
  });
};
