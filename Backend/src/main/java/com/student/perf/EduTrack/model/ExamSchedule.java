package com.student.perf.EduTrack.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Getter
@Setter
@Document(collection = "exam-schedules") // MongoDB collection name
public class ExamSchedule {

    @Id
    private String id;
    private String subject;          // Subject of the exam
    private String department;       // Department name
    private int semester;            // Semester number
    private Date exam_date;          // Exam date and time
    private int duration;            // Duration in minutes
    private String venue;            // Venue of the exam

    //
    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public Date getExam_date() {
        return exam_date;
    }

    public void setExam_date(Date exam_date) {
        this.exam_date = exam_date;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }
}
