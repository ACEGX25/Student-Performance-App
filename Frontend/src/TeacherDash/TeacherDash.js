import React, { useState } from 'react';
import { Bell, Book, Calendar, ChevronRight, User, BarChart, Activity, Hash, AtSign, Briefcase, Users, Mail, Search, MapPin, Gift, Award, Bookmark } from 'lucide-react';
import './TeacherDash.css';
import desiree from '../../src/assets/real.png'

const TeacherDashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="teacher-dashboard min-h-screen flex flex-col bg-gray-100">
      <header className="app-header text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">EduTrack</h1>
          <nav className={`md:flex space-x-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <a href="#" className="block md:inline-block py-2 hover:text-blue-200">Dashboard</a>
            <a href="#" className="block md:inline-block py-2 hover:text-blue-200">Classes</a>
            <a href="#" className="block md:inline-block py-2 hover:text-blue-200">Assignments</a>
            <a href="#" className="block md:inline-block py-2 hover:text-blue-200">Grades</a>
          </nav>
          <button className="md:hidden" onClick={toggleMenu}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 dashboard-content">
        <div className="welcome-header mb-6 p-6 bg-white rounded-lg shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-semibold">Welcome, Snehal Shinde!</h2>
          </div>
          <div className="shape circle1"></div>
          <div className="shape circle2"></div>
          <div className="shape square1"></div>
          <div className="shape triangle1"></div>
          <div className="shape rectangle1"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="column left-column md:col-span-3">
            <TeacherProfile />
          </div>
          <div className="column middle-column md:col-span-6">
            <TeacherFeedback />
            <TeacherTimetable />
          </div>
          <div className="column right-column md:col-span-3">
            <div className="search-container mb-6">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search students..."
                className="search-input"
              />
            </div>
            <QuickAttendance />
            <AssignmentIssue />
          </div>
        </div>
      </main>

      <footer className="app-footer text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 EduTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const TeacherProfile = () => {
  return (
    <div className="teacher-profile bg-white p-6 rounded-lg shadow-md hover-effect">
      <div className="mb-6 text-center">
        <img
          src={desiree}
          alt="Teacher's photo"
          className="w-32 h-32 rounded-full mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-800">Snehal Shinde</h2>
      </div>
      <div className="space-y-4">
        <ProfileItem icon={Briefcase} label="Department" value="Mathematics" />
        <ProfileItem icon={Award} label="Teaching Experience" value="10 years" />
        <ProfileItem icon={Book} label="Expertise" value="Calculus, Linear Algebra" />
        <ProfileItem icon={Award} label="Qualifications" value="Ph.D. in Mathematics" />
        <ProfileItem icon={Briefcase} label="Designations" value="Class Teacher, Exam Coordinator" />
        <ProfileItem icon={Gift} label="Area of Interest" value="Number Theory" />
        <ProfileItem icon={MapPin} label="Address" value="123 University Ave, City" />
        <ProfileItem icon={Gift} label="Date of Birth" value="15th May, 1980" />
      </div>
    </div>
  );
};

const ProfileItem = ({ icon: Icon, label, value }) => (
  <div className="profile-item">
    <Icon className="profile-icon" />
    <span className="profile-label">{label}:</span>
    <span>{value}</span>
  </div>
);

const TeacherFeedback = () => {
  return (
    <div className="teacher-feedback bg-white p-6 rounded-lg shadow-md mb-6 hover-effect">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <BarChart className="w-6 h-6 mr-2 text-blue-500" />
        Subject Feedback
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <FeedbackChart subject="Mathematics" rating={4.5} />
        <FeedbackChart subject="Physics" rating={4.2} />
      </div>
    </div>
  );
};

const FeedbackChart = ({ subject, rating }) => (
  <div className="feedback-chart">
    <h3 className="text-lg font-semibold mb-2">{subject}</h3>
    <div className="flex items-center">
      <div className="w-full bg-gray-300 rounded-full h-2.5 mr-2">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${(rating / 5) * 100}%` }}
        ></div>
      </div>
      <span className="text-sm font-medium text-gray-600">{rating.toFixed(1)}/5</span>
    </div>
  </div>
);

const TeacherTimetable = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const times = ['8:15 AM', '9:15 AM', '10:15 AM', '11:15 AM', '12:15 PM', '1:15 PM', '2:15 PM', '3:15 PM'];

  return (
    <div className="teacher-timetable bg-white p-6 rounded-lg shadow-md hover-effect">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Calendar className="w-6 h-6 mr-2 text-blue-500" />
        Weekly Timetable
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Time</th>
              {days.map(day => (
                <th key={day} className="px-6 py-3">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map(time => (
              <tr key={time} className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{time}</td>
                {days.map(day => (
                  <td key={`${day}-${time}`} className="px-6 py-4">
                    {Math.random() > 0.5 ? 'Class' : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const QuickAttendance = () => {
  const [absentees, setAbsentees] = React.useState('');
  const [submittedAbsentees, setSubmittedAbsentees] = React.useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const absentList = absentees.split(',').map(num => num.trim()).filter(num => num !== '');
    setSubmittedAbsentees(absentList);
    setAbsentees('');
  };

  return (
    <div className="quick-attendance mb-6 bg-white p-6 rounded-lg shadow-md hover-effect">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Users className="w-5 h-5 mr-2 text-blue-500" />
        Quick Attendance
      </h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex items-center">
          <input
            type="text"
            value={absentees}
            onChange={(e) => setAbsentees(e.target.value)}
            placeholder="Enter absent roll numbers (comma-separated)"
            className="flex-grow mr-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Absent roll numbers"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Mark Absent
          </button>
        </div>
      </form>
      {submittedAbsentees.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Absent Students:</h3>
          <ul className="list-disc list-inside">
            {submittedAbsentees.map((rollNumber, index) => (
              <li key={index} className="text-red-500">Roll No. {rollNumber}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const AssignmentIssue = () => {
  return (
    <div className="assignment-issue bg-white p-6 rounded-lg shadow-md hover-effect">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <Book className="w-5 h-5 mr-2 text-blue-500" />
        Issue Assignment
      </h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
          <select id="subject" className="assignment-select">
            <option>Mathematics</option>
            <option>Physics</option>
            <option>Chemistry</option>
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" rows={3} className="assignment-textarea"></textarea>
        </div>
        <div>
          <label htmlFor="due-date" className="block text-sm font-medium text-gray-700">Due Date</label>
          <input type="date" id="due-date" className="assignment-input" />
        </div>
        <button type="submit" className="assignment-submit-btn">
          Issue Assignment
        </button>
      </form>
    </div>
  );
};

export default TeacherDashboard;

