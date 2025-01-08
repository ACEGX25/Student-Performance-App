import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, User, Mail, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import car1 from '../assets/carousel1.jpg'
import car2 from '../assets/carousel2.jpg'
import car3 from '../assets/carousel3.jpg'
import car4 from '../assets/carousel4.jpg'
import "./Inter.css";


const images = [
  `${car1}text=Campus+Life`,
  `${car2}text=Students+Studying`,
  `${car3}text=Graduation+Ceremony`,
  `${car4}text=Graduation+Ceremony`
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
    photo: null
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Perform form validation
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.rollNo) newErrors.rollNo = 'Roll No is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.familyIncome) newErrors.familyIncome = 'Family Income is required';
    if (!formData.addressField1) newErrors.addressField1 = 'Address Field 1 is required';
    if (!formData.residence) newErrors.residence = 'Residence is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';

    if (Object.keys(newErrors).length === 0) {
      try {
        const url = 'http://localhost:8080/api/profile/complete'; // Replace with your actual API endpoint
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
          
          // Assuming the API returns the username in the response
          const username = data.username || formData.rollNo; // Fallback to rollNo if username is not provided
          
          // Navigate to the student dashboard
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
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="inline-block transform hover:scale-110 transition-transform duration-200">EduTrack</span>
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex overflow-hidden">
        {/* Left side - Profile Completion Form */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
          <h2 className="text-3xl font-bold mb-6">Complete Your Profile</h2>
          {message && <div className="mb-4 text-center text-green-600">{message}</div>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-lg font-semibold">Department</label>
              <div className="grid grid-cols-3 gap-4">
                {['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Electronics and Telecommunication'].map((dept) => (
                  <label key={dept} className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:shadow-lg">
                    <input 
                      type="radio" 
                      value={dept} 
                      name="department" 
                      onChange={handleChange}
                      checked={formData.department === dept}
                      className="text-blue-600" 
                    />
                    <span>{dept}</span>
                  </label>
                ))}
              </div>
              {errors.department && <p className="text-red-500">{errors.department}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="rollNo" className="text-lg font-semibold">Roll No</label>
              <input 
                id="rollNo" 
                name="rollNo"
                type="text" 
                value={formData.rollNo}
                onChange={handleChange}
                required 
                className="w-full p-2 border rounded" 
              />
              {errors.rollNo && <p className="text-red-500">{errors.rollNo}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-lg font-semibold">Email</label>
              <input 
                id="email" 
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                required 
                className="w-full p-2 border rounded" 
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-lg font-semibold">Family Income</label>
              <div className="flex space-x-4">
                {['Low', 'Medium', 'High'].map((income) => (
                  <label key={income} className="flex items-center space-x-2 p-3 bg-white rounded-full shadow-md cursor-pointer transition-all duration-200 hover:bg-green-50 hover:shadow-lg">
                    <input 
                      type="radio" 
                      value={income.toLowerCase()} 
                      name="familyIncome" 
                      onChange={handleChange}
                      checked={formData.familyIncome === income.toLowerCase()}
                      className="text-green-600" 
                    />
                    <span>{income}</span>
                  </label>
                ))}
              </div>
              {errors.familyIncome && <p className="text-red-500">{errors.familyIncome}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="addressField1" className="text-lg font-semibold">Address Field 1</label>
              <input 
                id="addressField1" 
                name="addressField1"
                type="text" 
                value={formData.addressField1}
                onChange={handleChange}
                required 
                className="w-full p-2 border rounded" 
              />
              {errors.addressField1 && <p className="text-red-500">{errors.addressField1}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="addressField2" className="text-lg font-semibold">Address Field 2</label>
              <input 
                id="addressField2" 
                name="addressField2"
                type="text" 
                value={formData.addressField2}
                onChange={handleChange}
                className="w-full p-2 border rounded" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-lg font-semibold">Residence</label>
              <div className="flex space-x-4">
                {['Hostel', 'Paying Guest', 'Native'].map((res) => (
                  <label key={res} className="flex items-center space-x-2 p-3 bg-white rounded-full shadow-md cursor-pointer transition-all duration-200 hover:bg-green-50 hover:shadow-lg">
                    <input 
                      type="radio" 
                      value={res.toLowerCase()} 
                      name="residence" 
                      onChange={handleChange}
                      checked={formData.residence === res.toLowerCase()}
                      className="text-green-600" 
                    />
                    <span>{res}</span>
                  </label>
                ))}
              </div>
              {errors.residence && <p className="text-red-500">{errors.residence}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-lg font-semibold">Gender</label>
              <div className="flex space-x-4">
                {['Male', 'Female', 'Other'].map((gender) => (
                  <label key={gender} className="flex items-center space-x-2 p-3 bg-white rounded-full shadow-md cursor-pointer transition-all duration-200 hover:bg-purple-50 hover:shadow-lg">
                    <input 
                      type="radio" 
                      value={gender.toLowerCase()} 
                      name="gender" 
                      onChange={handleChange}
                      checked={formData.gender === gender.toLowerCase()}
                      className="text-purple-600" 
                    />
                    <span>{gender}</span>
                  </label>
                ))}
              </div>
              {errors.gender && <p className="text-red-500">{errors.gender}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="photo" className="text-lg font-semibold">Photo (Optional)</label>
              <input 
                id="photo" 
                name="photo"
                type="file" 
                accept="image/*" 
                onChange={handleChange}
                className="w-full p-2 border rounded" 
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">Complete Profile</button>
          </form>
        </div>

        {/* Right side - Photo Carousel */}
        <div className="hidden md:block w-1/2 relative overflow-hidden">
          {images.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Slide ${index + 1}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 EduTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}