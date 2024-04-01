const { ethers } = require('ethers');
require("dotenv").config({path:"../../../.env"})

const DEHTokenBuild = require('../contracts/MedicalAppointment.json');

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545'); // Replace with your Ganache URL
const Hospital = provider.getSigner();
const Patient = provider.getSigner(1);
const MedicalAppointmentContractH = new ethers.Contract(process.env.MEDICALAPPOINTMENT_CONTRACT_ADDRESS, DEHTokenBuild.abi, Hospital);
const MedicalAppointmentContractP = new ethers.Contract(process.env.MEDICALAPPOINTMENT_CONTRACT_ADDRESS, DEHTokenBuild.abi, Patient);



// Call requestAppointment function
async function callRequestAppointment(fee, date, slot, name) {
  const tx = await MedicalAppointmentContractP.requestAppointment(fee, date, slot, name);
  await tx.wait(); 
  return true;
}

// Call payAppointmentFee function
async function callPayAppointmentfee() {
  const tx = await MedicalAppointmentContractP.payAppointmentFee();
  await tx.wait();
  return true;
}


// Call confirmAppointment(address _patientAddress) function
async function callConfirmAppointment(patientAddress) {
  const tx = await MedicalAppointmentContractH.confirmAppointment(patientAddress);
  await tx.wait();
  return true;
}

// Call function provideService(address _patientAddress)
async function callProvideService(patientAddress) {
  const tx = await MedicalAppointmentContractH.provideService(patientAddress);
  await tx.wait();
  return true;
}

// Call function acknowledgeService()
async function callAcknowledgeService() {
  const tx = await MedicalAppointmentContractP.acknowledgeService();
  await tx.wait();
  return true;
}

// Call function releaseMedicalRecord(address _patientAddress, string memory _medicalRecord)
async function callReleaseMedicalRecord(patientAddress, medicalRecord) {
  const tx = await MedicalAppointmentContractH.releaseMedicalRecord(patientAddress, medicalRecord);
  await tx.wait();
  return true;
}

// Call function getAllAppointments()
async function callGetAllAppointments() {
  const allAppointments = await MedicalAppointmentContractH.getAllAppointments();
  output = allAppointments.map(innerArr => {
    return innerArr.slice(0, 7).map(element => {
      if (typeof element === 'object' && element.hasOwnProperty('_isBigNumber')) {
        return element.toNumber();
      }
      return element;
    });
  });
  console.log(output);
  return output;
}

// Call function getPatientAppointments(address _patientAddress)
// Call function getPatientAppointments(address _patientAddress)
async function callGetPatientAppointments() {
  const Appointments = await MedicalAppointmentContractP.getPatientAppointments();
  output = Appointments.map(innerArr => {
    return innerArr.slice(0, 7).map(element => {
      if (typeof element === 'object' && element.hasOwnProperty('_isBigNumber')) {
        return element.toNumber();
      }
      return element;
    });
  });
  console.log(output);
  return output;
}

//callRequestAppointment(15, '01-11-2023', '10-12', 'John');
//callPayAppointmentfee();
callGetAllAppointments();



