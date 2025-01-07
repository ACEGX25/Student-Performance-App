package com.student.perf.EduTrack.controller;

import com.student.perf.EduTrack.model.Staff;
import com.student.perf.EduTrack.repository.StaffRepository;
import com.student.perf.EduTrack.service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/staff")
@PreAuthorize("hasAuthority('staff')")
public class StaffController {

    @Autowired
    private StaffService staffService;

    @Autowired
    private StaffRepository staffRepository;

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
    @PutMapping("/update")
    public ResponseEntity<Staff> updateStaffDetails(
            @RequestBody Staff updatedDetails,
            @AuthenticationPrincipal UserDetails userDetails) {

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
            staff.setPassword(updatedDetails.getPassword());
        }

        // Save updated staff object
        Staff updatedStaff = staffRepository.save(staff);

        return ResponseEntity.ok(updatedStaff);
    }
}
