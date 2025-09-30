package com.student.perf.EduTrack.controller;

import com.student.perf.EduTrack.config.JwtUtil;
import com.student.perf.EduTrack.config.OtpUtil;
import com.student.perf.EduTrack.repository.UserRepository;
import com.student.perf.EduTrack.model.User;
import com.student.perf.EduTrack.model.RefreshToken;
import com.student.perf.EduTrack.service.EmailService;
import com.student.perf.EduTrack.service.OtpService;
import com.student.perf.EduTrack.service.RefreshTokenService;
import com.student.perf.EduTrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // =======================
    // Signup API
    // =======================
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
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/signup/send-otp")
    public ResponseEntity<?> sendOtp(@RequestParam String email) {
        // Check if user exists
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not registered yet. Please signup first."));
        }
        if (user.isVerified()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already verified"));
        }

        try {
            String otp = otpService.generateOtp(email);
            emailService.sendOtpEmail(email, otp);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }

        return ResponseEntity.ok(Map.of("message", "OTP sent to " + email));
    }



    @PostMapping("/signup/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        if (!otpService.verifyOtp(email, otp)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid or expired OTP"));
        }

        // mark user as verified
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setVerified(true);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
    }


    // =======================
    // Login API
    // =======================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData, HttpServletResponse response) {
        try {
            // Input validation
            if (!loginData.containsKey("username") || loginData.get("username").trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
            }
            if (!loginData.containsKey("password") || loginData.get("password").trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));
            }

            String username = loginData.get("username");
            String password = loginData.get("password");

            // Authenticate user
            User user = userService.authenticateUser(username, password);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid username or password"));
            }

            //OTP verified flag authorize
            if (!user.isVerified()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Email not verified"));
            }

            // Generate JWT access token
            String accessToken = jwtUtil.generateToken(username);

            // Generate refresh token and store in DB
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(username);

            // Set httpOnly cookies
            ResponseCookie accessCookie = ResponseCookie.from("accessToken", accessToken)
                    .httpOnly(true).secure(true).sameSite("Strict").path("/")
                    .maxAge(15 * 60) // 15 minutes
                    .build();

            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken.getToken())
                    .httpOnly(true).secure(true).sameSite("Strict").path("/")
                    .maxAge(7 * 24 * 60 * 60) // 7 days
                    .build();

            response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
            response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

            // Return user info (without token in response)
            return ResponseEntity.ok(Map.of(
                    "role", user.getRole(),
                    "username", username,
                    "detailsFilled", user.isDetailsFilled()
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // =======================
    // Logout API
    // =======================
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        // Clear backend refresh token
        SecurityContextHolder.clearContext();

        ResponseCookie deleteAccess = ResponseCookie.from("accessToken", "")
                .httpOnly(true).secure(true).path("/").maxAge(0).build();

        ResponseCookie deleteRefresh = ResponseCookie.from("refreshToken", "")
                .httpOnly(true).secure(true).path("/").maxAge(0).build();

        response.addHeader(HttpHeaders.SET_COOKIE, deleteAccess.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, deleteRefresh.toString());

        return ResponseEntity.ok("Logged out successfully!");
    }


    // =======================
    // Refresh Token API
    // =======================
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        // Extract refresh token from cookies
        String refreshTokenValue = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshTokenValue = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshTokenValue == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Refresh token not found"));
        }

        // Validate refresh token
        if (!refreshTokenService.validateRefreshToken(refreshTokenValue)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid or expired refresh token"));
        }

        // Get username from refresh token
        String username = refreshTokenService.findByToken(refreshTokenValue)
                .map(rt -> rt.getUsername())
                .orElse(null);

        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid refresh token"));
        }

        // Generate new access token
        String newAccessToken = jwtUtil.generateToken(username);

        // Optionally, rotate refresh token
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(username);
        refreshTokenService.findByToken(refreshTokenValue)
                .ifPresent(oldToken -> refreshTokenService.deleteByUsername(username)); // remove old token
        // Set new cookies
       /* ONLY FOR PRODUCTION!!!!!
       ResponseCookie accessCookie = ResponseCookie.from("accessToken", newAccessToken)
                .httpOnly(true).secure(true).sameSite("Strict").path("/")
                .maxAge(15 * 60) // 15 minutes
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", newRefreshToken.getToken())
                .httpOnly(true).secure(true).sameSite("Strict").path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 days
                .build();
          */
        // FOR RUNNING ON LOCALHOST
        ResponseCookie accessCookie = ResponseCookie.from("accessToken", newAccessToken)
                .httpOnly(true)
                .secure(false)        // false on localhost
                .sameSite("Lax")      // or "None" + secure for cross-site
                .path("/")
                .maxAge(15 * 60) // 15 minutes
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", newRefreshToken.getToken())
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(7 * 24 * 60 * 60) // 7 days
                .build();


        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok(Map.of(
                "message", "Access token refreshed",
                "username", username
        ));
    }

}
