const { ethers } = require('ethers');

const MedicalAppointmentBuild = require('../contracts/MedicalAppointment.json');
const MEDICALAPPOINTMENT_CONTRACT_ADDRESS=MedicalAppointmentBuild.networks['5777'].address;
//const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545'); // Replace with your Ganache URL
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
// const Hospital = provider.getSigner();
// const Patient = provider.getSigner(1);
const MedicalAppointmentContract = new ethers.Contract(MEDICALAPPOINTMENT_CONTRACT_ADDRESS, MedicalAppointmentBuild.abi, signer);



// Call requestAppointment function
async function callRequestAppointment(fee, date, slot, name, age) {
  const tx = await MedicalAppointmentContract.requestAppointment(fee, date, slot, name, age);
  await tx.wait(); 
  return true;
}

// Call payAppointmentFee function
async function callPayAppointmentfee() {
  const tx = await MedicalAppointmentContract.payAppointmentFee();
  await tx.wait();
  return true;
}


// Call confirmAppointment(address _patientAddress) function
async function callConfirmAppointment(patientAddress) {
  const tx = await MedicalAppointmentContract.confirmAppointment(patientAddress);
  await tx.wait();
  return true;
}

// Call rejectAppointment(address _patientAddress) function
async function callRejectAppointment(patientAddress) {
  const tx = await MedicalAppointmentContract.rejectAppointment(patientAddress);
  await tx.wait();
  return true;
}

// Call cancelAppointment() function
async function callCancelAppointment() {
  const tx = await MedicalAppointmentContract.cancelAppointment();
  await tx.wait();
  return true;
}

// Call function provideService(address _patientAddress)
async function callProvideService(patientAddress) {
  const tx = await MedicalAppointmentContract.provideService(patientAddress);
  await tx.wait();
  return true;
}

// Call function acknowledgeService()
async function callAcknowledgeService() {
  const tx = await MedicalAppointmentContract.acknowledgeService();
  await tx.wait();
  return true;
}

// Call function releaseMedicalRecord(address _patientAddress, string memory _medicalRecord)
async function callReleaseMedicalRecord(patientAddress, medicalRecord) {
  const tx = await MedicalAppointmentContract.releaseMedicalRecord(patientAddress, medicalRecord);
  await tx.wait();
  return true;
}

// Call function getAllAppointments()
async function callGetAllAppointments() {
  const allAppointments = await MedicalAppointmentContract.getAllAppointments();
  const output = allAppointments.map(innerArr => {
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
async function callGetPatientAppointments() {
  const Appointments = await MedicalAppointmentContract.getPatientAppointments();
  const output = Appointments.map(innerArr => {
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

// Call function getPatientDetails(address patientAddress)
async function callGetPatientDetails(patientAddress) {
    const detail = await MedicalAppointmentContract.getPatientDetails(patientAddress);
    console.log(detail);
    return detail;
}

async function getAddress() {
  const address = await signer.getAddress().then(console.log('done'));
  return address;
}

module.exports = {
  callRequestAppointment,
  callCancelAppointment,
  callRejectAppointment,
  callPayAppointmentfee,
  callConfirmAppointment,
  callProvideService,
  callAcknowledgeService,
  callReleaseMedicalRecord,
  callGetAllAppointments,
  callGetPatientAppointments,
  callGetPatientDetails,
  getAddress
};


//callRequestAppointment(12, '01-11-2023', '11-12', 'Jeff', 18);
//callPayAppointmentfee();
//callGetAllAppointments();
//callGetPatientAppointments();
//callConfirmAppointment('0x858ef375635A9Ca42d1e0a692dEFF09c2fF92B8E');
//callProvideService('0x858ef375635A9Ca42d1e0a692dEFF09c2fF92B8E');
//callAcknowledgeService();
//callReleaseMedicalRecord('0x858ef375635A9Ca42d1e0a692dEFF09c2fF92B8E', 'Dummy Record');
//callGetPatientDetails('0x858ef375635A9Ca42d1e0a692dEFF09c2fF92B8E');


