import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuickAttendance from './QuickAttendance'; // import the component

const SubjectWorkspace = () => {
    const { subject } = useParams(); // dynamic subject from URL
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch students
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const username = localStorage.getItem('username'); // logged-in teacher
                if (!username) throw new Error('User not logged in');

                const response = await fetch(
                    `http://localhost:8080/api/staff/dashboard/${username}/subjects/${subject}/students`,
                    { method: 'GET', credentials: 'include' }
                );

                if (!response.ok) throw new Error('Failed to fetch students');

                const data = await response.json();
                const initialized = data.map(s => ({
                    ...s,
                    present: s.present || false,
                    marks: s.marks || ''
                }));

                setStudents(initialized);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchStudents();
    }, [subject]);

    // Handle attendance toggle
    const handleAttendanceChange = (rollNo) => {
        setStudents(prev =>
            prev.map(s => s.rollNo === rollNo ? { ...s, present: !s.present } : s)
        );
    };

    // Handle marks change
    const handleMarksChange = (rollNo, value) => {
        setStudents(prev =>
            prev.map(s => s.rollNo === rollNo ? { ...s, marks: value } : s)
        );
    };

    // Save attendance & marks to backend (optional)
    const saveAttendanceAndMarks = async () => {
        try {
            const username = localStorage.getItem('username');
            const response = await fetch(
                `http://localhost:8080/api/staff/dashboard/${username}/subjects/${subject}/students/save`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(students)
                }
            );
            if (!response.ok) throw new Error('Failed to save');
            alert('Saved successfully!');
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    if (loading) return <p>Loading students...</p>;
    if (error) return <p>Error: {error}</p>;

    const username = localStorage.getItem('username'); // reuse for QuickAttendance

    return (
        <div className="subject-workspace container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Workspace for: {subject}</h2>

            {/* Quick Attendance Section */}
            <QuickAttendance
                subjectId={subject}
                teacherUsername={username} // pass username dynamically
                onAttendanceUpdated={() => console.log('Attendance updated')}
            />

            {/* Students Table */}
            <table className="w-full table-auto border-collapse border border-gray-300 mt-6">
                <thead>
                <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Roll No</th>
                    <th className="border px-4 py-2">Name</th>
                    <th className="border px-4 py-2">Department</th>
                    <th className="border px-4 py-2">Attendance</th>
                    <th className="border px-4 py-2">Marks</th>
                </tr>
                </thead>
                <tbody>
                {students.map((student) => (
                    <tr key={student.rollNo} className="text-center">
                        <td className="border px-4 py-2">{student.rollNo}</td>
                        <td className="border px-4 py-2">{student.name}</td>
                        <td className="border px-4 py-2">{student.dept}</td>
                        <td className="border px-4 py-2">
                            <input
                                type="checkbox"
                                checked={student.present}
                                onChange={() => handleAttendanceChange(student.rollNo)}
                            />
                        </td>
                        <td className="border px-4 py-2">
                            <input
                                type="number"
                                value={student.marks}
                                min="0"
                                max="100"
                                onChange={(e) => handleMarksChange(student.rollNo, e.target.value)}
                                className="border rounded px-2 py-1 w-16 text-center"
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="mt-4">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={saveAttendanceAndMarks}
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default SubjectWorkspace;
