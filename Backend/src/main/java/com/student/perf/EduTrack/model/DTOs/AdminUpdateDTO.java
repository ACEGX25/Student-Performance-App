package com.student.perf.EduTrack.model.DTOs;

import lombok.Data;

@Data
public class AdminUpdateDTO {
    private String username;
    private String password; // Optional
    // Add any specific fields for admin updates here
}