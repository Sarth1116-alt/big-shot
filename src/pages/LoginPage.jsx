import React from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { FaUserAlt, FaLock } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/game');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">WELCOME TO BIG-SHOT</h1>
        <p className="login-subtitle">Enter the arena. Bet Bold. Win Big.</p>
        <form onSubmit={handleLogin}>
          <div className="input-wrapper">
            <FaUserAlt className="input-icon" />
            <input type="text" placeholder="Username" required />
          </div>
          <div className="input-wrapper">
            <FaLock className="input-icon" />
            <input type="password" placeholder="Password" required />
          </div>
          <button type="submit" className="login-btn">ENTER GAME</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
