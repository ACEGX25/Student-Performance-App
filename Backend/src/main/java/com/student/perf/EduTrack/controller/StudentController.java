package com.student.perf.EduTrack.controller;

import com.student.perf.EduTrack.model.Student;
import com.student.perf.EduTrack.repository.StudentRepository;
import com.student.perf.EduTrack.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasAuthority('student')")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Secure GET Request for Student Dashboard
    @GetMapping("/dashboard/{username}")
    public ResponseEntity<?> getStudentDashboard(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Fetch the current logged-in student's details
            Student student = studentRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            return ResponseEntity.ok(student); // Return student data
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Secure PUT Request for Student details update
    @PutMapping("/update")
    public ResponseEntity<?> updateStudentDetails(
            @RequestBody Student updatedDetails,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            // Retrieve the current logged-in student
            Student student = studentRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            // Update only non-null fields
            if (updatedDetails.getRollno() != 0) {
                student.setRollno(updatedDetails.getRollno());
            }
            if (updatedDetails.getName() != null) {
                student.setName(updatedDetails.getName());
            }
            if (updatedDetails.getEmail() != null) {
                student.setEmail(updatedDetails.getEmail());
            }
            if (updatedDetails.getDepartment() != null) {
                student.setDepartment(updatedDetails.getDepartment());
            }
            if (updatedDetails.getExtracurricular_activities() != null) {
                student.setExtracurricular_activities(updatedDetails.getExtracurricular_activities());
            }
            if (updatedDetails.getSleep_hours() != 0) {
                student.setSleep_hours(updatedDetails.getSleep_hours());
            }
            if (updatedDetails.getPrevious_scores() != 0) {
                student.setPrevious_scores(updatedDetails.getPrevious_scores());
            }
            if (updatedDetails.getTutoring_sessions() != 0) {
                student.setTutoring_sessions(updatedDetails.getTutoring_sessions());
            }
            if (updatedDetails.getFamily_income() != null) {
                student.setFamily_income(updatedDetails.getFamily_income());
            }
            if (updatedDetails.getTeacher_review() != null) {
                student.setTeacher_review(updatedDetails.getTeacher_review());
            }
            if (updatedDetails.getPhysical_activity() != 0) {
                student.setPhysical_activity(updatedDetails.getPhysical_activity());
            }
            if (updatedDetails.getLearning_disabilities() != null) {
                student.setLearning_disabilities(updatedDetails.getLearning_disabilities());
            }
            if (updatedDetails.getDistance_from_home() != null) {
                student.setDistance_from_home(updatedDetails.getDistance_from_home());
            }
            if (updatedDetails.getGender() != null) {
                student.setGender(updatedDetails.getGender());
            }
            if (updatedDetails.getExam_score() != 0) {
                student.setExam_score(updatedDetails.getExam_score());
            }

            // Handle password update securely
            if (updatedDetails.getPassword() != null && !updatedDetails.getPassword().isEmpty()) {
                student.setPassword(passwordEncoder.encode(updatedDetails.getPassword()));
            }

            // Save the updated student object
            Student updatedStudent = studentRepository.save(student);

            System.out.println("Student details updated successfully for username: " + userDetails.getUsername());

            return ResponseEntity.ok(updatedStudent);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
