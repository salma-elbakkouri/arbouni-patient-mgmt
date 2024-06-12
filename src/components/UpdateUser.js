import React, { useState, useEffect } from 'react';
import '../css/updatepatient.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const UpdateUser = () => {
  const location = useLocation();
  const { user } = location.state || {};

  const [username, setUsername] = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.id,
          username,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setError('');
        navigate('/dashboard/users');
        alert('User updated successfully');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'utilisateur. Veuillez réessayer.');
    }
  };

  return (
    <div className="add-patient-container">
      <div className="add-patient-content">
        <h2>Modifier Utilisateur</h2>
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
            <label htmlFor="currentPassword" className="floating-label">Mot de passe actuel</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faLock} className="input-icon" />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword" className="floating-label">Nouveau mot de passe</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faLock} className="input-icon" />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword" className="floating-label">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={faLock} className="input-icon" />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">Valider</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
