import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import '../css/dashboardpage.css'; // Ensure this CSS file is created and linked
import doctorImage from '../assets/doctor.png';
import { FaUser, FaHeartbeat, FaProcedures, FaStethoscope } from 'react-icons/fa';

Chart.register(...registerables);

const Dashboardpage = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalSessions: 0,
        topServices: [],
    });
    const chartRef = useRef(null);

    useEffect(() => {
        axios.get('http://localhost:3001/api/statistics')
            .then(response => {
                const { totalPatients, treatmentTypes } = response.data;
                const sortedTypes = [...treatmentTypes].sort((a, b) => b.totalSessions - a.totalSessions);
                setStats({
                    totalPatients,
                    totalSessions: sortedTypes.reduce((sum, type) => sum + type.totalSessions, 0),
                    topServices: sortedTypes.slice(0, 2),
                });

                // Initialize the chart
                const chart = new Chart(chartRef.current, {
                    type: 'line', // Change this to any other chart type if needed
                    data: {
                        labels: sortedTypes.map(type => type.type),
                        datasets: [{
                            label: 'Seances',
                            data: sortedTypes.map(type => type.totalSessions),
                            borderColor: 'rgba(77, 134, 156, 0.7)',
                            backgroundColor: 'rgba(77, 134, 156, 0.3)',
                            fill: true,
                        }]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Type de Traitment'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Total des Seances'
                                }
                            }
                        }
                    }
                });

                return () => {
                    chart.destroy();
                };
            })
            .catch(error => {
                console.error('Error fetching statistics:', error);
            });
    }, []);

    return (
        <div className="dashboard-container">
            <div className="common-container">
                <div className="top-container">
                    <div className="card-container">
                        <div className="stat-card">
                            <FaUser className="icon" />
                            <div className='stat-card-values'>
                                <div className="stat-number">{stats.totalPatients}</div>
                                <div className="stat-label">patients</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <FaHeartbeat className="icon" />
                            <div className='stat-card-values'>
                                <div className="stat-number">{stats.totalSessions}</div>
                                <div className="stat-label">séances</div>
                            </div>
                        </div>
                        {stats.topServices.map((service, index) => (
                            <div key={index} className="stat-card">
                                <FaProcedures className="icon" />
                                <div className='stat-card-values'>
                                    <div className="stat-number">{service.totalSessions}</div>
                                    <div className="stat-label">Seances de {service.type}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="gradient-card">
                        <div className="gradient-card-content">
                            <div className="text-content">
                                <div className="title">Tableau de Bord</div>
                                <div className="subtitle">Centre Arbouni</div>
                            </div>
                            <div className="image-content">
                                <img src={doctorImage} alt="Doctor" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="chart-card">
                    <canvas ref={chartRef}></canvas>
                </div>
            </div>
        </div>
    );
};

export default Dashboardpage;
