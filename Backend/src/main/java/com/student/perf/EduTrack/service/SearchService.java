package com.student.perf.EduTrack.service;

import com.student.perf.EduTrack.model.DTOs.UserSearchResult;
import com.student.perf.EduTrack.model.Student;
import com.student.perf.EduTrack.model.Staff;
import com.student.perf.EduTrack.repository.StudentRepository;
import com.student.perf.EduTrack.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {

    private final StudentRepository studentRepository;
    private final StaffRepository staffRepository;

    public SearchService(StudentRepository studentRepository, StaffRepository staffRepository) {
        this.studentRepository = studentRepository;
        this.staffRepository = staffRepository;
    }

    public List<UserSearchResult> search(String query) {
        List<UserSearchResult> results = new ArrayList<>();

        // Search students
        List<Student> students = studentRepository.findByNameOrRollNoOrDepartment(query);
        for (Student s : students) {
            results.add(new UserSearchResult(s.getUsername(), s.getName(), "Student"));
        }

        // Search staff
        List<Staff> staffList = staffRepository.findByNameOrIdOrDepartment(query);
        for (Staff st : staffList) {
            results.add(new UserSearchResult(st.getUsername(), st.getName(), "Staff"));
        }

        return results;
    }
}
