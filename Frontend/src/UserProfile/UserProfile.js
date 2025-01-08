import React, { useState, useEffect } from 'react';
import { User, Book, Clock, Users, DollarSign, Star, Activity, Brain, Home, UserCheck, Mail, Calendar, Image, ChevronRight, Camera, Pencil } from 'lucide-react';
import './UserProfile.css';

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const username = localStorage.getItem('username');

        if (!username) {
          throw new Error('Username not available. Please log in again.');
        }

        const response = await fetch(`http://localhost:8080/api/student/dashboard/${username}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
        setEditedData(data);
        setProfilePicture(data.profilePicture || '/placeholder.svg?height=150&width=150');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = (fieldName) => {
    setEditingField(fieldName);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const username = localStorage.getItem('username');

      const formData = new FormData();
      Object.keys(editedData).forEach(key => {
        formData.append(key, editedData[key]);
      });
      if (profilePicture instanceof File) {
        formData.append('profilePicture', profilePicture);
      }

      const response = await fetch(`http://localhost:8080/api/student/update/${username}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      const updatedData = await response.json();
      setUserData(updatedData);
      setEditedData(updatedData);
      setEditingField(null);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setEditingField(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setEditedData(prev => ({ ...prev, profilePicture: file }));
    }
  };

  const renderField = (label, name, value, type = 'text', editable = true, placeholder = '') => {
    const isEditing = editingField === name;

    return (
      <div className="up-field">
        <div className="up-field-label">{label}</div>
        <div className="up-field-value">
          {isEditing && editable ? (
            <div className="up-field-edit">
              <input
                type={type}
                name={name}
                value={editedData[name] || ''}
                onChange={handleChange}
                className="up-input"
              />
              <button
                className="up-button up-button-primary"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="up-button up-button-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <span className={value ? "up-text" : "up-text up-text-placeholder"}>
                {value || placeholder}
              </span>
              {editable && (
                <button
                  className="up-button up-button-icon"
                  onClick={() => handleEdit(name)}
                >
                  <Pencil className="up-icon" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  if (!userData) {
    return <div className="up-loading">Loading...</div>;
  }

  return (
    <div className="up-page">
      <header className="app-header text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">EduTrack</h1>
          <nav className={`md:flex space-x-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
            <a href="/student-dashboard" className="block md:inline-block py-2 hover:text-blue-200">Back to StudentDash</a>
          </nav>
          <button className="md:hidden" onClick={toggleMenu}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <div className="up-container">
        <div className="up-breadcrumb">
          {/* <a href="/my-account" className="up-breadcrumb-link">
            My Account
          </a>
          <ChevronRight className="up-breadcrumb-icon" /> */}
          <span className="up-breadcrumb-current">Account Home</span>
        </div>
        
        <div className="up-content">
          <div className="up-card">
            <div className="up-card-header">
              <h2 className="up-card-title">Photo</h2>
              <p className="up-card-subtitle">150×150px JPEG, PNG Image</p>
            </div>
            <div className="up-card-content up-photo-section">
              <div className="up-photo-container">
                <img
                  src={profilePicture instanceof File ? URL.createObjectURL(profilePicture) : profilePicture}
                  alt="Profile Picture"
                  className="up-photo"
                />
              </div>
              <div className="up-photo-actions">
                <button
                  className="up-button up-button-outline"
                  onClick={() => document.getElementById("photo-upload").click()}
                >
                  Change Photo
                </button>
                <input
                  id="photo-upload"
                  type="file"
                  className="up-hidden"
                  accept="image/jpeg,image/png"
                  onChange={handleProfilePictureChange}
                />
              </div>
            </div>
          </div>

          <div className="up-card">
            <div className="up-card-header">
              <h2 className="up-card-title">Personal Information</h2>
            </div>
            <div className="up-card-content">
              {renderField("Roll No", "rollno", userData.rollno)}
              {renderField("Name", "name", userData.name)}
              {renderField("Email", "email", userData.email, "email")}
              {renderField("Department", "department", userData.department)}
              {renderField("Extracurricular Activities", "extracurricular_activities", userData.extracurricular_activities)}
              {renderField("Sleep Hours", "sleep_hours", userData.sleep_hours, "number")}
              {renderField("Tutoring Sessions", "tutoring_sessions", userData.tutoring_sessions, "number")}
              {renderField("Family Income", "family_income", `$${userData.family_income}`, "number")}
              {renderField("Teacher Review", "teacher_review", userData.teacher_review, "text", false)}
              {renderField("Physical Activity (hours/week)", "physical_activity", userData.physical_activity, "number")}
              {renderField("Learning Disabilities", "learning_disabilities", userData.learning_disabilities)}
              {renderField("Distance from Home (km)", "distance_from_home", userData.distance_from_home, "number")}
              {renderField("Gender", "gender", userData.gender)}
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 EduTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default UserProfile;

