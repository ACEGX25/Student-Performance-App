package com.student.perf.EduTrack.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.student.perf.EduTrack.config.JwtUtil;
import com.student.perf.EduTrack.model.DTOs.AdminUpdateDTO;
import com.student.perf.EduTrack.model.DTOs.StaffUpdateDTO;
import com.student.perf.EduTrack.model.DTOs.StudentUpdateDTO;
import com.student.perf.EduTrack.model.Admin;
import com.student.perf.EduTrack.model.Staff;
import com.student.perf.EduTrack.model.Student;
import com.student.perf.EduTrack.model.User;
import com.student.perf.EduTrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // Signup API
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            // Validation for required fields
            if (user.getName() == null || user.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Name is required"));
            }
            if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
            }
            if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));
            }

            // Register user
            User newUser = userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);

        } catch (RuntimeException e) {
            // Return structured error response
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Login API
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        try {
            // Input validation
            if (!loginData.containsKey("username") || loginData.get("username").trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
            }
            if (!loginData.containsKey("password") || loginData.get("password").trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));
            }

            // Extract credentials
            String username = loginData.get("username");
            String password = loginData.get("password");

            // Fetch user details (including role)
            User user = userService.authenticateUser(username, password); // Assuming findByUsername() fetches the user

            // **DEBUG LOGS**
            System.out.println("Username: " + username); // Log input username
            System.out.println("User: " + user);         // Log the fetched user object

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid username or password"));
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(username);

            // Return token and role in response
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "role", user.getRole(), // Assuming getRole() fetches the role
                        "username", username,
                    "detailsFilled", user.isDetailsFilled()
            ));

        } catch (RuntimeException e) {
            // Return error response
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Logout API
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Clear authentication and SecurityContext
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logged out successfully!");
    }
}
