package com.student.perf.EduTrack.repository;

import com.student.perf.EduTrack.model.Staff;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;


import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface StaffRepository extends MongoRepository<Staff, String> {
    Optional<Staff> findByUsername(String username);

    // Text search for staff using MongoDB's full-text search capabilities
//    @Query("{ '$text': { '$search': ?0 } }")
//    List<Map<String, Object>> searchByQuery(String query);

    // Search staff by name, ID, or department
    @Query("{ '$or': [ {'name': ?0}, {'staffId': ?0}, {'department': ?0} ] }")
    List<Staff> findByNameOrIdOrDepartment(String query);

}