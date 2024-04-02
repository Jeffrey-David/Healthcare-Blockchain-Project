// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MedicalRecordAccess.sol"; // Import the other smart contract
import "./DEHToken.sol";

contract MedicalAppointment {
       enum AppointmentStatus { Pending, Paid, Confirmed, ServiceProvided, AcknowledgedService, RecordReleased }

    struct Appointment {
        address patientAddresses;
        string name;
        uint bookingId;
        uint fee;
        string appointmentDate;
        string appointmentSlot;
        AppointmentStatus status;
    }

    struct Patient {
        address patientAddress;
        string name;
        uint age;
        Appointment[] appointments;
    }

    address public hospital;
    uint private nextBookingId = 1; // Counter for generating unique booking IDs
    mapping(address => Patient) public patients;
    address[] public patientAddresses; // Array to store patient addresses
    mapping(address => Appointment[]) public allAppointments;
    DEHToken public dehToken;
    MedicalRecordAccess public medicalRecordAccess; // Instance of the other smart contract
    constructor(address _hospital, address _dehTokenAddress, address _medicalRecordAccess) {
        hospital = _hospital;
        dehToken =  DEHToken(_dehTokenAddress);
        medicalRecordAccess = MedicalRecordAccess(_medicalRecordAccess); // Initialize the instance
    }

    // Function to add patient address to the patientAddresses array
    function addPatientAddress(address _patientAddress) private {
        // Check if the patient address is not already added
        bool exists = false;
        for (uint i = 0; i < patientAddresses.length; i++) {
            if (patientAddresses[i] == _patientAddress) {
                exists = true;
                break;
            }
        }
        // If patient address does not exist, add it
        if (!exists) {
            patientAddresses.push(_patientAddress);
        }
    }

    function requestAppointment(uint _fee, string memory _appointmentDate, string memory _appointmentSlot, string memory _name, uint _age) public {

        // Create new patient if not exists
        if (patients[msg.sender].patientAddress == address(0)) {
            patients[msg.sender].patientAddress = msg.sender;
            patientAddresses.push(msg.sender); // Add patient address to the list
        }

        else {
        require(patients[msg.sender].appointments.length == 0 || hasLastAppointmentRecordReleased(msg.sender), "Last appointment's status must be completed and released");
        }
        patients[msg.sender].name = _name;
        patients[msg.sender].age = _age;
        uint bookingId = getNextBookingId(); // Get the next unique booking ID
        Appointment memory newAppointment = Appointment(msg.sender, _name,  bookingId, _fee, _appointmentDate, _appointmentSlot, AppointmentStatus.Pending);

        // Add appointment to patient's list
        patients[msg.sender].appointments.push(newAppointment);
        allAppointments[msg.sender].push(newAppointment);
    }


    // Internal function to check if the last appointment's status is RecordReleased
    function hasLastAppointmentRecordReleased(address _patientAddress) private view returns (bool) {
        if (patients[_patientAddress].appointments.length == 0) {
            // No previous appointments, so return true
            return true;
        } else {
            // Get the status of the last appointment
            Appointment storage lastAppointment = patients[_patientAddress].appointments[patients[_patientAddress].appointments.length - 1];
            return lastAppointment.status == AppointmentStatus.RecordReleased;
        }
}

    // Internal function to get the next unique booking ID
    function getNextBookingId() private returns (uint) {
        uint bookingId = nextBookingId;
        nextBookingId++; // Increment the counter for the next booking ID
        return bookingId;
    }

    function payAppointmentFee() public {
        Patient storage patient = patients[msg.sender];
        
        // Ensure that the patient has appointments
        require(patient.appointments.length > 0, "Patient has no appointments");
        
        // Find the latest appointment of the patient
        Appointment storage latestAppointment = patient.appointments[patient.appointments.length - 1];
        
        // Ensure that the latest appointment status is "Pending" before allowing payment
        require(latestAppointment.status == AppointmentStatus.Pending, "Latest appointment status must be Pending");
        
        // Transfer the appointment fee (doubled) from the patient's account to the contract's address
        uint doubledFee = latestAppointment.fee * 2;
        require(dehToken.transferFrom(msg.sender, address(this), doubledFee), "Insufficient allowance or balance");
        
        // Update the latest appointment status to "Paid" after successful payment
        latestAppointment.status = AppointmentStatus.Paid;
    }


    function confirmAppointment(address _patientAddress) public {
        require(msg.sender == hospital, "Only hospital can confirm appointments");
        Patient storage patient = patients[_patientAddress];
        
        // Ensure that the patient exists and has appointments
        require(patient.patientAddress != address(0), "Patient not found");
        require(patient.appointments.length > 0, "Patient has no appointments");
        
        // Find the latest appointment of the patient
        Appointment storage latestAppointment = patient.appointments[patient.appointments.length - 1];
        
        // Ensure that the latest appointment status is "Paid" before confirming
        require(latestAppointment.status == AppointmentStatus.Paid, "Latest appointment status must be Paid");
        
        // Update the latest appointment status to "Confirmed"
        latestAppointment.status = AppointmentStatus.Confirmed;
    }



    function provideService(address _patientAddress) public {
        require(msg.sender == hospital, "Only hospital can provide service");
        Patient storage patient = patients[_patientAddress];
        
        // Ensure that the patient exists and has appointments
        require(patient.patientAddress != address(0), "Patient not found");
        require(patient.appointments.length > 0, "Patient has no appointments");
        
        // Find the latest appointment of the patient
        Appointment storage latestAppointment = patient.appointments[patient.appointments.length - 1];
        
        // Ensure that the status of the latest appointment is "Confirmed" before providing service
        require(latestAppointment.status == AppointmentStatus.Confirmed, "Latest appointment status must be Confirmed");
        
        // Update the status of the latest appointment to "ServiceProvided"
        latestAppointment.status = AppointmentStatus.ServiceProvided;
    }


    function acknowledgeService() public {
        // Ensure that the message sender is the patient
        require(msg.sender != hospital, "Only patients can acknowledge service");
        Patient storage patient = patients[msg.sender];
        
        // Ensure that the patient exists and has appointments
        require(patient.patientAddress != address(0), "Patient not found");
        require(patient.appointments.length > 0, "Patient has no appointments");
        
        // Find the latest appointment of the patient
        Appointment storage latestAppointment = patient.appointments[patient.appointments.length - 1];
        
        // Ensure that the status of the latest appointment is "ServiceProvided" before acknowledgment
        require(latestAppointment.status == AppointmentStatus.ServiceProvided, "Latest appointment status must be ServiceProvided");
        
        // Update the status of the latest appointment to "AcknowledgedService"
        latestAppointment.status = AppointmentStatus.AcknowledgedService;
    }


    function releaseMedicalRecord(address _patientAddress, string memory _medicalRecord) public {
        // Ensure that the message sender is the hospital
        require(msg.sender == hospital, "Only hospital can release medical records");

        // Find the patient and ensure that the patient exists and has appointments
        Patient storage patient = patients[_patientAddress];
        uint age = patient.age;
        require(patient.patientAddress != address(0), "Patient not found");
        require(patient.appointments.length > 0, "Patient has no appointments");

        // Find the latest appointment of the patient
        Appointment storage latestAppointment = patient.appointments[patient.appointments.length - 1];

        // Ensure that the status of the latest appointment is "ServiceProvided" before releasing the record
        require(latestAppointment.status == AppointmentStatus.AcknowledgedService, "Latest appointment status must be AcknowledgedService");

        // Calculate the half fee
        uint halfFee = latestAppointment.fee;

        // Transfer half of the fee to the hospital
        require(dehToken.transfer(hospital, halfFee), "Token transfer to hospital failed");

        // Update the status of the latest appointment to "RecordReleased"
        latestAppointment.status = AppointmentStatus.RecordReleased;

        // Call the storeRecord function from the MedicalRecordAccess contract to store the medical record
        medicalRecordAccess.storeRecord(_patientAddress, patient.name, _medicalRecord, age, latestAppointment.appointmentDate);

        // Transfer half of the fee to the patient
        require(dehToken.transfer(_patientAddress, halfFee), "Token transfer to patient failed");
    }




function getAllAppointments() public view returns (Appointment[] memory) {
    // Ensure that the message sender is the hospital
    require(msg.sender == hospital, "Only hospital can access all appointments");

    // Calculate the total number of appointments
    uint totalAppointments;
    for (uint i = 0; i < patientAddresses.length; i++) {
        totalAppointments += patients[patientAddresses[i]].appointments.length;
    }

    // Create a dynamic array to store all appointments
    Appointment[] memory allAppointmentsCombined = new Appointment[](totalAppointments);
    uint index = 0;

    // Iterate through all patient addresses and concatenate their appointments
    for (uint i = 0; i < patientAddresses.length; i++) {
        address patientAddress = patientAddresses[i];
        Patient storage patient = patients[patientAddress];

        for (uint j = 0; j < patient.appointments.length; j++) {
            allAppointmentsCombined[index++] = patient.appointments[j];
        }
    }

    return allAppointmentsCombined;
}



    function getPatientAppointments() public view returns (Appointment[] memory) {
        return patients[msg.sender].appointments;
    }

    function getPatientDetails(address patientAddress) public view returns (string memory, uint) {
        // Retrieve patient details using their address
        Patient memory patient = patients[patientAddress];
        // Return name and age of the patient
        return (patient.name, patient.age);
    }
}
