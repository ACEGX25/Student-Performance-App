import React, { useState, useEffect } from 'react';
import { Book, Calendar, FileDown } from 'lucide-react';
import './Assignment.css';


const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const fetchAssignments = async () => {
        try {
            const response = await fetch('http://localhost:8080/assignments/all', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // send HTTP-only cookies
            });

            if (!response.ok) throw new Error('Failed to fetch assignments');

            const data = await response.json();
            setAssignments(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    fetchAssignments();
}, []);


    if (loading) return <p className="text-gray-600 text-center mt-6">Loading assignments...</p>;
    if (error) return <p className="text-red-500 text-center mt-6">Error: {error}</p>;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-6">
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <Book className="w-6 h-6 mr-2 text-blue-500" />
                        Assignments
                    </h2>

                    {assignments.length === 0 ? (
                        <p className="text-gray-600">No assignments available.</p>
                    ) : (
                        <div className="space-y-4">
                            {assignments.map((a) => (
                                <div
                                    key={a.id}
                                    className="bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-md transition"
                                >
                                    <div className="mb-2 md:mb-0">
                                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                            <Book className="w-5 h-5 mr-2 text-gray-500" />
                                            {a.subject}
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-1">{a.description}</p>
                                        <div className="flex items-center text-sm text-gray-500 mt-2">
                                            <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                                            Due: {a.dueDate}
                                        </div>
                                    </div>
                                    <a
                                        href={`http://localhost:8080/api/assignments/download/${a.fileId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                    >
                                        <FileDown className="w-4 h-4 mr-2" />
                                        Download
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Assignments;
