import React from 'react';
import './FrontPage.css';
import { useNavigate } from 'react-router-dom';

const FrontPage = () => {
  const navigate = useNavigate();

  return (
    <div className="frontpage-container">
      <div className="overlay">
        <h1 className="title">BIG SHOT</h1>
        <p className="subtitle">The Ultimate Betting Experience</p>
        <button className="start-btn" onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    </div>
  );
};

export default FrontPage;
