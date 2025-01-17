import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import car3 from '../assets/rename.png'
import "./Inter.css";

const images = [
  { src: car3, alt: 'Graduation Ceremony' },
];

export default function ProfileCompletion() {
  const [currentImage, setCurrentImage] = useState(0);
  const [formData, setFormData] = useState({
    department: '',
    rollNo: '',
    email: '',
    familyIncome: '',
    addressField1: '',
    addressField2: '',
    residence: '',
    gender: '',
    activity: '',
    photo: null
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleButtonSelect = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.rollNo) newErrors.rollNo = 'Roll No is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.familyIncome) newErrors.familyIncome = 'Family Income is required';
    if (!formData.addressField1) newErrors.addressField1 = 'Address Field 1 is required';
    if (!formData.residence) newErrors.residence = 'Residence is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.activity) newErrors.activity = 'Activity is required';

    if (Object.keys(newErrors).length === 0) {
      try {
        const url = 'http://localhost:8080/api/profile/complete';
        const formDataToSend = new FormData();
        
        for (const key in formData) {
          formDataToSend.append(key, formData[key]);
        }

        const response = await fetch(url, {
          method: 'POST',
          body: formDataToSend,
        });

        if (response.ok) {
          const data = await response.json();
          setMessage('Profile completed successfully!');
          
          const username = data.username || formData.rollNo;
          
          navigate(`/student/dashboard/${username}`);
        } else {
          const result = await response.json();
          setMessage(result.message || 'Profile completion failed');
        }
      } catch (error) {
        setMessage('Error: ' + error.message);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="profile-completion-container">
      <div className="profile-completion">
        <header className="header">
          <div className="container">
            <h1 className="title-otp">EduTrack</h1>
          </div>
        </header>

        <div className="main-content">
          <div className="form-container">
            <div className="glassmorphism-form">
              <h2 className="form-title">Complete Your Profile</h2>
              {message && <div className="message">{message}</div>}
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label-otp-otp">Department</label>
                  <div className="button-group">
                    {['Computer Science', 'Information Technology', 'Mechanical Engineering', 'Civil Engineering', 'Electronics and Telecommunication'].map((dept) => (
                      <button
                        key={dept}
                        type="button"
                        className={`select-button ${formData.department === dept ? 'selected' : ''}`}
                        onClick={() => handleButtonSelect('department', dept)}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                  {errors.department && <p className="error">{errors.department}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="photo" className="form-label-otp">Photo</label>
                  <input 
                    id="photo" 
                    name="photo"
                    type="file" 
                    accept="image/*" 
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rollNo" className="form-label-otp">Roll No</label>
                  <input 
                    id="rollNo" 
                    name="rollNo"
                    type="text" 
                    value={formData.rollNo}
                    onChange={handleChange}
                    required 
                    className="form-input"
                  />
                  {errors.rollNo && <p className="error">{errors.rollNo}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="addressField1" className="form-label-otp">Address Field 1</label>
                  <input 
                    id="addressField1" 
                    name="addressField1"
                    type="text" 
                    value={formData.addressField1}
                    onChange={handleChange}
                    required 
                    className="form-input"
                  />
                  {errors.addressField1 && <p className="error">{errors.addressField1}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="addressField2" className="form-label-otp">Address Field 2</label>
                  <input 
                    id="addressField2" 
                    name="addressField2"
                    type="text" 
                    value={formData.addressField2}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label-otp">Family Income (Annually)</label>
                  <div className="button-group">
                    {['Less than 1L', 'More than 1L', 'More than 3L'].map((income) => (
                      <button
                        key={income}
                        type="button"
                        className={`select-button ${formData.familyIncome === income.toLowerCase() ? 'selected' : ''}`}
                        onClick={() => handleButtonSelect('familyIncome', income.toLowerCase())}
                      >
                        {income}
                      </button>
                    ))}
                  </div>
                  {errors.familyIncome && <p className="error">{errors.familyIncome}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label-otp">Residence</label>
                  <div className="button-group">
                    {['Hostel', 'Paying Guest', 'Native'].map((res) => (
                      <button
                        key={res}
                        type="button"
                        className={`select-button ${formData.residence === res.toLowerCase() ? 'selected' : ''}`}
                        onClick={() => handleButtonSelect('residence', res.toLowerCase())}
                      >
                        {res}
                      </button>
                    ))}
                  </div>
                  {errors.residence && <p className="error">{errors.residence}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label-otp">Gender</label>
                  <div className="button-group">
                    {['Male', 'Female', 'Other'].map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        className={`select-button ${formData.gender === gender.toLowerCase() ? 'selected' : ''}`}
                        onClick={() => handleButtonSelect('gender', gender.toLowerCase())}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                  {errors.gender && <p className="error">{errors.gender}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label-otp">Extracurricular Activities</label>
                  <div className="button-group">
                    {['Sports', 'Cultural', 'Tech'].map((activity) => (
                      <button
                        key={activity}
                        type="button"
                        className={`select-button ${formData.activity === activity.toLowerCase() ? 'selected' : ''}`}
                        onClick={() => handleButtonSelect('activity', activity.toLowerCase())}
                      >
                        {activity}
                      </button>
                    ))}
                  </div>
                  {errors.activity && <p className="error">{errors.activity}</p>}
                </div>

                <button type="submit" className="submit-button">Complete Profile</button>
              </form>
            </div>
          </div>

          <div className="image-carousel">
            {images.map((image, index) => (
              <img
              id='popat'
                key={index}
                src={image.src}
                alt={image.alt}
                className={`carousel-image ${index === currentImage ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>

        <footer className="footer">
          <div className="container">
            <p>&copy; 2025 EduTrack. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

