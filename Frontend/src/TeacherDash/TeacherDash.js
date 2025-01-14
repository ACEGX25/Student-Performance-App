import React, { useState, useEffect } from 'react';
import {
    Briefcase,
    Award,
    Book,
    Star,
    MapPin,
    Calendar,
    BarChart,
    Users
} from 'lucide-react';
import './TeacherDash.css';


const TeacherDashboard = () => {
    const [teacherData, setTeacherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem('authToken');
                const username = localStorage.getItem('username');

                if (!username) {
                    throw new Error('Username not available. Please log in again.');
                }

                const response = await fetch(`http://localhost:8080/api/staff/dashboard/${username}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch student data');
                }

                const data = await response.json();
                console.log('API Response:', data);
                setTeacherData(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="teacher-dashboard min-h-screen flex flex-col bg-gray-100">
            <header className="app-header text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">EduTrack</h1>
                </div>
            </header>

            <main className="flex-grow container mx-auto p-4 dashboard-content">
                <div className="welcome-header mb-6 p-6 bg-white rounded-lg shadow-md relative overflow-hidden">
                    <div className="flex items-center relative z-10">
                        <h2 className="text-3xl font-semibold">Welcome, {teacherData ? teacherData.name : 'Guest'}!</h2>
                    </div>
                    <div className="shape circle1"></div>
                    <div className="shape circle2"></div>
                    <div className="shape square1"></div>
                    <div className="shape triangle1"></div>
                    <div className="shape rectangle1"></div>
                </div>

                {teacherData && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="column left-column md:col-span-3">
                            <QuickAttendance/>
                            <AssignmentIssue/>
                        </div>
                        <div className="column middle-column md:col-span-6">
                            <TeacherFeedback feedback={teacherData.sub_feedback}/>
                            <TeacherTimetable timetableImage={teacherData.timetableImage}/>
                        </div>
                        <div className="column right-column md:col-span-3">
                            <TeacherProfile teacherData={teacherData}/>
                        </div>
                    </div>
                )}
            </main>

            <footer className="app-footer text-white p-4 mt-8">
                <div className="container mx-auto text-center">
                    <p>&copy; 2025 EduTrack. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

const TeacherProfile = ({teacherData}) => {
    if (!teacherData) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="teacher-profile bg-white p-10 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-5">{teacherData.name}</h2>
            <ProfileItem icon={Briefcase} label="Department" value={teacherData.department}/>
            <ProfileItem icon={Award} label="Experience" value={`${teacherData.experience} years`}/>
            <ProfileItem icon={Book} label="Expertise" value={teacherData.expertise}/>
            <ProfileItem icon={Award} label="Qualification" value={teacherData.qualification} />
            <ProfileItem icon={Briefcase} label="Designation" value={teacherData.designation} />
            <ProfileItem icon={Star} label="Area of Interest" value={teacherData.area_of_interest} />
            <ProfileItem icon={MapPin} label="Address" value={teacherData.address} />
            <ProfileItem
                icon={Calendar}
                label="Date of Birth"
                value={
                    teacherData.date_of_birth && teacherData.date_of_birth.$date
                        ? teacherData.date_of_birth.$date.split('/').join(' / ')
                        : 'N/A'
                }
            />
        </div>
    );
};

const TeacherFeedback = ({ feedback }) => {
    return (
        <div className="teacher-feedback bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Subject Feedback</h2>
            <div className="feedback-chart">
                <h3 className="text-lg font-semibold">Overall Feedback</h3>
                <div className="flex items-center">
                    <div className="w-full bg-gray-300 rounded-full h-2.5 mr-2">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${(feedback / 10) * 100}%` }}
                        ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{feedback}/10</span>
                </div>
            </div>
        </div>
    );
};

const TeacherTimetable = ({ timetableImage }) => {
    return (
        <div className="teacher-timetable bg-white p-6 rounded-lg shadow-md hover-effect">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-blue-500" />
                Weekly Timetable
            </h2>
            <div className="flex justify-center">
                {timetableImage ? (
                    <img src={timetableImage} alt="Timetable" className="rounded-lg" />
                ) : (
                    <p>Timetable image not available</p>
                )}
            </div>
        </div>
    );
};

const QuickAttendance = () => {
    const [absentees, setAbsentees] = useState('');
    const [submittedAbsentees, setSubmittedAbsentees] = useState([]);

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
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileUpload = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedFile) {
            console.log('File uploaded:', selectedFile);
            // Handle file upload logic here
        }
    };

    return (
        <div className="assignment-issue bg-white p-6 rounded-lg shadow-md hover-effect">
            <h2 className="text-xl font-bold mb-4 flex items-center">
                <Book className="w-5 h-5 mr-2 text-blue-500" />
                Issue Assignment
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
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
                <div>
                    <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Upload PDF</label>
                    <input type="file" id="file-upload" accept="application/pdf" onChange={handleFileUpload} className="assignment-file-upload" />
                </div>
                <button type="submit" className="assignment-submit-btn">
                    Issue Assignment
                </button>
            </form>
        </div>
    );
};

const ProfileItem = ({ icon: Icon, label, value }) => (
    <div className="profile-item flex mb-4">
        <Icon className="profile-icon mr-2" />
        <span className="profile-label font-bold mr-2">{label}:</span>
        <span>{value}</span>
    </div>
);

export default TeacherDashboard;
