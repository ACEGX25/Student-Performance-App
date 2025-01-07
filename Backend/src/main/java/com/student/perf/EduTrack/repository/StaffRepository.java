package com.student.perf.EduTrack.repository;

import com.student.perf.EduTrack.model.Staff;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface StaffRepository extends MongoRepository<Staff, String> {
    Optional<Staff> findByUsername(String username);
}
