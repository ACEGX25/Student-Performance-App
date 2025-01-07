package com.student.perf.EduTrack.model.DTOs;

public class StudentUpdateDTO {
    private String username;
    private String password;   // Optional
    private int rollno;                            // Student Roll Number
    private String name;                           // Full Name
    private String email;                          // Email address
    private String department;                     // Department (e.g., CS)
    private String extracurricular_activities;      // Participation in extracurricular activities (Yes/No)
    private int sleep_hours;                        // Hours of sleep per day
    private int tutoring_sessions;                  // Number of tutoring sessions attended
    private String family_income;                   // Family income category (Low/Medium/High)
    private String teacher_review;                  // Teacher's review (Low/Medium/High)
    private int physical_activity;                  // Physical activity per week (hours)
    private String learning_disabilities;           // Presence of learning disabilities (Yes/No)
    private String distance_from_home;               // Distance from home (Near/Far)
    private String gender;                         // Gender (Male/Female/Other)
}
