// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddPatient from './components/AddPatient';
import './css/global.css'; // Import global styles
import UpdatePatient from './components/UpdatePatient';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/dashboard/patients/addPatient" element={<AddPatient />} />
        <Route path="/dashboard/patients/updatePatient" element={<UpdatePatient />} />
      </Routes>
    </Router>
  );
};

export default App;