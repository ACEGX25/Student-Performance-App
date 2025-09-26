import React, { useEffect, useState } from "react";

const TeacherTimetable = ({ semester,department, preview = false }) => {
    const [timetableUrl, setTimetableUrl] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
    const fetchTimetable = async () => {
        try {
            // no token from localStorage
            const response = await fetch(
                `http://localhost:8080/timetables/latest?semester=${encodeURIComponent(semester)}&department=${encodeURIComponent(department)}`,
                {
                    credentials: "include", // send httpOnly cookie automatically
                }
            );

            if (!response.ok) {
                throw new Error("No timetable available for your department");
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setTimetableUrl(imageUrl);
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    fetchTimetable();
}, [semester, department]);


    return (
        <div className={`teacher-timetable bg-white p-6 rounded-lg shadow-md hover-effect`}>
            <h2 className="text-2xl font-bold mb-4">Weekly Timetable</h2>
            <div className="flex justify-center">
                {error && <p>{error}</p>}
                {timetableUrl && (
                    preview ? (
                        <div className="h-48 w-full overflow-hidden flex justify-center items-center rounded-md shadow cursor-pointer">
                            <img
                                src={timetableUrl}
                                alt="Timetable"
                                className="object-cover h-full"
                            />
                        </div>
                    ) : (
                        <img
                            src={timetableUrl}
                            alt="Timetable"
                            className="w-full rounded-md shadow"
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default TeacherTimetable;
