// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddPatient from './components/AddPatient';
import './css/global.css'; // Import global styles

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/dashboard/patients/addPatient" element={<AddPatient />} />
      </Routes>
    </Router>
  );
};

export default App;
