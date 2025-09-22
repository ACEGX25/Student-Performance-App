package com.student.perf.EduTrack.repository;

import com.student.perf.EduTrack.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface StudentRepository extends MongoRepository<Student, String> {

    Optional<Student> findByUsername(String username);

//    // Text search for students using MongoDB's full-text search capabilities
//    @Query("{ '$text': { '$search': ?0 } }")
//    List<Map<String, Object>> searchByQuery(String query);

    // Search students by name, roll number, or department
    @Query("{ '$or': [ {'name': ?0}, {'rollno': ?0}, {'department': ?0} ] }")
    List<Map<String, Object>> findByNameOrRollNoOrDepartment(String query);
}
