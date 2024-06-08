// src/components/Patients.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import '../css/patients.css';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/patients')
      .then(response => response.json())
      .then(data => setPatients(data))
      .catch(err => console.error('Error fetching patients:', err));
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPatients = patients.filter(patient =>
    patient.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="patients">
      <div className="title-header">
        <h2>Les patients</h2>
        <div className="actions">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button className="new-patient-button">
            <FontAwesomeIcon className='plus-icon icon-white' icon={faPlus} />
            New Patient
          </button>
        </div>
      </div>
      <table className="patients-table">
        <thead>
          <tr>
            <th>Nom Complet</th>
            <th>Numero Telephone</th>
            <th>Type</th>
            <th>Progres des seances</th>
            <th>NB des Seances</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.length > 0 ? filteredPatients.map(patient => (
            <tr key={patient.id}>
              <td>{patient.fullName}</td>
              <td>{patient.phoneNumber}</td>
              <td>{patient.type}</td>
              <td>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div className="progress" style={{ width: `${(patient.completedSessions / patient.totalSessions) * 100}%` }}></div>
                  </div>
                  <span className="progress-value">{patient.completedSessions}/{patient.totalSessions}</span>
                </div>
              </td>
              <td>{patient.totalSessions} seances</td>
              <td className="actions-icons">
                <FontAwesomeIcon className='icon' color='#265365' icon={faEdit} />
                <FontAwesomeIcon className='icon' color='#265365' icon={faTrash} />
                <FontAwesomeIcon className='icon' color='#265365' icon={faEllipsisV} />
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6">No patients available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Patients;
