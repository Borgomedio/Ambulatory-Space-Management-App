
// components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ utente, onLogout }) {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Gestione Ambulatori</h1>
      </div>
      
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/pianificazione" 
            className={`nav-link ${location.pathname === '/pianificazione' ? 'active' : ''}`}
          >
            Pianificazione
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/reportistica" 
            className={`nav-link ${location.pathname === '/reportistica' ? 'active' : ''}`}
          >
            Reportistica
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/storico" 
            className={`nav-link ${location.pathname === '/storico' ? 'active' : ''}`}
          >
            Storico Modifiche
          </Link>
        </li>
      </ul>
      
      <div className="navbar-user">
        <div className="user-info">
          <img src={utente.avatar} alt="Profilo" className="user-avatar" />
          <div className="user-details">
            <span className="user-name">{utente.nome}</span>
            <span className="user-role">{utente.ruolo}</span>
          </div>
        </div>
        <button className="logout-button" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;