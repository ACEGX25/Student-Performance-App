import React, { useState } from 'react';
import './Admin.css';
import {Link} from 'react-router-dom'

const Admin = () => {
    const [openDropdown, setOpenDropdown] = useState(null);

    const quickOverlookData = [
        {
            icon: "📦",
            name: "Techtonic",
            hours: "34",
            priority: "Medium",
            staff: ["user1", "user2", "user3", "+5"],
            progress: 15
        },
        {
            icon: "➕",
            name: "Staff Karandak",
            hours: "34",
            priority: "Medium",
            staff: ["user1", "user2", "user3", "+5"],
            progress: 25
        },
        {
            icon: "🔄",
            name: "Karandk",
            hours: "34",
            priority: "Medium",
            staff: ["user1", "user2", "user3", "+5"],
            progress: 15
        },
        {
            icon: "📊",
            name: "Prelim Schedule for all",
            hours: "34",
            priority: "High",
            staff: ["user1", "user2", "user3", "+5"],
            progress: 15
        },
        {
            icon: "📚",
            name: "Mentoring and Guiding Semester projects",
            hours: "34",
            priority: "High",
            staff: ["user1", "user2", "user3", "+5"],
            progress: 15
        }
    ];

    const staffData = [
        {
            name: "Jitu Chauhan",
            email: "jitu@example.com",
            role: "Front End Developer",
            lastActivity: "Today"
        },
        {
            name: "Sandeep Chauhan",
            email: "sandeep@example.com",
            role: "Project Director",
            lastActivity: "Today"
        },
        {
            name: "Amanda Darnell",
            email: "amanda@example.com",
            role: "Full- Stack Developer",
            lastActivity: "Today"
        },
        {
            name: "Jitu Chauhan",
            email: "jitu@example.com",
            role: "Digital Marketer",
            lastActivity: "Yesterday"
        },
        {
            name: "Patricia Murrill",
            email: "patricia@example.com",
            role: "Account Manager",
            lastActivity: "3 May, 2022"
        }
    ];

    const toggleDropdown = (dropdown) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

    return (
        <div className="edutrack-admin">
            {/* Sidebar */}
            <aside className="edutrack-admin__sidebar">
                <div className="edutrack-admin__logo">
                    <h1>Edutrack<span>.</span></h1>
                </div>
                <nav className="edutrack-admin__nav">
                    <ul>
                        <li className="edutrack-admin__nav-item edutrack-admin__nav-item--active">
                            <button className="edutrack-admin__nav-button">
                                <i className="edutrack-admin__icon">📊</i> Dashboard
                            </button>
                        </li>
                        <li className="edutrack-admin__nav-item">
                            <button
                                className="edutrack-admin__nav-button"
                                onClick={() => toggleDropdown('create')}
                            >
                                <i className="edutrack-admin__icon">✏️</i> Create
                                <span className="edutrack-admin__dropdown-arrow">▼</span>
                            </button>
                            {openDropdown === 'create' && (
                                <ul className="edutrack-admin__dropdown">
                                    <li className="edutrack-admin__dropdown-item">Exam & Schedule</li>
                                    <li className="edutrack-admin__dropdown-item"><Link to="/admin/time-table">Timetable</Link></li>
                                </ul>
                            )}
                        </li>
                        <li className="edutrack-admin__nav-item">
                            <button
                                className="edutrack-admin__nav-button"

                            >
                                <i className="edutrack-admin__icon">🔍</i> Search

                            </button>

                        </li>
                        <li className="edutrack-admin__nav-item">
                            <button
                                className="edutrack-admin__nav-button"

                            >
                                <i className="edutrack-admin__icon">✓</i> Approve
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="edutrack-admin__main">
                <header className="edutrack-admin__header">
                    <h1>Welcome, Admin!</h1>
                    <button className="edutrack-admin__create-btn">Create New</button>
                </header>

                {/* Quick Overlook Section */}
                <section className="edutrack-admin__quick-overlook">
                    <h2>Quick Overlook</h2>
                    <div className="edutrack-admin__table-container">
                        <table className="edutrack-admin__table">
                            <thead>
                            <tr>
                                <th>Event name</th>
                                <th>Hours</th>
                                <th>Priority</th>
                                <th>Staff Assigned</th>
                                <th>Dept. Progress</th>
                            </tr>
                            </thead>
                            <tbody>
                            {quickOverlookData.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <span className="edutrack-admin__event-icon">{item.icon}</span>
                                        {item.name}
                                    </td>
                                    <td>{item.hours}</td>
                                    <td>
                      <span className={`edutrack-admin__priority edutrack-admin__priority--${item.priority.toLowerCase()}`}>
                        {item.priority}
                      </span>
                                    </td>
                                    <td>
                                        <div className="edutrack-admin__staff-avatars">
                                            {item.staff.map((staff, idx) => (
                                                <span key={idx} className="edutrack-admin__staff-avatar">{staff}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="edutrack-admin__progress-bar">
                                            <div
                                                className="edutrack-admin__progress"
                                                style={{width: `${item.progress}%`}}
                                            ></div>
                                            <span>{item.progress}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <a href="#" className="edutrack-admin__view-all">View All Events</a>
                </section>

                <div className="edutrack-admin__bottom-sections">
                    {/* Departmental Attendance Section */}
                    <section className="edutrack-admin__attendance">
                        <div className="edutrack-admin__section-header">
                            <h2>Departmental Attendance</h2>
                            <button className="edutrack-admin__more-btn">⋮</button>
                        </div>
                        <div className="edutrack-admin__attendance-chart">
                            <div className="edutrack-admin__chart-placeholder">
                                <svg viewBox="0 0 36 36" className="edutrack-admin__circular-chart">
                                    <path className="edutrack-admin__circle-bg"
                                          d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path className="edutrack-admin__circle"
                                          strokeDasharray="76, 100"
                                          d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <text x="18" y="20.35" className="edutrack-admin__percentage">76%</text>
                                </svg>
                            </div>
                        </div>
                    </section>

                    {/* Assistant Professors Section */}
                    <section className="edutrack-admin__professors">
                        <h2>Assistant Professors / Vice HOD</h2>
                        <div className="edutrack-admin__staff-list">
                            {staffData.map((staff, index) => (
                                <div key={index} className="edutrack-admin__staff-item">
                                    <div className="edutrack-admin__staff-info">
                                        <div className="edutrack-admin__avatar"></div>
                                        <div className="edutrack-admin__details">
                                            <h3>{staff.name}</h3>
                                            <p>{staff.email}</p>
                                        </div>
                                    </div>
                                    <div className="edutrack-admin__role">{staff.role}</div>
                                    <div className="edutrack-admin__last-activity">{staff.lastActivity}</div>
                                    <button className="edutrack-admin__more-btn">⋮</button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Admin;

