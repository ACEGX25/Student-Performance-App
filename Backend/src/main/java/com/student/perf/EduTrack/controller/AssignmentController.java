package com.student.perf.EduTrack.controller;

import com.student.perf.EduTrack.service.AssignmentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import org.springframework.core.io.InputStreamResource;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    // Modified upload endpoint to handle additional fields (subject, description, dueDate)
    @PostMapping("/upload")
    @PreAuthorize("hasRole('staff')")
    public ResponseEntity<String> uploadAssignment(
            @RequestParam("file") MultipartFile file,
            @RequestParam("subject") String subject,
            @RequestParam("description") String description,
            @RequestParam("dueDate") String dueDate) {
        try {
            // Pass the additional fields along with the file to the service
            String fileId = assignmentService.uploadAssignment(file, subject, description, dueDate);
            return ResponseEntity.ok("Assignment uploaded successfully with ID: " + fileId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading assignment: " + e.getMessage());
        }
    }

    // Endpoint to retrieve the file
    @GetMapping("/download/{fileId}")
    @PreAuthorize("hasRole('staff')")
    public ResponseEntity<InputStreamResource> downloadAssignment(@PathVariable("fileId") String fileId) {
        try {
            InputStream fileStream = assignmentService.getFile(fileId);

            // Set headers for file download
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=assignment.pdf");

            // Return the file as a downloadable resource
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(new InputStreamResource(fileStream));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null); // File not found or error retrieving file
        }
    }

    // Delete Assignment (for STAFF)
    @DeleteMapping("/delete/{fileId}")
    @PreAuthorize("hasRole('staff')")
    public ResponseEntity<String> deleteAssignment(@PathVariable("fileId") String fileId) {
        try {
            assignmentService.deleteAssignment(fileId); // Implement this method in service
            return ResponseEntity.ok("Assignment deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting assignment: " + e.getMessage());
        }
    }
}
