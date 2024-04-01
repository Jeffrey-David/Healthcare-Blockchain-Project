const { ethers } = require('ethers');
require("dotenv").config({path:"../../../.env"})

const DEHTokenBuild = require('../contracts/MedicalAppointment.json');

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545'); // Replace with your Ganache URL
//const provider = new ethers.providers.Web3Provider(window.ethereum);
const Hospital = provider.getSigner();
const Patient = provider.getSigner(1);
const MedicalAppointmentContractH = new ethers.Contract(process.env.MEDICALAPPOINTMENT_CONTRACT_ADDRESS, DEHTokenBuild.abi, Hospital);
const MedicalAppointmentContractP = new ethers.Contract(process.env.MEDICALAPPOINTMENT_CONTRACT_ADDRESS, DEHTokenBuild.abi, Patient);



// Call requestAppointment function
export async function callRequestAppointment(fee, date, slot, name, age) {
  const tx = await MedicalAppointmentContractP.requestAppointment(fee, date, slot, name, age);
  await tx.wait(); 
  return true;
}

// Call payAppointmentFee function
export async function callPayAppointmentfee() {
  const tx = await MedicalAppointmentContractP.payAppointmentFee();
  await tx.wait();
  return true;
}


// Call confirmAppointment(address _patientAddress) function
export async function callConfirmAppointment(patientAddress) {
  const tx = await MedicalAppointmentContractH.confirmAppointment(patientAddress);
  await tx.wait();
  return true;
}

// Call function provideService(address _patientAddress)
export async function callProvideService(patientAddress) {
  const tx = await MedicalAppointmentContractH.provideService(patientAddress);
  await tx.wait();
  return true;
}

// Call function acknowledgeService()
export async function callAcknowledgeService() {
  const tx = await MedicalAppointmentContractP.acknowledgeService();
  await tx.wait();
  return true;
}

// Call function releaseMedicalRecord(address _patientAddress, string memory _medicalRecord)
export async function callReleaseMedicalRecord(patientAddress, medicalRecord) {
  const tx = await MedicalAppointmentContractH.releaseMedicalRecord(patientAddress, medicalRecord);
  await tx.wait();
  return true;
}

// Call function getAllAppointments()
export async function callGetAllAppointments() {
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
export async function callGetPatientAppointments() {
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

//callRequestAppointment(12, '01-11-2023', '10-12', 'Josh');
//callPayAppointmentfee();
//callGetAllAppointments();
//callGetPatientAppointments();
//callConfirmAppointment('0x858ef375635A9Ca42d1e0a692dEFF09c2fF92B8E');
//callProvideService('0x858ef375635A9Ca42d1e0a692dEFF09c2fF92B8E');
//callAcknowledgeService();
//callReleaseMedicalRecord('0x858ef375635A9Ca42d1e0a692dEFF09c2fF92B8E', 'Dummy Record');


