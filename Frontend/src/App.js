import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import StudentDash from './StudentDash/StudentDash';
import AuthPage from './AuthPage/AuthPage'
import HomePage from './HomePage/HomePage';

// Component for Handling Routes
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<HomePage />} />
      <Route path="/authpage" element={<AuthPage />} />
      <Route path="/student/dashboard" element={<StudentDash />} />
    </Routes>
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
