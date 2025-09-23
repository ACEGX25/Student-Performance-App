package com.student.perf.EduTrack.controller;

import com.student.perf.EduTrack.model.DTOs.UserSearchResult;
import com.student.perf.EduTrack.service.SearchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/search")
public class SearchController {

    private final Logger logger = LoggerFactory.getLogger(SearchController.class);
    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    /**
     * Search endpoint for Admins only.
     * Admin can search both students and staff using a single query.
     */
    @GetMapping("/users")
    @PreAuthorize("hasAuthority('Admin')")
    public ResponseEntity<?> searchUsers(
            @RequestParam(value = "query") String query) {

        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Search query cannot be null or empty.");
        }

        try {
            // Search both students and staff
            List<UserSearchResult> results = searchService.search(query);

            if (results.isEmpty()) {
                return ResponseEntity.ok().body("No matching records found.");
            }

            return ResponseEntity.ok(results);

        } catch (Exception e) {
            logger.error("Error during search: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error searching records: " + e.getMessage());
        }
    }
}
