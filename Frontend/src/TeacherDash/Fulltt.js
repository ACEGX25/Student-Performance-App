import React, { useEffect, useState } from "react";
import TeacherTimetable from "../TeacherDash/Time-table"; // we will create this if not already

const FullTimetablePage = () => {
    const [teacherData, setTeacherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const username = localStorage.getItem("username");

                const response = await fetch(
                    `http://localhost:8080/api/staff/dashboard/${username}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (!response.ok) throw new Error("Failed to fetch staff data");

                const data = await response.json();
                setTeacherData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherData();
    }, []);

    if (loading) return <p>Loading timetable...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Weekly Timetable</h1>
            <TeacherTimetable department={teacherData.department} />
        </div>
    );
};

export default FullTimetablePage;
