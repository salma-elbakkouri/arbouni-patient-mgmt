// src/components/Dashboard.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Menu from './Menu';
import Patients from './Patients';
import Statistics from './Statistics';
import '../css/dashboard.css';
import Dashboardpage from './Dashboardpage';
import Users from './Users'; 

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Menu />
      <div className="content">
        <Routes>
          <Route path="/dashboard" element={<Dashboardpage />} />
          <Route path="patients" element={<Patients />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="users" element={<Users />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
