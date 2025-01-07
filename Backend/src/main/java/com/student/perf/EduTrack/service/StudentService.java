package com.student.perf.EduTrack.service;

import com.student.perf.EduTrack.model.Student;
import com.student.perf.EduTrack.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // Method to fetch student data by username
    public Student getStudentByUsername(String username) {
        System.out.println("Searching for student with username: " + username); // Debug log

        return studentRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("Student not found in DB for username: " + username); // Debug log
                    return new RuntimeException("Student not found: " + username);
                });
    }

}
