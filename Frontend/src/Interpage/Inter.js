import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, User, Mail, CheckCircle } from "lucide-react";
import "./Inter.css";

const images = [
  '/placeholder.svg?height=600&width=600&text=Campus+Life',
  '/placeholder.svg?height=600&width=600&text=Students+Studying',
  '/placeholder.svg?height=600&width=600&text=Graduation+Ceremony',
];

export default function ProfileCompletion() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(timer);
  }, []);

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
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-lg font-semibold">Department</label>
              <div className="grid grid-cols-3 gap-4">
                <label className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:shadow-lg">
                  <input type="radio" value="cs" id="cs" name="department" className="text-blue-600" />
                  <span>Computer Science</span>
                </label>
                <label className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:shadow-lg">
                  <input type="radio" value="ee" id="ee" name="department" className="text-blue-600" />
                  <span>Electrical Engineering</span>
                </label>
                <label className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:shadow-lg">
                  <input type="radio" value="me" id="me" name="department" className="text-blue-600" />
                  <span>Mechanical Engineering</span>
                </label>
                <label className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:shadow-lg">
                  <input type="radio" value="ce" id="ce" name="department" className="text-blue-600" />
                  <span>Civil Engineering</span>
                </label>
                <label className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow-md cursor-pointer transition-all duration-200 hover:bg-blue-50 hover:shadow-lg">
                  <input type="radio" value="etc" id="etc" name="department" className="text-blue-600" />
                  <span>Electronics and Telecommunication</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="rollNo" className="text-lg font-semibold">Roll No</label>
              <input id="rollNo" type="text" required className="w-full p-2 border rounded" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-lg font-semibold">Email</label>
              <input id="email" type="email" required className="w-full p-2 border rounded" />
            </div>
            <div className="space-y-2">
              <label className="text-lg font-semibold">Family Income</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 p-3 bg-white rounded-full shadow-md cursor-pointer transition-all duration-200 hover:bg-green-50 hover:shadow-lg">
                  <input type="radio" value="low" id="low" name="familyIncome" className="text-green-600" />
                  <span>Low</span>
                </label>
                <label className="flex items-center space-x-2 p-3 bg-white rounded-full shadow-md cursor-pointer transition-all duration-200 hover:bg-green-50 hover:shadow-lg">
                  <input type="radio" value="medium" id="medium" name="familyIncome" className="text-green-600" />
                  <span>Medium</span>
                </label>
                <label className="flex items-center space-x-2 p-3 bg-white rounded-full shadow-md cursor-pointer transition-all duration-200 hover:bg-green-50 hover:shadow-lg">
                  <input type="radio" value="high" id="high" name="familyIncome" className="text-green-600" />
                  <span>High</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="addressField1" className="text-lg font-semibold">Address Field 1</label>
              <input id="addressField1" type="text" required className="w-full p-2 border rounded" />
            </div>
            <div className="space-y-2">
              <label htmlFor="addressField2" className="text-lg font-semibold">Address Field 2</label>
              <input id="addressField2" type="text" className="w-full p-2 border rounded" />
            </div>
            <div className="space-y-2">
              <label className="text-lg font-semibold">Residence</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 p-3 bg-white rounded-full shadow-md cursor-pointer transition-all duration-200 hover:bg-green-50 hover:shadow-lg">
                  <input type="radio" value="hostel" id="hostel" name="residence" className="text-green-600" />
                  <span>Hostel</span>
                </label>
                <label className="flex items-center space-x-2 p-3 bg-white rounded-full shadow-md cursor-pointer transition-all duration-200 hover:bg-green-50 hover:shadow-lg">
                  <input type="radio" value="pg" id="pg" name="residence" className="text-green-600" />
                  <span>Paying Guest</span>
                </label>
                <label className="flex items-center space-x-2 p-3 bg-white rounded-full shadow-md cursor-pointer transition-all duration-200 hover:bg-green-50 hover:shadow-lg">
                  <input type="radio" value="native" id="native" name="residence" className="text-green-600" />
                  <span>Native</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-lg font-semibold">Gender</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 p-3 bg-white rounded-full shadow-md cursor-pointer transition-all duration-200 hover:bg-purple-50 hover:shadow-lg">
                  <input type="radio" value="male" id="male" name="gender" className="text-purple-600" />
                  <span>Male</span>
                </label>
                <label className="flex items-center space-x-2 p-3 bg-white rounded-full shadow-md cursor-pointer transition-all duration-200 hover:bg-purple-50 hover:shadow-lg">
                  <input type="radio" value="female" id="female" name="gender" className="text-purple-600" />
                  <span>Female</span>
                </label>
                <label className="flex items-center space-x-2 p-3 bg-white rounded-full shadow-md cursor-pointer transition-all duration-200 hover:bg-purple-50 hover:shadow-lg">
                  <input type="radio" value="other" id="other" name="gender" className="text-purple-600" />
                  <span>Other</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="photo" className="text-lg font-semibold">Photo (Optional)</label>
              <input id="photo" type="file" accept="image/*" className="w-full p-2 border rounded" />
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
