package com.student.perf.EduTrack.service;

import com.student.perf.EduTrack.model.Staff;
import com.student.perf.EduTrack.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

    // Method to fetch staff data by username
    public Staff getStaffByUsername(String username) {
        System.out.println("Searching for staff with username: " +username); //Debug log

        return staffRepository.findByUsername(username)
                .orElseThrow(() -> {
                            System.out.println("Staff not found in DB for username: " +username);
                            return new RuntimeException("Staff not found: " +username);
                        });
    }
}
