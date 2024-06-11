import React from 'react';
// import '../css/dashboardpage.css';
import { FaUser, FaHeartbeat, FaProcedures, FaStethoscope } from 'react-icons/fa';
import doctorImage from '../assets/doctor.png';

const Dashboardpage = () => {
    return (
        <div className="dashboard-container">
            <div className="stats-container">
                <div className="stat-box">
                    <div className="stat-icon"><FaUser /></div>
                    <div className="stat-info">
                        <div className="stat-number">1200</div>
                        <div className="stat-label">patients</div>
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-icon"><FaHeartbeat /></div>
                    <div className="stat-info">
                        <div className="stat-number">2000</div>
                        <div className="stat-label">séances</div>
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-icon"><FaProcedures /></div>
                    <div className="stat-info">
                        <div className="stat-number">702</div>
                        <div className="stat-label">patients de Kinésithérapie</div>
                    </div>
                </div>
                <div className="stat-box">
                    <div className="stat-icon"><FaStethoscope /></div>
                    <div className="stat-info">
                        <div className="stat-number">524</div>
                        <div className="stat-label">patients de Physiothérapie</div>
                    </div>
                </div>
            </div>
            <div className="header-container">
                <div className="header-info">
                    <div className="header-title">Tableau de Bord</div>
                    <div className="header-subtitle">Centre Arbouni</div>
                </div>
                <div className="header-image">
                    <img src={doctorImage} alt="Doctor" />
                </div>
            </div>
        </div>
    );
};

export default Dashboardpage;
