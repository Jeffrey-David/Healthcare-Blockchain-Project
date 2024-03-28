// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract MedicalRecordAccess {
    struct Patient {
        address patientAddress; // Address of the patient
        string name;
        string[] medicalRecords; 
        mapping(address => bool) accessList;
        mapping(address => AccessRequest[]) accessRequests; // Mapping from requester address to access requests
    }

    struct ThirdParty {
        address thirdPartyAddress;
        address[] patientAccessList;
    }

    struct AccessRequest {
        address requester; // Address of the requester
        uint requestedDate; // Timestamp when the request was made
        uint approvedDate; // Timestamp when the request was approved
        bool isApproved; // Flag indicating whether the request is approved or not
    }

    mapping(address => Patient) public patients;
    mapping(address => bool) public isPatient;
    address[] public allPatients;
    mapping(address => ThirdParty) public thirdParties;

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



    function grantAccess(address _patient, address payable _thirdParty) public {
        require(msg.sender == _patient, "Only patient can grant access");
        patients[_patient].accessList[_thirdParty] = true;
        thirdParties[_thirdParty].patientAccessList.push(_patient);

        approveAccessRequest(_patient, _thirdParty);
    }

    function requestAccess() public {
        Patient storage patient = patients[msg.sender];
        require(!patient.accessList[msg.sender], "Sender already has access to records");
        
        // Add access request to the patient's access requests list
        addAccessRequest(msg.sender, block.timestamp);
    }

    function revokeAccess(address _thirdParty) public {
        require(msg.sender == patients[_thirdParty].patientAddress, "Only patient can revoke access");
        patients[_thirdParty].accessList[_thirdParty] = false;
        for (uint i = 0; i < thirdParties[_thirdParty].patientAccessList.length; i++) {
            if (thirdParties[_thirdParty].patientAccessList[i] == msg.sender) {
                delete thirdParties[_thirdParty].patientAccessList[i];
                break;
            }
        }

        revokeAccessRequest(_thirdParty);
    }

    function approveAccessRequest(address _patient, address _thirdParty) internal {
        patients[_patient].accessRequests[_thirdParty][patients[_patient].accessRequests[_thirdParty].length - 1].approvedDate = block.timestamp;
        patients[_patient].accessRequests[_thirdParty][patients[_patient].accessRequests[_thirdParty].length - 1].isApproved = true;
    }

    function rejectAccessRequest(address _patient, address _thirdParty) internal {
        delete patients[_patient].accessRequests[_thirdParty][patients[_patient].accessRequests[_thirdParty].length - 1];
    }

    function addAccessRequest(address _requester, uint _requestedDate) internal {
        patients[msg.sender].accessRequests[_requester].push(AccessRequest(_requester, _requestedDate, 0, false));
    }

    function revokeAccessRequest(address _thirdParty) internal {
        delete patients[msg.sender].accessRequests[_thirdParty][patients[msg.sender].accessRequests[_thirdParty].length - 1];
    }

    function listAllPatients() public view returns (address[] memory) {
        return allPatients;
    }

    function listMedicalRecords(address _patient) public view returns (string[] memory) {
        require(patients[_patient].accessList[msg.sender], "Sender not authorized to access records");
        return patients[_patient].medicalRecords;
    }

    function listAccessRequests(address _patient) public view returns (AccessRequest[] memory) {
        require(msg.sender == _patient, "Only patient can list access requests");
        return patients[_patient].accessRequests[msg.sender];
    }
}
