import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChartBar, faUserShield, faCog, faSignOutAlt , faDashboard} from '@fortawesome/free-solid-svg-icons';
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
    { name: 'dashboard', label: 'Tableau de bord', icon: faDashboard },
    { name: 'patients', label: 'Patients', icon: faUsers },
    { name: 'statistics', label: 'Statistiques', icon: faChartBar },
    { name: 'users', label: 'Utilisateurs', icon: faUserShield },
    { name: 'settings', label: 'Parametres', icon: faCog },
    { name: 'logout', label: 'Se deconnecter', icon: faSignOutAlt, className: 'logout-item' },
  ];

  const handleMenuClick = (name) => {
    setActiveItem(name);
    navigate(`/dashboard/${name}`);
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
          {menuItems.map(item => (
            <div
              key={item.name}
              className={`menu-item ${item.className || ''} ${activeItem === item.name ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.name)}
            >
              <FontAwesomeIcon className='icon' icon={item.icon} />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
