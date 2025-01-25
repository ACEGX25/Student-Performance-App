package com.student.perf.EduTrack.controller;

import com.student.perf.EduTrack.service.SearchService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    // General search accessible to Admins (no role needed in the request)
    @GetMapping("/users")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<?> searchForAdmin(
            @RequestParam(value = "query", required = false) String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Search query cannot be null or empty.");
        }

        try {
            List<Map<String, Object>> results = searchService.search(query);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error searching records: " + e.getMessage());
        }
    }

    // Staff Search for Students Only (filtering handled in frontend)
    @GetMapping("/staff/students")
    @PreAuthorize("hasRole('staff')")
    public ResponseEntity<?> searchForStaff(
            @RequestParam(value = "query", required = false) String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Search query cannot be null or empty.");
        }

        try {
            List<Map<String, Object>> results = searchService.search(query);
            // The frontend will filter the results to show only students
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error searching students: " + e.getMessage());
        }
    }
}
