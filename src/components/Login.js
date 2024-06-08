// src/components/Login.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';
import doctorImg from '../assets/doctor.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      login('dummy-token');
      navigate('/dashboard/patients');
    } else {
      setError('Identifiants incorrects. Veuillez réessayer');
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <img src={doctorImg} alt="Doctor" className="login-image" />
        <div className="login-form">
          <h2>Bienvenue Admin</h2>
          <form className="user-form" onSubmit={handleSubmit}>
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
              <FontAwesomeIcon icon={faKey} className="input-icon" />
            </div>
            <button type="submit" className="submit-button">Se connecter</button>
            {error && <div className="error-box">{error}</div>}
            <p className="footer-text">Mot de passe oublié ?</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
