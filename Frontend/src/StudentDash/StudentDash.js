import React, { useState, useEffect } from 'react';
import { Bell, Book, Calendar, ChevronRight, User, Hash, AtSign, Briefcase, Users, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './StudentDash.css';

// Wrapper to handle access token expiry and refresh automatically
const fetchWithRefresh = async (url, options = {}) => {
  options.credentials = 'include'; // send cookies

  let response = await fetch(url, options);

  if (response.status === 401) {
    // Access token expired, try to refresh
    const refreshResponse = await fetch('http://localhost:8080/api/auth/refresh', {
      method: 'POST',
      credentials: 'include'
    });

    if (refreshResponse.ok) {
      // Retry original request
      response = await fetch(url, options);
    } else {
      throw new Error('Session expired. Please log in again.');
    }
  }

  return response;
};

const StudentDash = () => {
  const [notifications, setNotifications] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const username = localStorage.getItem('username'); // still OK for API endpoint

        if (!username) throw new Error('Username not available. Please log in again.');

        const response = await fetchWithRefresh(`http://localhost:8080/api/student/dashboard/${username}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Failed to fetch student data');

        const data = await response.json();
        console.log('API Response:', data);
        setStudentData(data);
        setNotifications(data.notifications || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      // Clear localStorage for non-sensitive info
      localStorage.removeItem('username');
      localStorage.removeItem('role');

      navigate('/authpage');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const CircularProgressBar = ({ percentage, label, color }) => (
    <div className="circular-progress">
      <svg viewBox="0 0 36 36" className="circular-chart">
        <path className="circle-bg"
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path className="circle"
          strokeDasharray={`${percentage}, 100`}
          style={{ stroke: color }}
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <text x="18" y="20.35" className="percentage">{percentage}</text>
      </svg>
      <span className="progress-label">{label}</span>
    </div>
  );

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100" id="daddy">
      <ul className="circles">
        {Array.from({ length: 10 }).map((_, i) => <li key={i}></li>)}
      </ul>

      <header className="app-header text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">EduTrack</h1>
          <nav className={`md:flex space-x-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <a href="#" className="block md:inline-block py-2 hover:text-blue-200">Dashboard</a>
            <a href="#" className="block md:inline-block py-2 hover:text-blue-200">Exams</a>
            <a href="#" className="block md:inline-block py-2 hover:text-blue-200">Assignments</a>
            <a href="/student/viewresult" className="block md:inline-block py-2 hover:text-blue-200">Results</a>
            <a href="#" className="block md:inline-block py-2 hover:text-blue-200" onClick={handleLogout}>Logout</a>
          </nav>
          <button className="md:hidden" onClick={toggleMenu}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <div className="welcome-header mb-6 p-6 bg-white rounded-lg shadow-md relative overflow-hidden">
          <div className="flex items-center relative z-10">
            <div className="mr-6">
              <img
                src={studentData?.photo ? `data:image/jpeg;base64,${studentData.photo}` : '/placeholder.svg?height=100&width=100'}
                alt={`${studentData?.name || "User"}'s profile`}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
              />
            </div>
            <h2 className="text-3xl font-semibold" id="aloha">Welcome, {studentData?.name || 'Student'}!</h2>
          </div>
          <div className="shape circle1"></div>
          <div className="shape circle2"></div>
          <div className="shape square1"></div>
          <div className="shape triangle1"></div>
          <div className="shape rectangle1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="feature-card bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Calendar className="w-8 h-8 text-blue-500 mr-2" />
              <h3 className="text-xl font-semibold">Upcoming Exams</h3>
            </div>
            <p className="text-gray-600">You have 2 exams scheduled this week.</p>
            <a href="#" className="custom-button text-blue-500 hover:underline mt-2 inline-block">View Schedule <ChevronRight className="inline w-4 h-4" /></a>
          </div>

          <div className="feature-card bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Book className="w-8 h-8 text-green-500 mr-2" />
              <h3 className="text-xl font-semibold">Assignments</h3>
            </div>
            <p className="text-gray-600">You have 3 pending assignments.</p>
            <a href="/student/assignments" className="custom-button text-green-500 hover:underline mt-2 inline-block">View Assignments <ChevronRight className="inline w-4 h-4" /></a>
          </div>

          <div className="feature-card bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <Bell className="w-8 h-8 text-yellow-500 mr-2 notification-pulse" />
              <h3 className="text-xl font-semibold">Notifications</h3>
            </div>
            <p className="text-gray-600">You have {notifications.length} new notifications.</p>
            <a href="#" className="custom-button text-yellow-500 hover:underline mt-2 inline-block">View All <ChevronRight className="inline w-4 h-4" /></a>
          </div>

          <div className="feature-card bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <User className="w-8 h-8 text-purple-500 mr-2" />
              <h3 className="text-xl font-semibold">Profile</h3>
            </div>
            <p className="text-gray-600">Update your personal information.</p>
            <Link to={`/student/profile/${studentData.username}`}
              className="custom-button text-purple-500 hover:underline mt-2 inline-block">
              Edit Profile <ChevronRight className="inline w-4 h-4" />
            </Link>
          </div>
        </div>

        {studentData && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md hover-effect">
            <h3 className="text-2xl font-semibold mb-4">Student Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-10 text-lg">
                <div className="flex items-center text-lg hover-effect p-0.5">
                  <User className="w-6 h-6 text-blue-500 mr-3" />
                  <p><strong>Name:</strong> {studentData.name}</p>
                </div>
                <div className="flex items-center text-lg hover-effect p-0.5">
                  <Hash className="w-6 h-6 text-green-500 mr-3" />
                  <p><strong>Roll No:</strong> {studentData.rollno}</p>
                </div>
                <div className="flex items-center text-lg hover-effect p-0.5">
                  <AtSign className="w-6 h-6 text-yellow-500 mr-3" />
                  <p><strong>Username:</strong> {studentData.username}</p>
                </div>
                <div className="flex items-center text-lg hover-effect p-0.5">
                  <Mail className="w-6 h-6 text-blue-500 mr-3" />
                  <p><strong>Email:</strong> {studentData.email}</p>
                </div>
                <div className="flex items-center text-lg hover-effect p-0.5">
                  <Briefcase className="w-6 h-6 text-purple-500 mr-3" />
                  <p><strong>Department:</strong> {studentData.department}</p>
                </div>
                <div className="flex items-center text-lg hover-effect p-0.5">
                  <Users className="w-6 h-6 text-red-500 mr-3" />
                  <p><strong>Gender:</strong> {studentData.gender}</p>
                </div>
              </div>
              <div>
                <h4 className="text-2xl font-semibold mb-5">Attendance</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${studentData.attendance}%` }}></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{studentData.attendance}% attendance</p>

                <h4 className="text-2xl font-semibold mb-5 mt-6">Performance</h4>
                <div className="flex justify-evenly mb-4">
                  <CircularProgressBar
                    percentage={studentData.previous_scores}
                    label="Previous Scores"
                    color="#2ecc71"
                  />
                  <CircularProgressBar
                    percentage={studentData.exam_score}
                    label="Recent Exam Score"
                    color="#e74c3c"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 EduTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default StudentDash;
