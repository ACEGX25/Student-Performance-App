package com.student.perf.EduTrack.model.DTOs;


import lombok.Data;

@Data
public class StaffUpdateDTO {

    private String username;
    private String password; //Optional
    private String firstName;
    private String lastName;
    private String department;
    private String expertise;
    private String email;
    private int experience;
    private String qualification;
    private String designation;
}
