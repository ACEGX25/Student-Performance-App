package com.student.perf.EduTrack.controller;

import com.student.perf.EduTrack.service.AssignmentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    // Existing upload endpoint
    @PostMapping("/upload")
    public ResponseEntity<String> uploadAssignment(@RequestParam("file") MultipartFile file) {
        try {
            String fileId = assignmentService.uploadAssignment(file);
            return ResponseEntity.ok("File uploaded successfully with ID: " + fileId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading file: " + e.getMessage());
        }
    }

    // New endpoint to retrieve the file
    @GetMapping("/download/{fileId}")
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
}
