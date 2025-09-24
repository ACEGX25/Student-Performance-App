import React, { useState } from "react"
import { Search, User, Users } from "lucide-react"
// import "./Assist.css"
import {Link} from "react-router-dom";
import axios from "axios";

const AdminSearchPage = () => {
    const [searchType, setSearchType] = useState("student")
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("authToken");


    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setSearchResults([]);
            alert("Please enter a search term.");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8080/search/users`, { params: { query: searchQuery },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const filteredResults = res.data.filter(item =>
                searchType === "student"
                    ? item.role?.toLowerCase() === "student"
                    : item.role?.toLowerCase() === "staff"
            );
            setSearchResults(filteredResults);
        } catch (err) {
            console.error("Search failed:", err);
            setSearchResults([]);
            alert("Search failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="app-header text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">EduTrack Admin</h1>
                    <nav className="hidden md:flex space-x-4">
                        <Link to="/admin-dashboard" className="hover:text-blue-200">Dashboard</Link>
                        <a href="#" className="hover:text-blue-200">
                            Students
                        </a>
                        <a href="#" className="hover:text-blue-200">
                            Staff
                        </a>
                        <a href="#" className="hover:text-blue-200">
                            Reports
                        </a>
                        <a href="#" className="hover:text-blue-200">
                            Logout
                        </a>
                    </nav>
                </div>
            </header>

            <main className="flex-grow container mx-auto p-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Search</h2>
                    <div className="flex mb-4">
                        <button
                            className={`flex-1 py-2 px-4 rounded-l-lg ${searchType === "student" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            onClick={() => {
                                setSearchType("student");
                                setSearchResults([]);
                            }}
                        >
                            <User className="inline-block mr-2"/> Search Student
                        </button>
                        <button
                            className={`flex-1 py-2 px-4 rounded-l-lg ${searchType === "staff" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                            onClick={() => {
                                setSearchType("staff");
                                setSearchResults([]);
                            }}
                        >
                            <User className="inline-block mr-2"/> Search Staff
                        </button>
                    </div>
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="flex">
                            <input
                                type="text"
                                placeholder={searchType === "student" ? "Enter student name or roll number" : "Enter staff name or ID"}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600">
                                <Search className="inline-block" />
                            </button>
                        </div>
                    </form>
                    <div className="search-results">
                        {loading && <p className="text-blue-500 mb-2">Searching...</p>}
                        {searchResults.map((result) => (
                            <div key={result.id} className="bg-gray-50 p-4 mb-2 rounded-lg hover:bg-gray-100">
                                <h3 className="font-semibold">{result.name}</h3>
                                <p className="text-sm text-gray-600">{result.role}</p>
                                <p className="text-sm">{result.details}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="bg-gray-800 text-white p-4 mt-8">
                <div className="container mx-auto text-center">
                    <p>&copy; 2025 EduTrack. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

export default AdminSearchPage

