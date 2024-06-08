// src/components/AddPatient.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/addpatient.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faLock, faAsterisk , faSuitcaseMedical } from '@fortawesome/free-solid-svg-icons';

const AddPatient = () => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [type, setType] = useState('');
  const [totalSessions, setTotalSessions] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3001/addPatient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullName, phoneNumber, type, totalSessions }),
    });

    const data = await response.json();

    if (data.success) {
      navigate('/dashboard/patients');
    } else {
      alert('Error adding patient. Please try again.');
    }
  };

  return (
    <div className="add-patient-container">
      <div className="add-patient-content">
        <h2>Ajouter Patient</h2>
        <form className="patient-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName" className="floating-label">Nom Complet</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faUser} className="input-icon" />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber" className="floating-label">Numero Telephone</label>
            <input
              type="number"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faPhone} className="input-icon" />
          </div>
          <div className="form-group">
            <label htmlFor="type" className="floating-label">Type de Service</label>
            <select
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value=""></option>
              <option value="Kinésithérapie">Kinésithérapie</option>
              <option value="Physiothérapie">Physiothérapie</option>
              <option value="Rééducation">Rééducation</option>
              <option value="Ostéopathie">Ostéopathie</option>
              <option value="Réhabilitation Sportive">Réhabilitation Sportive</option>
              <option value="Acupuncture">Acupuncture</option>
            </select>
            <FontAwesomeIcon icon={faSuitcaseMedical} className="input-icon" />
          </div>
          <div className="form-group">
            <label htmlFor="totalSessions" className="floating-label">Nombre de Seances</label>
            <input
              type="number"
              id="totalSessions"
              name="totalSessions"
              value={totalSessions}
              onChange={(e) => setTotalSessions(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faAsterisk} className="input-icon" />
          </div>
          <button type="submit" className="submit-button">Valider</button>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;
