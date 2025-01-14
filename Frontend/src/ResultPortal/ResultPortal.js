import React, { useState } from 'react';
import Header from './Header';
import './ResultPortal.css';

export default function ResultForm() {
  const [formData, setFormData] = useState({
    seatNumber: '',
    motherName: ''
  });
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulated result data - replace with actual API call
    const mockResult = {
      seatNo: formData.seatNumber,
      semester: '4th Semester',
      subjects: [
        { name: 'Mathematics', marksObtained: 85, totalMarks: 100, grade: 'A' },
        { name: 'Physics', marksObtained: 78, totalMarks: 100, grade: 'B' },
        { name: 'Chemistry', marksObtained: 92, totalMarks: 100, grade: 'A+' }
      ]
    };
    setResult(mockResult);
  };

  return (
    <>
      <Header />
      <div className="result-portal-container">
        <div className="result-portal-form-card">
          <h2>Student Result Portal</h2>
          <form onSubmit={handleSubmit}>
            <div className="result-portal-form-group">
              <label htmlFor="seatNumber">Seat Number</label>
              <input
                type="text"
                id="seatNumber"
                value={formData.seatNumber}
                onChange={(e) => setFormData({...formData, seatNumber: e.target.value})}
                required
              />
            </div>
            <div className="result-portal-form-group">
              <label htmlFor="motherName">Mother's Name</label>
              <input
                type="text"
                id="motherName"
                value={formData.motherName}
                onChange={(e) => setFormData({...formData, motherName: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="result-portal-submit-btn">Show Result</button>
          </form>
        </div>

        {result && (
          <div className="result-portal-result-card">
            <h3>Result Details</h3>
            <div className="result-portal-result-info">
              <p><strong>Seat No:</strong> {result.seatNo}</p>
              <p><strong>Semester:</strong> {result.semester}</p>
            </div>
            <table className="result-portal-result-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks Obtained</th>
                  <th>Total Marks</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {result.subjects.map((subject, index) => (
                  <tr key={index}>
                    <td>{subject.name}</td>
                    <td>{subject.marksObtained}</td>
                    <td>{subject.totalMarks}</td>
                    <td>{subject.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

