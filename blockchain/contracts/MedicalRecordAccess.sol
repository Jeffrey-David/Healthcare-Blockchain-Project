// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.10;

contract MedicalRecordAccess {
    enum AccessStatus { NotRequested, Requested, Approved, Revoked }
    struct Patient {
        address patientAddress; // Address of the patient
        string name;
        uint age;
        string[] date;
        string[] medicalRecords; 
        mapping(address => AccessStatus) accessList; // Mapping of third-party addresses to access status
    }

    struct AccessListItem {
        address thirdParty;
        AccessStatus hasAccess;
    }

    mapping(address => Patient) public patients;
    mapping(address => bool) public isPatient;
    mapping(address => bool) public isThirdParty;
    address[] public allPatients;
    address[] public allThirdParties;

    constructor() {}

    function storeRecord(address _patientAddress, string memory _patientName, string memory _medicalRecord, uint age, string memory _date) public {
        Patient storage patient = patients[_patientAddress];
        patient.patientAddress = _patientAddress;
        patient.name = _patientName;
        patient.age = age;
        patient.date.push(_date);
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
            for (uint i = 0; i < allPatients.length; i++) {
                address patientAddress = allPatients[i];
                patients[patientAddress].accessList[_thirdParty] = AccessStatus.NotRequested;
            }
        }
    }

    function grantAccess(address _thirdParty) public {
        require(isPatient[msg.sender], "Patient does not exist");
        patients[msg.sender].accessList[_thirdParty] = AccessStatus.Approved;
    }

    function revokeAccess(address _thirdParty) public {
        require(isPatient[msg.sender], "Patient does not exist");
        patients[msg.sender].accessList[_thirdParty] = AccessStatus.Revoked;
    }

    function listAccessList() public view returns (AccessListItem[] memory) {
        Patient storage patient = patients[msg.sender];
        AccessListItem[] memory accessList = new AccessListItem[](allThirdParties.length);
        for (uint i = 0; i < allThirdParties.length; i++) {
            if (patient.accessList[allThirdParties[i]]==AccessStatus.NotRequested || patient.accessList[allThirdParties[i]]==AccessStatus.Revoked ){
                continue;
            }
            address thirdParty = allThirdParties[i];
            AccessStatus hasAccess = patient.accessList[thirdParty];
            accessList[i] = AccessListItem(thirdParty, hasAccess);
        }
        return accessList;
    }

    function requestAccess(address _patient) public {
        require(!isPatient[msg.sender], "Sender is already registered as a patient");
        addThirdParty(msg.sender);
        patients[_patient].accessList[msg.sender] = AccessStatus.Requested; // By default, access is requested but not granted

    }

    function getMedicalRecords(address _patient) public view returns (address, string memory, uint, string[] memory, string[] memory) {
        require(isPatient[_patient], "Patient does not exist");
        if (_patient == msg.sender || patients[_patient].accessList[msg.sender]==AccessStatus.Approved) {
            Patient storage patient = patients[_patient];
            return (patient.patientAddress, patient.name, patient.age, patient.date, patient.medicalRecords);
        } else {
            revert("Access denied");
        }
    }

    function getAccessRequests() public view returns (address[] memory, uint[] memory, string[] memory, string[] memory, string[] memory) {
        address _thirdParty = msg.sender;
        require(isThirdParty[_thirdParty], "Third party does not exist");
        address[] memory patientAddresses = new address[](allPatients.length);
        string[] memory names = new string[](allPatients.length);
        uint[] memory ages = new uint[](allPatients.length);
        string[] memory statuses = new string[](allPatients.length);
        string[] memory dates = new string[](allPatients.length);
        for (uint i = 0; i < allPatients.length; i++) {
            address patientAddress = allPatients[i];
            AccessStatus hasRequested = patients[patientAddress].accessList[_thirdParty];
            string memory name = patients[patientAddress].name;
            uint age = patients[patientAddress].age;
            string memory status;
            string memory date = patients[patientAddress].date[patients[patientAddress].date.length - 1];
            if (hasRequested == AccessStatus.Requested) {
                status = "Waiting For Approval";
            } else if (hasRequested == AccessStatus.Approved){
                status = "Approved";
            } else if (hasRequested == AccessStatus.Revoked){
                status = "No Access";
            }
            else {
                status = "Not Requested";
            }
            patientAddresses[i] = patientAddress;
            statuses[i] = status;
            names[i] = name;
            ages[i] = age;
            dates[i] = date;
        }
        return (patientAddresses, ages, dates, names, statuses);
    }

    function checkIsThirdParty(address _address) external view returns (bool) {
        return isThirdParty[_address];
    }


}
