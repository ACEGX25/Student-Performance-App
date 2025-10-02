package com.student.perf.EduTrack.controller;

import com.student.perf.EduTrack.model.DTOs.StudentSumm;
import com.student.perf.EduTrack.model.Staff;
import com.student.perf.EduTrack.model.Student;
import com.student.perf.EduTrack.model.SubjectStat;
import com.student.perf.EduTrack.repository.StaffRepository;
import com.student.perf.EduTrack.repository.StudentRepository;
import com.student.perf.EduTrack.service.StaffService;
import com.student.perf.EduTrack.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasAuthority('staff')")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private StudentRepository studentRepository;


    // GET Request for Staff Dashboard
    @GetMapping("/dashboard/{username}")
    public ResponseEntity<?> getStaffDashboard(
            @PathVariable String username,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            // Ensure the logged-in user is accessing only their own data
            if (!userDetails.getUsername().equals(username)) {
                return ResponseEntity.status(403).body("Access Denied: Unauthorized access!");
            }

            // Fetch staff details by username
            Staff staff = staffService.getStaffByUsername(username);

            if (staff == null) {
                return ResponseEntity.badRequest().body("Staff not found");
            }

            return ResponseEntity.ok(staff);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // Optional: Update staff details (similar to StudentController)
    @PutMapping(value = "/update/{username}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateStaffDetails(
            @PathVariable String username,
            @RequestPart("staff") Staff updatedDetails,
            @RequestPart(value = "photo", required = false) MultipartFile photo,  // File part
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            // Retrieve the current logged-in staff
            Staff staff = staffRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("Staff not found"));

            // Update only non-null fields
            if (updatedDetails.getName() != null) {
                staff.setName(updatedDetails.getName());
            }
            if (updatedDetails.getEmail() != null) {
                staff.setEmail(updatedDetails.getEmail());
            }
            if (updatedDetails.getPassword() != null) {
                // Encode the password before saving it
                String encodedPassword = passwordEncoder.encode(updatedDetails.getPassword());
                staff.setPassword(encodedPassword);
            }
            if (updatedDetails.getDepartment() != null) {
                staff.setDepartment(updatedDetails.getDepartment());
            }
            if (updatedDetails.getSemester() != null) {
                staff.setSemester(updatedDetails.getSemester());
            }
            if (updatedDetails.getExpertise() != null) {
                staff.setExpertise(updatedDetails.getExpertise());
            }
            if (updatedDetails.getExperience() != 0) {
                staff.setExperience(updatedDetails.getExperience());
            }
            if (updatedDetails.getQualification() != null) {
                staff.setQualification(updatedDetails.getQualification());
            }
            if (updatedDetails.getDesignation() != null) {
                staff.setDesignation(updatedDetails.getDesignation());
            }
            if (updatedDetails.getArea_of_interest() != null) {
                staff.setArea_of_interest(updatedDetails.getArea_of_interest());
            }
            if (updatedDetails.getAddress() != null) {
                staff.setAddress(updatedDetails.getAddress());
            }
            if (updatedDetails.getDate_of_birth() != null) {
                staff.setDate_of_birth(updatedDetails.getDate_of_birth());
            }
            if (updatedDetails.getSub_feedback() != 0) {
                staff.setSub_feedback(updatedDetails.getSub_feedback());
            }

            // ✅ Handle photo update
            if (photo != null && !photo.isEmpty()) {
                staff.setPhoto(photo.getBytes());  // assuming 'photo' is a byte[] column in DB
            }

            // Save the updated staff details
            staffRepository.save(staff);
            System.out.println("Staff details updated successfully for username: " + userDetails.getUsername());

            return ResponseEntity.ok(staff);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    // ✅ Get only the subjects this staff teaches
    @GetMapping("/dashboard/{username}/subjects")
    public ResponseEntity<?> getStaffSubjects(
            @PathVariable String username,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            // Ensure logged-in staff can only view their own subjects
            if (!userDetails.getUsername().equals(username)) {
                return ResponseEntity.status(403).body("Access Denied: Unauthorized access!");
            }

            Staff staff = staffRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Staff not found"));

            return ResponseEntity.ok(staff.getSubjects());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }



// ✅ Get all students for a given subject (workspace)
    @GetMapping("/dashboard/{username}/subjects/{subjectId}/students")
    public ResponseEntity<?> getStudentsForSubject(
            @PathVariable String username,
            @PathVariable String subjectId,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            if (!userDetails.getUsername().equals(username)) {
                return ResponseEntity.status(403).body("Access Denied: Unauthorized access!");
            }

            Staff staff = staffRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Staff not found"));

            if (!staff.getSubjects().contains(subjectId)) {
                return ResponseEntity.status(403).body("Access Denied: You do not teach this subject");
            }

            // ✅ Use the injected instance, do NOT create a new one
            List<StudentSumm> students = subjectService.getStudentsForSubject(subjectId);

            return ResponseEntity.ok(students);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/dashboard/{username}/subjects/{subjectId}/attendance/mark-absentees")
    public ResponseEntity<?> markAbsentees(
            @PathVariable String username,
            @PathVariable String subjectId,
            @RequestBody List<Integer> absentRollNumbers,
            @AuthenticationPrincipal UserDetails userDetails) {

        try {
            if (!userDetails.getUsername().equals(username)) {
                return ResponseEntity.status(403).body("Unauthorized");
            }

            Staff staff = staffRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Staff not found"));

            if (!staff.getSubjects().contains(subjectId)) {
                return ResponseEntity.status(403).body("You do not teach this subject");
            }

            List<Student> students = studentRepository.findBySubjectsContaining(subjectId);

            int totalLectures = 72; // adjust per semester/subject

            for (Student student : students) {
                if (student.getSubjectStats() == null) {
                    student.setSubjectStats(new HashMap<>());
                }

                SubjectStat stat = student.getSubjectStats().get(subjectId);
                if (stat == null) {
                    stat = new SubjectStat();
                    stat.setTotalLectures(totalLectures);
                    stat.setAttendedLectures(totalLectures);
                    stat.setMarks(null);
                    student.getSubjectStats().put(subjectId, stat);
                }

                if (absentRollNumbers.contains(student.getRollno())) {
                    stat.setAttendedLectures(Math.max(0, stat.getAttendedLectures() - 1));
                }
            }

            studentRepository.saveAll(students);

            return ResponseEntity.ok("Attendance updated successfully!");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

}
