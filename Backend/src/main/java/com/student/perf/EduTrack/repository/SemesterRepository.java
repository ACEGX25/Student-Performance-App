package com.student.perf.EduTrack.repository;

import com.student.perf.EduTrack.model.Semester;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SemesterRepository extends MongoRepository<Semester, String> {
    Optional<Semester> findByDepartmentAndSemester(String department, String semester);
}
