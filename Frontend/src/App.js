import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import StudentDash from './StudentDash/StudentDash';
import AuthPage from './AuthPage/AuthPage'
import HomePage from './HomePage/HomePage';
import UserProfile from './UserProfile/UserProfile';
import TeacherDash from './TeacherDash/TeacherDash'
import Inter from './Interpage/Inter'
import Admin from './Admin/Admin'
import ResultPortal from './ResultPortal/ResultPortal';
import Time from './Admin/Assist/Timetable'
import Search from './Admin/Assist/Search.js'
import Assignments from './Assignment_Board/Assignment';

// Component for Handling Routes
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<HomePage />} />
      <Route path="/authpage" element={<AuthPage />} />
        <Route path="/admin-dashboard" element={<Admin />}/>  
        <Route path="/admin-dashboard/Assist/Timetable" element={< Time/>} />
      <Route path="/fill-details" element={< Inter/>} />
      <Route path="/student/dashboard/:username" element={<StudentDash />} />
      <Route path="/student/profile/:username" element={<UserProfile />} />
        <Route path="/student/assignments" element={<Assignments />} />
      <Route path="/staff/dashboard/:username" element={<TeacherDash />}/>
      <Route path="/student/viewresult" element={<ResultPortal />}/>
      <Route path="/admin/time-table" element={<Time />}/>
        <Route path="/admin/Search" element={<Search />}/>
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
