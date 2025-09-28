package com.student.perf.EduTrack.model;


import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.format.annotation.DateTimeFormat;
import java.util.Date;


@Data
@Getter
@Setter
@Document(collection = "staff")
public class Staff extends User {

    private String department;
    private String semester;
    private String expertise;
    private int experience;
    private String qualification;
    private String designation;
    private String area_of_interest;
    private String address;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private Date date_of_birth;
    private int sub_feedback;
    private byte[] photo;   // Profile photo stored as binary

    //Getter Setter chya aaychi

    public byte[] getPhoto() { return photo; }

    public void setPhoto(byte[] photo) { this.photo = photo; }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getSemester() { return semester; }

    public void setSemester(String semester) { this.semester = semester; }

    public String getExpertise() {
        return expertise;
    }

    public void setExpertise(String expertise) {
        this.expertise = expertise;
    }

    public int getExperience() {
        return experience;
    }

    public void setExperience(int experience) {
        this.experience = experience;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getArea_of_interest() {
        return area_of_interest;
    }

    public void setArea_of_interest(String area_of_interest) {
        this.area_of_interest = area_of_interest;
    }

    public Date getDate_of_birth() {
        return date_of_birth;
    }

    public void setDate_of_birth(Date date_of_birth) {
        this.date_of_birth = date_of_birth;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getSub_feedback() {
        return sub_feedback;
    }

    public void setSub_feedback(int sub_feedback) {
        this.sub_feedback = sub_feedback;
    }
}