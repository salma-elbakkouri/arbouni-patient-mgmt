// src/components/Menu.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChartBar, faUserShield, faCog, faSignOutAlt, faHospitalUser , faBarsStaggered , faChartPie} from '@fortawesome/free-solid-svg-icons';
import '../css/menu.css';
import logo from '../assets/logoblue.png'; // Import the logo image

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('');

  useEffect(() => {
    const path = location.pathname.split('/')[2] || 'dashboard';
    setActiveItem(path);
  }, [location]);

  const menuItems = [
    { name: 'dashboard', label: 'Tableau de bord', icon: faBarsStaggered },
    { name: 'patients', label: 'Patients', icon: faHospitalUser },
    { name: 'statistics', label: 'Statistiques', icon: faChartPie },
    { name: 'users', label: 'Utilisateurs', icon: faUsers },
    { name: 'settings', label: 'Parametres', icon: faCog },
    { name: 'logout', label: 'Se deconnecter', icon: faSignOutAlt, className: 'logout-item' },
  ];

  const handleMenuClick = (name) => {
    if (name === 'logout') {
      if (window.confirm('Are you sure you want to log out?')) {
        fetch('http://localhost:3001/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            navigate('/');
          } else {
            alert('Logout failed');
          }
        })
        .catch(err => {
          console.error('Logout error:', err);
          alert('Logout error');
        });
      }
    } else {
      setActiveItem(name);
      navigate(`/dashboard/${name}`);
    }
  };

  return (
    <div className="app-container">
      <div className="menu">
        <div className='menu-header'>
          <img src={logo} alt="logo" />
          <div className='header-text'>
            <h2>Centre Arbouni</h2>
          </div>
        </div>
        <div className="menu-items">
          {menuItems.slice(0, -1).map(item => (
            <div
              key={item.name}
              className={`menu-item ${item.className || ''} ${activeItem === item.name ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.name)}
            >
              <FontAwesomeIcon className='icon' icon={item.icon} />
              {item.label}
            </div>
          ))}
          <div
            key={menuItems[menuItems.length - 1].name}
            className={`menu-item ${menuItems[menuItems.length - 1].className || ''} ${activeItem === menuItems[menuItems.length - 1].name ? 'active' : ''}`}
            onClick={() => handleMenuClick(menuItems[menuItems.length - 1].name)}
          >
            <FontAwesomeIcon className='icon' icon={menuItems[menuItems.length - 1].icon} />
            {menuItems[menuItems.length - 1].label}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
