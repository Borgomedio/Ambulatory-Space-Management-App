// components/Login.js
import React, { useState } from 'react';
import '../styles/Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username.trim() === '' || password.trim() === '') {
      setError('Inserisci username e password');
      return;
    }
    
    const success = onLogin(username, password);
    
    if (!success) {
      setError('Credenziali non valide');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Gestione Spazi Ambulatoriali</h1>
          <p>Accedi per gestire gli spazi ospedalieri</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Inserisci username"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Inserisci password"
            />
          </div>
          
          <button type="submit" className="login-button">Accedi</button>
        </form>
        
        <div className="login-help">
          <h3>Credenziali di test:</h3>
          <ul>
            <li><strong>Admin:</strong> username: admin, password: admin123</li>
            <li><strong>Medico:</strong> username: medico, password: medico123</li>
            <li><strong>Segreteria:</strong> username: segreteria, password: segreteria123</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;

