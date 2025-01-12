package com.student.perf.EduTrack.repository;

import com.student.perf.EduTrack.model.ExamResult;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ExamResultRepository extends MongoRepository<ExamResult, String> {
    List<ExamResult> findByStudentId(String studentId);
}
