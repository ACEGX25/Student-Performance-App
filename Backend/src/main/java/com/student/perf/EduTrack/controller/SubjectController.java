package com.student.perf.EduTrack.controller;

import com.student.perf.EduTrack.model.DTOs.StudentSumm;
import com.student.perf.EduTrack.model.Student;
import com.student.perf.EduTrack.service.SubjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    // Endpoint to get all students for a given subject (workspace)
    @GetMapping("/{subjectId}/students")
    public List<StudentSumm> getStudentsForSubject(@PathVariable String subjectId) {
        return subjectService.getStudentsForSubject(subjectId);
    }
}
