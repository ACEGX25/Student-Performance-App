package com.student.perf.EduTrack.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "subject-stats")
public class SubjectStat {

    @Id
    private String id;

    private String studentId;   // MongoDB _id of Student
    private String subjectName; // Subject name or ID
    private Boolean present;    // Attendance
    private Integer marks;      // Marks scored
    private Integer attendedLectures;
    private Integer totalLectures;

    // ===== Getters and Setters =====
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public Boolean getPresent() { return present; }
    public void setPresent(Boolean present) { this.present = present; }

    public Integer getMarks() { return marks; }
    public void setMarks(Integer marks) { this.marks = marks; }

    public Integer getAttendedLectures() {
        return attendedLectures;
    }

    public void setAttendedLectures(Integer attendedLectures) {
        this.attendedLectures = attendedLectures;
    }

    public Integer getTotalLectures() {
        return totalLectures;
    }

    public void setTotalLectures(Integer totalLectures) {
        this.totalLectures = totalLectures;
    }
}
