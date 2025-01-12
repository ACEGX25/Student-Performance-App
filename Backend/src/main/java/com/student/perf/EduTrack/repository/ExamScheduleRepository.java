package com.student.perf.EduTrack.repository;

import com.student.perf.EduTrack.model.ExamSchedule;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ExamScheduleRepository extends MongoRepository<ExamSchedule, String> {
    List<ExamSchedule> findByDepartmentAndSemester(String department, int semester);
}
