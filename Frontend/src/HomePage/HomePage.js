import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="content">
        <h1 className="title">Welcome to EduTrack</h1>
        <p className="subtitle">Empowering education through innovative tracking</p>
        <div className="button-container">
          <Link to="/authpage" className="btn btn-login">Get Started!</Link>
        </div>
      </div>
      <div className="animated-background"></div>
    </div>
  );
};

export default HomePage;

