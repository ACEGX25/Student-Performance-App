import React, { useState } from 'react';

const QuickAttendance = ({ subjectId, onAttendanceUpdated }) => {
    const [absentees, setAbsentees] = useState('');
    const [submittedAbsentees, setSubmittedAbsentees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const absentList = absentees
            .split(',')
            .map(num => parseInt(num.trim()))
            .filter(num => !isNaN(num));

        if (absentList.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            // Include teacher username dynamically in the path
            const teacherUsername = "shruti1"; // ideally pass as prop or get from context
            const response = await fetch(
                `http://localhost:8080/api/staff/dashboard/${teacherUsername}/subjects/${subjectId}/attendance/mark-absentees`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // for auth cookies
                    body: JSON.stringify(absentList),
                }
            );

            if (!response.ok) throw new Error('Failed to mark attendance');

            const result = await response.text();
            console.log(result);

            setSubmittedAbsentees(absentList);
            setAbsentees('');

            if (onAttendanceUpdated) onAttendanceUpdated();
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="quick-attendance mb-6 bg-white p-6 rounded-lg shadow-md hover-effect">
            <h2 className="text-xl font-bold mb-4">Quick Attendance</h2>

            <form onSubmit={handleSubmit} className="mb-4 flex items-center">
                <input
                    type="text"
                    value={absentees}
                    onChange={(e) => setAbsentees(e.target.value)}
                    placeholder="Enter roll numbers, comma separated"
                    className="flex-grow mr-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? 'Marking...' : 'Mark Absent'}
                </button>
            </form>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            {submittedAbsentees.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Recently Marked Absent:</h3>
                    <ul className="list-disc list-inside">
                        {submittedAbsentees.map((rollNumber, index) => (
                            <li key={index} className="text-red-500">
                                Roll No. {rollNumber}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default QuickAttendance;
