// Users.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import '../css/users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchUsers = useCallback(() => {
    fetch('http://localhost:3001/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const response = await fetch('http://localhost:3001/deleteUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (data.success) {
        fetchUsers();
      } else {
        alert('Error deleting user. Please try again.');
      }
    }
  };

  const handleEdit = (user) => {
    navigate(`/dashboard/users/updateUser`, { state: { user } });
  };

  const handleAddNew = () => {
    navigate('/dashboard/users/addUser');
  };

  return (
    <div className="users">
      <div className="title-header">
        <div className="actions">
          <input
            type="text"
            placeholder="Rechercher"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button className="new-user-button" onClick={handleAddNew}>
            <FontAwesomeIcon className='plus-icon icon-white' icon={faPlus} />
            Nouvel Utilisateur
          </button>
        </div>
      </div>
      <table className="users-table">
        <thead>
          <tr>
            <th>Nom d'utilisateur</th>
            <th>Mot de passe</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>********</td>
              <td className="actions-icons">
                <FontAwesomeIcon className='icon' icon={faEdit} onClick={() => handleEdit(user)} />
                <FontAwesomeIcon className='icon' icon={faTrash} onClick={() => handleDelete(user.id)} />
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="3">Aucun utilisateur enregistré</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
