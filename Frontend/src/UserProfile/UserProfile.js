import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, ArrowLeft } from "lucide-react";
import Cropper from "react-easy-crop";
import "./UserProfile.css";

function UserProfile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  // cropper states
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const username = localStorage.getItem("username");
        if (!username) throw new Error("Username not available. Please log in again.");

        const res = await fetch(`http://localhost:8080/api/student/dashboard/${username}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch user data");
        const data = await res.json();

        setUserData(data);
        setEditedData(data);

        // backend now returns base64 photo if available
        if (data.photo) {
          setProfilePicture(`data:image/jpeg;base64,${data.photo}`);
        } else {
          setProfilePicture(null);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  // lock body scroll while cropper open
  useEffect(() => {
    document.body.style.overflow = showCropper ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCropper]);

  const handleToggleEdit = () => {
    setEditing((s) => !s);
    if (!editing) setEditedData(userData);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsed = type === "number" ? (value === "" ? "" : Number(value)) : value;
    setEditedData((prev) => ({ ...(prev || {}), [name]: parsed }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      setShowCropper(true);
    }
    e.target.value = "";
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (err) => reject(err));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const saveCroppedImage = async () => {
    try {
      const source = profilePicture instanceof File ? URL.createObjectURL(profilePicture) : profilePicture;
      if (!source) {
        setShowCropper(false);
        return;
      }

      if (!croppedAreaPixels || !(profilePicture instanceof File)) {
        setEditedData((prev) => ({ ...(prev || {}), profilePicture }));
        setShowCropper(false);
        return;
      }

      const image = await createImage(source);
      const canvas = document.createElement("canvas");
      const { width, height, x, y } = croppedAreaPixels;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

      await new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            const fileName = profilePicture.name || "profile.jpg";
            const file = new File([blob], fileName, { type: "image/jpeg" });
            setProfilePicture(file);
            setEditedData((prev) => ({ ...(prev || {}), profilePicture: file }));
            setShowCropper(false);
            resolve();
          },
          "image/jpeg",
          0.92
        );
      });
    } catch (err) {
      console.error("Error cropping image:", err);
      setShowCropper(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const username = localStorage.getItem("username");
      if (!username) throw new Error("Username not available");

      const formData = new FormData();

      // Append student JSON as "student"
      formData.append(
        "student",
        new Blob([JSON.stringify(editedData)], { type: "application/json" })
      );

      // Append photo if user selected one
      if (profilePicture instanceof File) {
        formData.append("photo", profilePicture);
      }

      const response = await fetch(`http://localhost:8080/api/student/update/${username}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update user data");
      const updatedData = await response.json();
      setUserData(updatedData);
      setEditedData(updatedData);
      setEditing(false);

      if (updatedData.photo) {
        setProfilePicture(`data:image/jpeg;base64,${updatedData.photo}`);
      }
    } catch (err) {
      console.error("Error updating user data:", err);
    }
  };

   const handleBack = () => {
    const username = localStorage.getItem("username");
    navigate(`/student/dashboard/${username}`);
  };

  const handleCancel = () => {
    setEditedData(userData);
    setEditing(false);
  };

  if (!userData) return <div className="up-loading">Loading...</div>;

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
  <h1 className="text-2xl font-bold">Profile Details</h1>
</div>


        <div className="up-content">
          <div className="up-card">
            <div className="up-card-header">
              <div>
                <h2 className="up-card-title">Photo</h2>
                <div className="up-card-subtitle">150x150px JPEG, PNG Image</div>
              </div>
            </div>

            <div className="up-card-content up-photo-section">
              <div className="up-photo-container">
                {profilePicture ? (
                  <img
                    src={profilePicture instanceof File ? URL.createObjectURL(profilePicture) : profilePicture}
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
                    onChange={handleProfilePictureChange}
                    style={{ display: "none" }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Personal Info */}
          <div className="up-card">
            <div className="up-card-header">
              <h2 className="up-card-title">Personal Information</h2>
            </div>

            <div className="up-card-content">
              <div className="up-field"><b>Roll No:</b> {editing ? <input className="up-input" name="rollno" type="text" value={editedData.rollno ?? ""} onChange={handleChange} /> : userData.rollno}</div>
              <div className="up-field"><b>Name:</b> {editing ? <input className="up-input" name="name" type="text" value={editedData.name ?? ""} onChange={handleChange} /> : userData.name}</div>
              <div className="up-field"><b>Email:</b> {editing ? <input className="up-input" name="email" type="email" value={editedData.email ?? ""} onChange={handleChange} /> : userData.email}</div>
              <div className="up-field"><b>Department:</b> {editing ? <input className="up-input" name="department" type="text" value={editedData.department ?? ""} onChange={handleChange} /> : userData.department}</div>
              <div className="up-field"><b>Extracurricular Activities:</b> {editing ? <input className="up-input" name="extracurricular_activities" type="text" value={editedData.extracurricular_activities ?? ""} onChange={handleChange} /> : userData.extracurricular_activities}</div>
              <div className="up-field"><b>Sleep Hours:</b> {editing ? <input className="up-input" name="sleep_hours" type="number" value={editedData.sleep_hours ?? ""} onChange={handleChange} /> : userData.sleep_hours}</div>
              <div className="up-field"><b>Tutoring Sessions:</b> {editing ? <input className="up-input" name="tutoring_sessions" type="number" value={editedData.tutoring_sessions ?? ""} onChange={handleChange} /> : userData.tutoring_sessions}</div>
              <div className="up-field"><b>Family Income:</b> {editing ? <input className="up-input" name="family_income" type="number" value={editedData.family_income ?? ""} onChange={handleChange} /> : `₹${userData.family_income ?? 0}`}</div>
              <div className="up-field"><b>Teacher Review:</b> {userData.teacher_review}</div>
              <div className="up-field"><b>Physical Activity:</b> {editing ? <input className="up-input" name="physical_activity" type="number" value={editedData.physical_activity ?? ""} onChange={handleChange} /> : userData.physical_activity}</div>
              <div className="up-field"><b>Learning Disabilities:</b> {editing ? <input className="up-input" name="learning_disabilities" type="text" value={editedData.learning_disabilities ?? ""} onChange={handleChange} /> : userData.learning_disabilities}</div>
              <div className="up-field"><b>Distance from Home:</b> {editing ? <input className="up-input" name="distance_from_home" type="number" value={editedData.distance_from_home ?? ""} onChange={handleChange} /> : userData.distance_from_home}</div>
              <div className="up-field"><b>Gender:</b>
                {editing ? (
                  <div>
                    <label style={{ marginRight: 12 }}><input type="radio" name="gender" value="Male" checked={editedData.gender === "Male"} onChange={handleChange} /> Male</label>
                    <label><input type="radio" name="gender" value="Female" checked={editedData.gender === "Female"} onChange={handleChange} /> Female</label>
                  </div>
                ) : userData.gender}
              </div>
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

      {/* Cropper modal */}
      {showCropper && (
        <div className="cropper-modal" onClick={() => setShowCropper(false)}>
          <div className="cropper-box" onClick={(e) => e.stopPropagation()}>
            <div className="cropper-wrapper">
              <Cropper
                image={profilePicture instanceof File ? URL.createObjectURL(profilePicture) : profilePicture}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="cropper-controls">
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                aria-label="Zoom"
              />

              <div className="cropper-buttons">
                <button className="save-btn" onClick={saveCroppedImage}>Save Photo</button>
                <button className="cancel-btn" onClick={() => setShowCropper(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
