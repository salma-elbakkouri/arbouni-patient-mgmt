import React, { useEffect, useState, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import axios from 'axios';
import '../css/statistics.css';

Chart.register(...registerables);

const Statistics = () => {
  const [stats, setStats] = useState({
    treatmentSessions: [],
    treatmentTypes: [],
    totalPatients: 0,
  });

  const doughnutChartRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:3001/api/statistics')
      .then(response => {
        setStats(response.data);
      })
      .catch(error => {
        console.error('Error fetching statistics:', error);
      });
  }, []);

  useEffect(() => {
    if (doughnutChartRef.current) {
      const chart = doughnutChartRef.current;
      const legendContainer = document.getElementById('doughnut-chart-legend');
      if (legendContainer && chart.data.datasets.length) {
        const colors = chart.data.datasets[0].backgroundColor;
        const labels = chart.data.labels;
        legendContainer.innerHTML = labels.map((label, i) => `
          <div class="legend-item">
            <div class="legend-color-box" style="background-color: ${colors[i]}"></div>
            <span>${label}</span>
          </div>
        `).join('');
      }
    }
  }, [stats]);

  const treatmentSessionsData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{
      borderRadius: 4,
      label: 'Treatment Sessions',
      data: stats.treatmentSessions,
      backgroundColor: 'black',
      borderColor: 'black',
      borderWidth: 1,
    }],
  };

  const treatmentTypesData = {
    labels: stats.treatmentTypes.map(type => type.type),
    datasets: [{
      data: stats.treatmentTypes.map(type => type.totalSessions),
      backgroundColor: ['#D2DEE3', '#9DB4BD', '#5595AF', '#14607E', "#435F6B", "#243C46"],
    }],
  };

  const lineChartData = {
    labels: stats.treatmentSessions.map((_, i) => `Day ${i + 1}`),
    datasets: [{
      label: 'Patients',
      data: stats.treatmentSessions,
      fill: false,
      backgroundColor: '#D2DEE3',
      borderColor: '#9DB4BD',
    }],
  };

  return (
    <div className="statistics-container">
      <div className="stat-box treatmentSessionsData-box">
        <Bar data={treatmentSessionsData} />
      </div>
      <div className="stat-box lineChartData-box">
        <Line data={lineChartData} />
      </div>
      <div className="stat-box treatmentTable-box">
        <table>
          <thead>
            <tr>
              <th>Traitement</th>
              <th className="right-align">Seances</th>
              <th className="right-align">Termines</th>
            </tr>
          </thead>
          <tbody>
            {stats.treatmentTypes.map((type, index) => (
              <tr key={index}>
                <td className="source-column">{type.type}</td>
                <td className="right-align">{type.totalSessions}</td>
                <td className="right-align">{type.percentageCompleted}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="stat-box treatmentTypesData-box">
        <h3>Type de Traitements</h3>
        <Doughnut ref={doughnutChartRef} data={treatmentTypesData} options={{ plugins: { legend: { display: false } } }} />
      </div>
      
    </div>
  );
};

export default Statistics;
