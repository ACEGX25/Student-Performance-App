import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, ArrowLeft, Briefcase, Award, Book, Star, MapPin, Calendar } from "lucide-react";
import "../UserProfile/UserProfile.css"; // reuse same CSS styles

function ProfileItem({ icon: Icon, label, value }) {
  return (
    <div className="up-field flex items-center gap-2">
      <Icon className="w-4 h-4 text-gray-500" />
      <b>{label}:</b> <span>{value ?? "-"}</span>
    </div>
  );
}

function StaffProfile() {
  const navigate = useNavigate();
  const [staffData, setStaffData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        const username = localStorage.getItem("username");
        if (!username) throw new Error("Username not available. Please log in again.");

        const response = await fetch(`http://localhost:8080/api/staff/dashboard/${username}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch staff data");
        const data = await response.json();

        setStaffData(data);
        setEditedData(data);

        if (data.photo) {
          setProfilePicture(`data:image/jpeg;base64,${data.photo}`);
        }
      } catch (err) {
        console.error("Error fetching staff data:", err);
      }
    };

    fetchStaffData();
  }, []);

  const handleToggleEdit = () => {
    setEditing((s) => !s);
    if (!editing) setEditedData(staffData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...(prev || {}), [name]: value }));
  };

  const handleSave = async () => {
    try {
      const username = localStorage.getItem("username");
      if (!username) throw new Error("Username not available");

      const formData = new FormData();
      formData.append("staff", new Blob([JSON.stringify(editedData)], { type: "application/json" }));

      if (profilePicture instanceof File) {
        formData.append("photo", profilePicture);
      }

      const response = await fetch(`http://localhost:8080/api/staff/update/${username}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update staff data");
      const updatedData = await response.json();
      setStaffData(updatedData);
      setEditedData(updatedData);
      setEditing(false);

      if (updatedData.photo) {
        setProfilePicture(`data:image/jpeg;base64,${updatedData.photo}`);
      }
    } catch (err) {
      console.error("Error updating staff data:", err);
    }
  };

  const handleCancel = () => {
    setEditedData(staffData);
    setEditing(false);
  };

  const handleBack = () => {
    const username = localStorage.getItem("username");
    navigate(`/staff/dashboard/${username}`);
  };

  if (!staffData) return <div className="up-loading">Loading...</div>;

  return (
    <div className="up-page">
      <header className="app-header text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">EduTrack</h1>
          <button className="up-button up-button-icon" onClick={handleToggleEdit}>
            <Pencil className="up-icon" /> {editing ? "Stop Editing" : "Edit Profile"}
          </button>
        </div>
      </header>

      <div className="up-container">
        <div className="up-breadcrumb flex items-center gap-2 mb-4">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
          </button>
          <h1 className="text-2xl font-bold">Staff Profile</h1>
        </div>

        <div className="up-content">
          {/* Profile Photo */}
          <div className="up-card">
            <div className="up-card-header">
              <div>
                <h2 className="up-card-title">Photo</h2>
              </div>
            </div>
            <div className="up-card-content up-photo-section">
              <div className="up-photo-container">
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="up-photo"
                  />
                ) : (
                  <div className="up-photo-placeholder">Profile</div>
                )}
              </div>
              {editing && (
                <div className="up-photo-actions">
                  <label htmlFor="photo-upload" className="up-button up-button-outline">
                    Change Photo
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setProfilePicture(file);
                      e.target.value = "";
                    }}
                    style={{ display: "none" }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Staff Info */}
          <div className="up-card">
            <div className="up-card-header">
              <h2 className="up-card-title">Staff Information</h2>
            </div>
            <div className="up-card-content">
              <ProfileItem icon={Briefcase} label="Department" value={staffData.department} />
              <ProfileItem icon={Briefcase} label="Semester" value={staffData.semester} />
              <ProfileItem icon={Award} label="Experience" value={`${staffData.experience} years`} />
              <ProfileItem icon={Book} label="Expertise" value={staffData.expertise} />
              <ProfileItem icon={Award} label="Qualification" value={staffData.qualification} />
              <ProfileItem icon={Briefcase} label="Designation" value={staffData.designation} />
              <ProfileItem icon={Star} label="Area of Interest" value={staffData.area_of_interest} />
              <ProfileItem icon={MapPin} label="Address" value={staffData.address} />
               <ProfileItem
                                  icon={Calendar}
                                  label="Date of Birth"
                                  value={staffData.date_of_birth ? staffData.date_of_birth.split('-').join(' / ') : 'N/A'}
                              />
            </div>
          </div>
        </div>

        {editing && (
          <div className="up-actions">
            <button className="up-button up-button-primary" onClick={handleSave}>Save</button>
            <button className="up-button up-button-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffProfile;
