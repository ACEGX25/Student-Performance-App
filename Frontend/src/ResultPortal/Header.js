import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="header123">
      <div className="header-content123">
        <h1 className="logo123">EduTrack</h1>
        <nav className="nav-links123">
          <a href="#dashboard">Dashboard</a>
          <a href="#exams">Exams</a>
          <a href="#assignments">Assignments</a>
          <a href="#results" className="active">Results</a>
        </nav>
      </div>
    </header>
  );
}

