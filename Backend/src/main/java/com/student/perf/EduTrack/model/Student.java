package com.student.perf.EduTrack.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@Getter
@Setter
@Document(collection = "student-info") // MongoDB collection name
public class Student extends User{

    private int rollno;                            // Student Roll Number
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private Date date_of_birth;                    // Date of birth
    private String department;                     // Department (e.g., CS)
    private int hours_studied;                      // Total hours studied
    private int attendance;                        // Attendance percentage
    private String extracurricular_activities;      // Participation in extracurricular activities (Yes/No)
    private int sleep_hours;                        // Hours of sleep per day
    private int previous_scores;                    // Previous academic scores
    private int tutoring_sessions;                  // Number of tutoring sessions attended
    private String family_income;                   // Family income category (Low/Medium/High)
    private String teacher_review;                  // Teacher's review (Low/Medium/High)
    private int physical_activity;                  // Physical activity per week (hours)
    private String learning_disabilities;           // Presence of learning disabilities (Yes/No)
    private String distance_from_home;               // Distance from home (Near/Far)
    private String gender;                         // Gender (Male/Female/Other)
    private int exam_score;                         // Exam score

    private byte[] photo;   // Profile photo stored as binary

    public byte[] getPhoto() { return photo; }

    public void setPhoto(byte[] photo) { this.photo = photo; }

    public int getHours_studied() {
        return hours_studied;
    }

    public void setHours_studied(int hours_studied) {
        this.hours_studied = hours_studied;
    }

    public String getExtracurricular_activities() {
        return extracurricular_activities;
    }

    public void setExtracurricular_activities(String extracurricular_activities) {
        this.extracurricular_activities = extracurricular_activities;
    }

    public int getSleep_hours() {
        return sleep_hours;
    }

    public void setSleep_hours(int sleep_hours) {
        this.sleep_hours = sleep_hours;
    }

    public int getTutoring_sessions() {
        return tutoring_sessions;
    }

    public void setTutoring_sessions(int tutoring_sessions) {
        this.tutoring_sessions = tutoring_sessions;
    }

    public String getFamily_income() {
        return family_income;
    }

    public void setFamily_income(String family_income) {
        this.family_income = family_income;
    }

    public String getTeacher_review() {
        return teacher_review;
    }

    public void setTeacher_review(String teacher_review) {
        this.teacher_review = teacher_review;
    }

    public int getPhysical_activity() {
        return physical_activity;
    }

    public void setPhysical_activity(int physical_activity) {
        this.physical_activity = physical_activity;
    }

    public String getDistance_from_home() {
        return distance_from_home;
    }

    public void setDistance_from_home(String distance_from_home) {
        this.distance_from_home = distance_from_home;
    }

    public String getLearning_disabilities() {
        return learning_disabilities;
    }

    public void setLearning_disabilities(String learning_disabilities) {
        this.learning_disabilities = learning_disabilities;
    }

    public int getRollno() {
        return rollno;
    }

    public void setRollno(int rollno) {
        this.rollno = rollno;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public int getAttendance() {
        return attendance;
    }

    public void setAttendance(int attendance) {
        this.attendance = attendance;
    }

    public int getPrevious_scores() {
        return previous_scores;
    }

    public void setPrevious_scores(int previous_scores) {
        this.previous_scores = previous_scores;
    }

    public int getExam_score() {
        return exam_score;
    }

    public void setExam_score(int exam_score) {
        this.exam_score = exam_score;
    }
}