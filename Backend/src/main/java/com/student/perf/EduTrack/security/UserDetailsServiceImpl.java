package com.student.perf.EduTrack.security;

import com.student.perf.EduTrack.model.Admin;
import com.student.perf.EduTrack.model.Staff;
import com.student.perf.EduTrack.model.Student;
import com.student.perf.EduTrack.repository.AdminRepository;
import com.student.perf.EduTrack.repository.StaffRepository;
import com.student.perf.EduTrack.repository.StudentRepository;
import com.student.perf.EduTrack.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Attempt to find the user in the Student repository
        Optional<Student> studentOptional = studentRepository.findByUsername(username);
        if (studentOptional.isPresent()) {
            Student student = studentOptional.get();
            Collection<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("student")); // Add the appropriate role
            return new org.springframework.security.core.userdetails.User(student.getUsername(), student.getPassword(), authorities);
        }

        // Attempt to find the user in the Staff repository
        Optional<Staff> staffOptional = staffRepository.findByUsername(username);
        if (staffOptional.isPresent()) {
            Staff staff = staffOptional.get();
            Collection<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("staff")); //Add the appropriate role
            return new org.springframework.security.core.userdetails.User(staff.getUsername(), staff.getPassword(), authorities);
        }

        // Attempt to find the user in the Admin repository
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            Collection<GrantedAuthority> authorities = new ArrayList<>();
            authorities.add(new SimpleGrantedAuthority("admin")); // Add the appropriate role
            return new org.springframework.security.core.userdetails.User(admin.getUsername(), admin.getPassword(), authorities);
        }

//        // Fetch student by username from MongoDB
//        Student student = studentRepository.findByUsername(username)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
//
//        // Return UserDetails object for Spring Security
//        return User.builder()
//                .username(student.getUsername())
//                .password("{noop}password") // Remove {noop} in production; encode passwords!
//                .roles("STUDENT") // Assign role
//                .build();
        // If no user is found in any repository, throw an exception
        throw new UsernameNotFoundException("User not found");
    }
}
