import React from 'react'
import './Landing.css'

const Landing = () => {
  return (
    <div className='con' >
      <div className='pos'>
        <h1>Student Performance Hub</h1>
      </div>
      <div className='ye'>
        <div className ='yrs'>First Year</div>
        <div className ='yrs'>Second Year</div>
        <div className ='yrs'>Third Year</div>
        <div className ='yrs'>Final Year</div>
      </div>
      <div className='lis'>
        <h2> Selected Year</h2>
      </div>
      <div className='bob'>
      <div className='ops'>
        <h3>New Project Showcase</h3>
        <p>Students to present their innovative projects next month.</p>
      </div>
      <div className='ops'>
        <h3>Upcoming Workshop</h3>
        <p>AI and Machine Learning workshop scheduled for next week.</p>
      </div>
      <div className='ops'>
        <h3>Sports Tournament</h3>
        <p>Inter-department cricket tournament starting from 15th.</p>
      </div>
      <div className='ops'>
        <h3>Carrier Fair</h3>
        <p>Annual career fair with top companies visiting campus next month.</p>
      </div>
      </div>
    </div>
  )
}

export default Landing
