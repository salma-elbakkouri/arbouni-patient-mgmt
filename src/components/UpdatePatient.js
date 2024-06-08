import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/updatepatient.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faAsterisk, faSuitcaseMedical, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const UpdatePatient = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(state?.patient || {});
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [type, setType] = useState('');
  const [totalSessions, setTotalSessions] = useState('');
  const [completedSessions, setCompletedSessions] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (patient) {
      setFullName(patient.fullName);
      setPhoneNumber(patient.phoneNumber);
      setType(patient.type);
      setTotalSessions(patient.totalSessions);
      setCompletedSessions(patient.completedSessions);

      // Adjust the time to local time zone
      const localDate = new Date(patient.date);
      const offset = localDate.getTimezoneOffset();
      localDate.setMinutes(localDate.getMinutes() - offset);
      setAppointmentDate(localDate.toISOString().slice(0, 16));
    }
  }, [patient]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseInt(completedSessions) > parseInt(totalSessions)) {
      setError("Les séances complétées ne peuvent pas être supérieures au nombre total de séances. Veuillez réinsérer.");
      return;
    }

    const response = await fetch('http://localhost:3001/updatePatient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        id: patient.id,
        fullName, 
        phoneNumber, 
        type, 
        totalSessions, 
        completedSessions,
        date: appointmentDate,
      }),
    });

    const data = await response.json();

    if (data.success) {
      navigate('/dashboard/patients');
    } else {
      alert('Error updating patient. Please try again.');
    }
  };

  return (
    <div className="add-patient-container">
      <div className="add-patient-content">
        <h2>Modifier Patient</h2>
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
          <div className="form-group">
            <label htmlFor="completedSessions" className="floating-label">Séances Complétées</label>
            <input
              type="number"
              id="completedSessions"
              name="completedSessions"
              value={completedSessions}
              onChange={(e) => setCompletedSessions(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faAsterisk} className="input-icon" />
          </div>
          <div className="form-group">
            <label htmlFor="appointmentDate" className="floating-label">Date et Heure de Rendez-vous</label>
            <input
              type="datetime-local"
              id="appointmentDate"
              name="appointmentDate"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faCalendarAlt} className="input-icon" />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">Valider</button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePatient;
