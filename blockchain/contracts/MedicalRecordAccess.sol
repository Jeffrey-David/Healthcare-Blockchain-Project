// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.10;

contract MedicalRecordAccess {
    struct Patient {
        address patientAddress; // Address of the patient
        string name;
        string[] medicalRecords; 
        mapping(address => bool) accessList; // Mapping of third-party addresses to access status
    }

    struct AccessListItem {
        address thirdParty;
        bool hasAccess;
    }

    mapping(address => Patient) public patients;
    mapping(address => bool) public isPatient;
    mapping(address => bool) public isThirdParty;
    address[] public allPatients;
    address[] public allThirdParties;

    constructor() {}

    function storeRecord(address _patientAddress, string memory _patientName, string memory _medicalRecord) public {
        Patient storage patient = patients[_patientAddress];
        patient.name = _patientName;
        patient.medicalRecords.push(_medicalRecord);
        if (!isPatient[_patientAddress]) {
            allPatients.push(_patientAddress);
            isPatient[_patientAddress] = true;
        }
    }

    function addThirdParty(address _thirdParty) public {
        require(!isPatient[_thirdParty], "Address is already registered as a patient");
        if (!isThirdParty[_thirdParty]) {
            allThirdParties.push(_thirdParty);
            isThirdParty[_thirdParty] = true;
        }
    }

    function grantAccess(address _patient, address _thirdParty) public {
        require(isPatient[_patient], "Patient does not exist");
        patients[_patient].accessList[_thirdParty] = true;
    }

    function revokeAccess(address _patient, address _thirdParty) public {
        require(isPatient[_patient], "Patient does not exist");
        patients[_patient].accessList[_thirdParty] = false;
    }

    function listAccessList(address _patient) public view returns (AccessListItem[] memory) {
        Patient storage patient = patients[_patient];
        AccessListItem[] memory accessList = new AccessListItem[](allThirdParties.length);
        for (uint i = 0; i < allThirdParties.length; i++) {
            address thirdParty = allThirdParties[i];
            bool hasAccess = patient.accessList[thirdParty];
            accessList[i] = AccessListItem(thirdParty, hasAccess);
        }
        return accessList;
    }

    function requestAccess(address _patient) public {
        require(!isPatient[msg.sender], "Sender is already registered as a patient");
        patients[_patient].accessList[msg.sender] = false; // By default, access is requested but not granted
        addThirdParty(msg.sender);
    }

    function getMedicalRecords(address _patient) public view returns (string[] memory) {
        require(isPatient[_patient], "Patient does not exist");
        if (_patient == msg.sender || patients[_patient].accessList[msg.sender]) {
            return patients[_patient].medicalRecords;
        } else {
            revert("Access denied");
        }
    }
}
