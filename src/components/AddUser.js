// src/components/AddUser.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/addpatient.css'; // Reusing the existing CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3001/addUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      navigate('/dashboard/users');
    } else {
      alert('Error adding user. Please try again.');
    }
  };

  return (
    <div className="add-patient-container">
      <div className="add-patient-content">
        <h2>Ajouter Utilisateur</h2>
        <form className="patient-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="floating-label">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faUser} className="input-icon" />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="floating-label">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faLock} className="input-icon" />
          </div>
          <button type="submit" className="submit-button">Valider</button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
