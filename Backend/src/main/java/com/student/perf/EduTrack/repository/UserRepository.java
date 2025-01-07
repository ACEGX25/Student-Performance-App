package com.student.perf.EduTrack.repository;

import com.student.perf.EduTrack.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<Object> findByEmail(String email);
}
