package com.student.perf.EduTrack.repository;

import com.student.perf.EduTrack.model.Assignment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AssignmentRepository extends MongoRepository<Assignment, String> {
    // Add custom queries later if needed
}
