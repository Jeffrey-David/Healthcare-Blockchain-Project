import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './LoginForm.js';
import Patient from './Patient.js';
import Hospital from './Hospital';
import ThirdParty from './ThirdParty.js';
import MedicalRecord from './MedicalRecord.js';
import AccessRequest from './AccessRequest.js';
import ManageRecord from './ManageRecord.js';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/patient" element={<Patient />} />
                <Route path="/hospital" element={<Hospital />} />
                <Route path="/thirdparty" element={<ThirdParty />} />
                <Route path="/patient/medicalrecord" element={<MedicalRecord />} />
                <Route path="/patient/accessrequest" element={<AccessRequest />} />
                <Route path="/hospital/managerecord" element={<ManageRecord />} />
            </Routes>
        </Router>
    );
};

export default App;