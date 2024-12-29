import React, { useState, useEffect } from 'react';
import { Bell, Book, Calendar, ChevronRight, User } from 'lucide-react';
import './StudentDash.css'

const HomePage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Simulating fetching notifications from an API
    const fetchNotifications = async () => {
      // In a real app, this would be an API call
      const mockNotifications = [
        { id: 1, message: 'New exam schedule posted' },
        { id: 2, message: 'Assignment due tomorrow' },
        { id: 3, message: 'Your recent test results are available' },
      ];
      setNotifications(mockNotifications);
    };

    fetchNotifications();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="app-header text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Student Performance App</h1>
          <nav className={`md:flex space-x-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <a href="#" className="block md:inline-block py-2 hover:text-blue-200">Dashboard</a>
            <a href="#" className="block md:inline-block py-2 hover:text-blue-200">Exams</a>
            <a href="#" className="block md:inline-block py-2 hover:text-blue-200">Assignments</a>
            <a href="#" className="block md:inline-block py-2 hover:text-blue-200">Results</a>
          </nav>
          <button className="md:hidden" onClick={toggleMenu}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <h2 className="text-3xl font-semibold mb-6">Welcome, Student!</h2>
        
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
            <a href="#" className="custom-button text-green-500 hover:underline mt-2 inline-block">Submit Assignments <ChevronRight className="inline w-4 h-4" /></a>
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
            <a href="#" className="custom-button text-purple-500 hover:underline mt-2 inline-block">Edit Profile <ChevronRight className="inline w-4 h-4" /></a>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">Recent Activity</h3>
          <ul className="space-y-2">
            {notifications.map((notification) => (
              <li key={notification.id} className="flex items-center text-gray-600">
                <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                {notification.message}
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2023 Student Performance App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

