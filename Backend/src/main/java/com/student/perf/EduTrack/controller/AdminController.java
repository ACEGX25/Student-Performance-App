package com.student.perf.EduTrack.controller;

import com.student.perf.EduTrack.model.Staff;
import com.student.perf.EduTrack.model.Student;
import com.student.perf.EduTrack.model.ExamSchedule;
import com.student.perf.EduTrack.model.ExamResult;
import com.student.perf.EduTrack.repository.ExamResultRepository;
import com.student.perf.EduTrack.repository.ExamScheduleRepository;
import com.student.perf.EduTrack.repository.StaffRepository;
import com.student.perf.EduTrack.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin")
@PreAuthorize("hasAuthority('Admin')")
public class AdminController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private ExamScheduleRepository examScheduleRepository;

    @Autowired
    private ExamResultRepository examResultRepository;

    // API to retrieve all students
    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentRepository.findAll();
        return ResponseEntity.ok(students);
    }

    // API to retrieve all staff
    @GetMapping("/staffs")
    public ResponseEntity<List<Staff>> getAllStaffs() {
        List<Staff> staffs = staffRepository.findAll();
        return ResponseEntity.ok(staffs);
    }

    // API to create or update an exam schedule
    @PostMapping("/schedule/create")
    public ResponseEntity<ExamSchedule> createOrUpdateExamSchedule(@RequestBody ExamSchedule schedule) {
        System.out.println("Received Schedule: " + schedule);
        ExamSchedule savedSchedule = examScheduleRepository.save(schedule);
        return ResponseEntity.ok(savedSchedule);
    }

    // API to get all exam schedules
    @GetMapping("/schedule")
    public ResponseEntity<List<ExamSchedule>> getAllExamSchedules() {
        return ResponseEntity.ok(examScheduleRepository.findAll());
    }

    // API to record an exam result
    @PostMapping("/result")
    public ResponseEntity<ExamResult> recordExamResult(@RequestBody ExamResult result) {
        ExamResult savedResult = examResultRepository.save(result);
        return ResponseEntity.ok(savedResult);
    }

    // API to get exam results for a student
    @GetMapping("/result/{studentId}")
    public ResponseEntity<List<ExamResult>> getResultsByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(examResultRepository.findByStudentId(studentId));
    }

}
