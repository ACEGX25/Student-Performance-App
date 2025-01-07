package com.student.perf.EduTrack.service;

import com.student.perf.EduTrack.model.Admin;
import com.student.perf.EduTrack.model.Staff;
import com.student.perf.EduTrack.model.Student;
import com.student.perf.EduTrack.model.User;
import com.student.perf.EduTrack.repository.AdminRepository;
import com.student.perf.EduTrack.repository.StaffRepository;
import com.student.perf.EduTrack.repository.StudentRepository;
import com.student.perf.EduTrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Signup logic
    public User registerUser(User user) {
        // Validate required fields
        validateUser(user);

        // Check if username already exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists!");
        }

        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }

        // Encrypt the password before saving
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        System.out.println("Raw Password: " + user.getPassword());
        System.out.println("Encoded Password: " + encodedPassword);
        user.setPassword(encodedPassword);

        // Save user based on their role
        switch (user.getRole().toLowerCase()) {
            case "student":
                Student student = new Student();
                mapCommonFieldsToStudent(user, student);
                student.setPassword(encodedPassword);
                studentRepository.save(student);
                break;

            case "staff":
                Staff staff = new Staff();
                mapCommonFieldsToStaff(user, staff);
                staff.setPassword(encodedPassword);
                staffRepository.save(staff);
                break;

            case "admin":
                Admin admin = new Admin();
                mapCommonFieldsToAdmin(user, admin);
                admin.setPassword(encodedPassword);
                adminRepository.save(admin);
                break;

            default:
                throw new RuntimeException("Invalid role specified! Allowed roles: Student, Staff, Admin");
        }

        // Save the user to the database
        return userRepository.save(user);
    }

    // Map common fields to Student
    private void mapCommonFieldsToStudent(User user, Student student) {
        student.setUsername(user.getUsername());
        student.setEmail(user.getEmail());
        student.setName(user.getName());
    }

    // Map common fields to Staff
    private void mapCommonFieldsToStaff(User user, Staff staff) {
        staff.setUsername(user.getUsername());
        staff.setEmail(user.getEmail());
        staff.setName(user.getName());
    }

    // Map common fields to Admin
    private void mapCommonFieldsToAdmin(User user, Admin admin) {
        admin.setUsername(user.getUsername());
        admin.setEmail(user.getEmail());
        admin.setName(user.getName());
    }

    // Login logic
    public User authenticateUser(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Debug Logs
            System.out.println("Input Password: " + password);
            System.out.println("Encoded Password in DB: " + user.getPassword());

            // Match the password
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }

        // If authentication fails
        return null;
    }

    // Validation logic for user input
    private void validateUser(User user) {
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Fullname cannot be null or empty!");
        }

        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be null or empty!");
        }

        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty!");
        }

        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be null or empty!");
        }

        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            throw new IllegalArgumentException("Role cannot be null or empty!");
        }
    }
}
