import React, { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import '../css/statistics.css';

const Statistics = () => {
  const [data, setData] = useState({
    treatmentSessions: [],
    treatmentTypes: [],
    totalPatients: 0,
  });

  useEffect(() => {
    // Fetch data from the server
    axios.get('/api/statistics').then((response) => {
      setData(response.data);
    });
  }, []);

  const treatmentSessionsData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    datasets: [
      {
        label: 'Séance de Traitement',
        data: data.treatmentSessions,
        backgroundColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  const treatmentTypesData = {
    labels: data.treatmentTypes.map((type) => type.name),
    datasets: [
      {
        data: data.treatmentTypes.map((type) => type.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className="statistics-container">
      <div className="chart-container">
        <h2>Séance de Traitement</h2>
        <Bar data={treatmentSessionsData} />
      </div>
      <div className="chart-container">
        <h2>Type de Traitements</h2>
        <Doughnut data={treatmentTypesData} />
      </div>
      <div className="summary-container">
        <h2>Total Patients</h2>
        <div className="total-patients">{data.totalPatients}</div>
      </div>
    </div>
  );
};

export default Statistics;
