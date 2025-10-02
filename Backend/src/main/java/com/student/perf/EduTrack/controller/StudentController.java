package com.student.perf.EduTrack.controller;

import com.student.perf.EduTrack.model.Student;
import com.student.perf.EduTrack.model.SubjectStat;
import com.student.perf.EduTrack.model.User;
import com.student.perf.EduTrack.repository.StudentRepository;
import com.student.perf.EduTrack.repository.SemesterRepository;
import com.student.perf.EduTrack.repository.UserRepository;
import com.student.perf.EduTrack.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SemesterRepository semesterRepository;

    @PostMapping("/profile/fill-details/test")
    public ResponseEntity<?> testEndpoint() {
        return ResponseEntity.ok("Student can access this!");
    }


    @PostMapping("/profile/fill-details")
    public ResponseEntity<?> fillEssentialDetails(
            @RequestBody Student fillDetails,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            // Fetch student blueprint
            Student student = studentRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            // Update essential fields only
            if (fillDetails.getRollno() != 0) student.setRollno(fillDetails.getRollno());
            if (fillDetails.getDate_of_birth() != null) student.setDate_of_birth(fillDetails.getDate_of_birth());
            if (fillDetails.getDepartment() != null) student.setDepartment(fillDetails.getDepartment());
            if (fillDetails.getGender() != null) student.setGender(fillDetails.getGender());
            if (fillDetails.getFamily_income() != null) student.setFamily_income(fillDetails.getFamily_income());

            // Save updated student blueprint
            Student updatedStudent = studentRepository.save(student);

            // Mark user as detailsFilled
            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            if (!user.isDetailsFilled()) {
                user.setDetailsFilled(true);
                userRepository.save(user);
            }

            return ResponseEntity.ok(updatedStudent);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // POST Request to Add Profile Details
    @PostMapping("/profile/add")
    public ResponseEntity<?> addProfileDetails(
            @RequestBody Student newProfileDetails,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Fetch the currently logged-in student's details
            Student student = studentRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            // Add only the fields that are not already set
            if (newProfileDetails.getRollno() != 0 && student.getRollno() == 0) {
                student.setRollno(newProfileDetails.getRollno());
            }
            if (newProfileDetails.getDepartment() != null && student.getDepartment() == null) {
                student.setDepartment(newProfileDetails.getDepartment());
            }
            if (newProfileDetails.getExtracurricular_activities() != null && student.getExtracurricular_activities() == null) {
                student.setExtracurricular_activities(newProfileDetails.getExtracurricular_activities());
            }
            if (newProfileDetails.getSleep_hours() != 0 && student.getSleep_hours() == 0) {
                student.setSleep_hours(newProfileDetails.getSleep_hours());
            }
            if (newProfileDetails.getPrevious_scores() != 0 && student.getPrevious_scores() == 0) {
                student.setPrevious_scores(newProfileDetails.getPrevious_scores());
            }
            if (newProfileDetails.getTutoring_sessions() != 0 && student.getTutoring_sessions() == 0) {
                student.setTutoring_sessions(newProfileDetails.getTutoring_sessions());
            }
            if (newProfileDetails.getFamily_income() != null && student.getFamily_income() == null) {
                student.setFamily_income(newProfileDetails.getFamily_income());
            }
            if (newProfileDetails.getTeacher_review() != null && student.getTeacher_review() == null) {
                student.setTeacher_review(newProfileDetails.getTeacher_review());
            }
            if (newProfileDetails.getPhysical_activity() != 0 && student.getPhysical_activity() == 0) {
                student.setPhysical_activity(newProfileDetails.getPhysical_activity());
            }
            if (newProfileDetails.getLearning_disabilities() != null && student.getLearning_disabilities() == null) {
                student.setLearning_disabilities(newProfileDetails.getLearning_disabilities());
            }
            if (newProfileDetails.getDistance_from_home() != null && student.getDistance_from_home() == null) {
                student.setDistance_from_home(newProfileDetails.getDistance_from_home());
            }
            if (newProfileDetails.getGender() != null && student.getGender() == null) {
                student.setGender(newProfileDetails.getGender());
            }
            if (newProfileDetails.getExam_score() != 0 && student.getExam_score() == 0) {
                student.setExam_score(newProfileDetails.getExam_score());
            }

            // Save the updated student object
            Student updatedStudent = studentRepository.save(student);

            User user = userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(()-> new RuntimeException("User not found"));
            if (user != null && !user.isDetailsFilled()) {
                user.setDetailsFilled(true);
                userRepository.save(user);
            }


            System.out.println("Additional profile details added for username: " + userDetails.getUsername());

            return ResponseEntity.ok(updatedStudent);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }


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
    // Secure PUT Request for Student details update (with photo upload)
    @PutMapping(value = "/update/{username}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateStudentDetails(
            @PathVariable String username,
            @RequestPart("student") Student updatedDetails,   // JSON part
            @RequestPart(value = "photo", required = false) MultipartFile photo,  // File part
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            // Retrieve the current logged-in student
            Student student = studentRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            // Update only non-null / non-zero fields
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

            // ✅ Simple semester update
            if (updatedDetails.getSemester() != null && !updatedDetails.getSemester().equals(student.getSemester())) {
                student.setSemester(updatedDetails.getSemester());

                // Only try to fetch subjects if department is set
                if (student.getDepartment() != null) {
                    var semConfig = semesterRepository.findByDepartmentAndSemester(
                            student.getDepartment(), student.getSemester());

                    // If a config exists, populate subjects; otherwise skip silently
                    semConfig.ifPresent(config -> student.setSubjects(config.getSubjects()));
                }
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

            // ✅ Handle photo update
            if (photo != null && !photo.isEmpty()) {
                student.setPhoto(photo.getBytes());  // assuming 'photo' is a byte[] column in DB
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