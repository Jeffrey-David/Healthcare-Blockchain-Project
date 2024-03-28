// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MedicalRecordAccess.sol"; // Import the other smart contract
import "./DEHToken.sol";

contract MedicalAppointment {
    enum AppointmentStatus { Pending, Paid, Confirmed, ServiceProvided, RecordReleased }

    struct Appointment {
        uint bookingId;
        uint fee;
        uint appointmentDate;
        string appointmentSlot;
        AppointmentStatus status;
    }

    struct Patient {
        address patientAddress;
        string name;
        Appointment[] appointments;
    }

    address public hospital;
    mapping(address => Patient) public patients;
    mapping(address => Appointment[]) public allAppointments;
    IERC20 public dehToken;
    MedicalRecordAccess public medicalRecordAccess; // Instance of the other smart contract

    constructor(address _hospital, address _dehTokenAddress, address _medicalRecordAccess) {
        hospital = _hospital;
        dehToken = IERC20(_dehTokenAddress);
        medicalRecordAccess = MedicalRecordAccess(_medicalRecordAccess); // Initialize the instance
    }

    function requestAppointment(uint _bookingId, uint _fee, uint _appointmentDate, string memory _appointmentSlot, string memory _name) public {
        Patient storage patient = patients[msg.sender];
        patient.patientAddress = msg.sender;
        patient.name = _name;
        patient.appointments.push(Appointment(_bookingId, _fee, _appointmentDate, _appointmentSlot, AppointmentStatus.Pending));
        
        allAppointments[msg.sender].push(Appointment(_bookingId, _fee, _appointmentDate, _appointmentSlot, AppointmentStatus.Pending));
    }

    function payAppointmentFee(uint _patientIndex) public {
        Patient storage patient = patients[msg.sender];
        Appointment storage appointment = patient.appointments[_patientIndex];
        require(appointment.status == AppointmentStatus.Pending, "Appointment status must be Pending");
        require(dehToken.transferFrom(msg.sender, address(this), appointment.fee), "Insufficient allowance or balance");
        appointment.status = AppointmentStatus.Paid;
    }

    function confirmAppointment(uint _patientIndex) public {
        Patient storage patient = patients[msg.sender];
        Appointment storage appointment = patient.appointments[_patientIndex];
        require(appointment.status == AppointmentStatus.Paid, "Appointment status must be Paid");
        appointment.status = AppointmentStatus.Confirmed;
    }

    function provideService(uint _patientIndex) public {
        Patient storage patient = patients[msg.sender];
        Appointment storage appointment = patient.appointments[_patientIndex];
        require(appointment.status == AppointmentStatus.Confirmed, "Appointment status must be Confirmed");
        appointment.status = AppointmentStatus.ServiceProvided;
    }

    function acknowledgeConfirmation(uint _patientIndex) public {
        Patient storage patient = patients[msg.sender];
        Appointment storage appointment = patient.appointments[_patientIndex];
        require(appointment.status == AppointmentStatus.Confirmed, "Appointment status must be Confirmed");
    }

    function releaseMedicalRecord(uint _patientIndex, string memory _medicalRecord) public {
        Patient storage patient = patients[msg.sender];
        Appointment storage appointment = patient.appointments[_patientIndex];
        require(appointment.status == AppointmentStatus.ServiceProvided, "Appointment status must be Service Provided");
        require(dehToken.transfer(msg.sender, appointment.fee), "Token transfer failed");
        appointment.status = AppointmentStatus.RecordReleased;

        // Call the storeRecord function from the MedicalRecordAccess contract
        medicalRecordAccess.storeRecord(patient.patientAddress, _medicalRecord);
    }

    function getAllAppointments() public view returns (Appointment[] memory) {
        return allAppointments[msg.sender];
    }

    function getPatientAppointments(address _patientAddress) public view returns (Appointment[] memory) {
        return patients[_patientAddress].appointments;
    }
}
