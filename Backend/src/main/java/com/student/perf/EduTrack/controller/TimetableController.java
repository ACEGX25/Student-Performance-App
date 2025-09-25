package com.student.perf.EduTrack.controller;

import com.student.perf.EduTrack.service.TimetableService;
import org.bson.Document;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@RestController
@RequestMapping("/timetables")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    // Upload timetable endpoint
    @PostMapping("/upload")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<String> uploadTimetable(
            @RequestParam("file") MultipartFile file,
            @RequestParam("semester") String semester,
            @RequestParam("department") String department) {
        try {
            // Call the service method to upload the timetable
            String fileId = timetableService.uploadTimetableImage(file, semester, department);
            return ResponseEntity.ok("Timetable uploaded successfully with ID: " + fileId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading timetable: " + e.getMessage());
        }
    }

    // Retrieve timetable image endpoint
    @GetMapping("/view/{fileId}")
    @PreAuthorize("hasRole('staff')")
    public ResponseEntity<?> getTimetableImage(@PathVariable("fileId") String fileId) {
        try {
            InputStream imageStream = timetableService.getTimetableImage(fileId);

            // Retrieve metadata to determine the content type
            Document metadata = timetableService.getTimetableMetadata(fileId);
            String contentType = metadata.getString("contentType");

            if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
                return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                        .body("Unsupported image format");
            }
            // Return the image with appropriate headers
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(new InputStreamResource(imageStream));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Timetable image not found: " + e.getMessage());
        }
    }

    // Delete timetable endpoint
    @DeleteMapping("/delete/{fileId}")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<String> deleteTimetable(@PathVariable("fileId") String fileId) {
        try {
            timetableService.deleteTimetableImage(fileId);
            return ResponseEntity.ok("Timetable deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting timetable: " + e.getMessage());
        }
    }

    @GetMapping("/latest")
    @PreAuthorize("hasRole('staff')")
    public ResponseEntity<?> getLatestTimetable(
            @RequestParam("semester") String semester,
            @RequestParam("department") String department
    )
    {
        try {
            var latestFile = timetableService.getLatestTimetableFile(semester,department);

            if (latestFile == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No timetable found for given semester and department");
            }

            InputStream imageStream = timetableService.getTimetableImage(latestFile.getObjectId().toHexString());
            String contentType = latestFile.getMetadata().getString("contentType");

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(new InputStreamResource(imageStream));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving timetable: " + e.getMessage());
        }
    }

}
