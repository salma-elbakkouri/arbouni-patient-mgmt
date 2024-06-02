import React from 'react';
import '../css/login.css';
import doctorImg from '../assets/doctor.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-content">
        <img src={doctorImg} alt="Doctor" className="login-image" />
        <div className="login-form">
          <h2>Bienvenue Admin</h2>
          <form className="user-form">
            <div className="form-group">
              <label htmlFor="username" className="floating-label">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                name="username"
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
                required
              />
              <FontAwesomeIcon icon={faKey} className="input-icon" />
            </div>
            <button type="submit" className="submit-button">Se connecter</button>
            <p className="footer-text">Mot de passe oublié ?</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
