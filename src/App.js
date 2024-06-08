// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AddPatient from './components/AddPatient';
import UpdatePatient from './components/UpdatePatient';
import './css/global.css'; // Import global styles

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard/*"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/patients/addPatient"
            element={
              <PrivateRoute>
                <AddPatient />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard/patients/updatePatient"
            element={
              <PrivateRoute>
                <UpdatePatient />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
