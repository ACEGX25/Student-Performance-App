package com.student.perf.EduTrack.service;

import com.student.perf.EduTrack.repository.StaffRepository;
import com.student.perf.EduTrack.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class SearchService {

    private final StudentRepository studentRepository;
    private final StaffRepository staffRepository;

    @Autowired
    public SearchService(StudentRepository studentRepository, StaffRepository staffRepository) {
        this.studentRepository = studentRepository;
        this.staffRepository = staffRepository;
    }

    // Search method for students and staff
    public List<Map<String, Object>> search(String query) {
        List<Map<String, Object>> studentResults = studentRepository.findByNameOrRollNoOrDepartment(query);
        List<Map<String, Object>> staffResults = staffRepository.findByNameOrIdOrDepartment(query);

        // Combine student and staff results
        List<Map<String, Object>> combinedResults = new ArrayList<>();
        combinedResults.addAll(studentResults);
        combinedResults.addAll(staffResults);

        return combinedResults;
    }
}
