// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract MedicalRecordAccess {
    struct Patient {
        address patientAddress; // Address of the patient
        string name;
        string[] medicalRecords; 
        mapping(address => AccessInfo[]) accessList; // Array of AccessInfo for each third party
    }

    struct AccessInfo {
        address thirdParty; // Address of the third party
        uint requestDate; // Timestamp when the request was made
        bool status; // Flag indicating whether the request is approved or not
    }

    mapping(address => Patient) public patients;
    mapping(address => bool) public isPatient;
    address[] public allPatients;
    mapping(address => bool) public isThirdParty;

    constructor() {}

    function storeRecord(address _patientAddress, string memory _patientName, string memory _medicalRecord) public {
        // Find the patient
        Patient storage patient = patients[_patientAddress];

        // Update the patient's name
        patient.name = _patientName;

        // Push the medical record to the patient's medical records array
        patient.medicalRecords.push(_medicalRecord);

        // Check if the patient is already registered
        if (!isPatient[_patientAddress]) {
            // Add the patient to the list of all patients
            allPatients.push(_patientAddress);

            // Mark the patient as registered
            isPatient[_patientAddress] = true;
        }
    }

    function grantAccess(address _patient, address _thirdParty) public {
        require(msg.sender == _patient, "Only patient can grant access");
        patients[_patient].accessList[_thirdParty].push(AccessInfo(_thirdParty, block.timestamp, false));
    }

    function requestAccess(address _patient) public {
        require(!patients[_patient].accessList[msg.sender][0].status, "Sender already has access to records");
        
        // Add access request to the patient's access list with status as false
        patients[_patient].accessList[msg.sender].push(AccessInfo(msg.sender, block.timestamp, false));
    }

    function listAccessList() public view returns (AccessInfo[] memory) {
        return patients[msg.sender].accessList[msg.sender];
    }




    function approveAccessRequest(address _thirdParty) public {
        require(isPatient[msg.sender], "Only patient can approve access request");
        uint index = findAccessInfoIndex(msg.sender, _thirdParty);
        require(index != type(uint).max, "Access request not found");
        patients[msg.sender].accessList[_thirdParty][index].status = true;
    }


    function revokeAccess(address _thirdParty) public {
        require(isPatient[msg.sender], "Only patient can revoke access");
        uint index = findAccessInfoIndex(msg.sender, _thirdParty);
        require(index != type(uint).max, "Access request not found");
        patients[msg.sender].accessList[_thirdParty][index].status = false;
    }


    function findAccessInfoIndex(address _patient, address _thirdParty) internal view returns (uint) {
        AccessInfo[] storage accessInfos = patients[_patient].accessList[_thirdParty];
        for (uint i = 0; i < accessInfos.length; i++) {
            if (accessInfos[i].thirdParty == _thirdParty) {
                return i;
            }
        }
        // Return maximum value of uint256 to represent "not found"
        return type(uint).max;
    }

    function listAllPatients() public view returns (address[] memory) {
        return allPatients;
    }

    function listPatientMedicalRecords() public view returns (string[] memory) {
        address _patient = msg.sender;
        require(isPatient[_patient], "Only patient can access their own medical records");
        return patients[_patient].medicalRecords;
    }

    function listThirdPartyMedicalRecords(address _patient) public view returns (string[] memory) {
        require(isThirdParty[msg.sender], "Only third party can access patient's medical records");
        return patients[_patient].medicalRecords;
    }
}
