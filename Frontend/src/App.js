import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import StudentDash from './StudentDash/StudentDash';
import AuthPage from './AuthPage/AuthPage'
import HomePage from './HomePage/HomePage';
import UserProfile from './UserProfile/UserProfile';
import TeacherDash from './TeacherDash/TeacherDash'
import Inter from './Interpage/Inter'

// Component for Handling Routes
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<HomePage />} />
      <Route path="/authpage" element={<AuthPage />} />
      <Route path="/fill-details" element={< Inter/>} />
      <Route path="/student/dashboard/:username" element={<StudentDash />} />
      <Route path="/student/profile/:username" element={<UserProfile />} />
      <Route path="/teacher/dashboard" element={<TeacherDash />}/>
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
