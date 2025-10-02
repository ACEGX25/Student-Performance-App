package com.student.perf.EduTrack.service;

import com.student.perf.EduTrack.model.DTOs.StudentSumm;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class SubjectService {

    private final MongoTemplate mongoTemplate;

    public SubjectService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<StudentSumm> getStudentsForSubject(String subjectId) {
        // 1️⃣ Fetch the subject document
        Document subjectDoc = mongoTemplate.findById(subjectId, Document.class, "subjects");
        if (subjectDoc == null) return Collections.emptyList();

        boolean isShared = subjectDoc.getBoolean("shared", false);
        String sharedSubjectId = subjectDoc.getString("sharedSubId");

        Aggregation agg;
        if (isShared && sharedSubjectId != null) {
            // For shared subjects → fetch *all dept-specific subjects* with same sharedSubjectId
            agg = Aggregation.newAggregation(
                    Aggregation.match(Criteria.where("sharedSubId").is(sharedSubjectId)),
                    LookupOperation.newLookup()
                            .from("student-info")
                            .localField("_id")          // subject _id e.g. cs-1-chem
                            .foreignField("subjects")   // student-info.subjects array
                            .as("students"),
                    Aggregation.project("students")
            );
        } else {
            // For department-specific subjects → match by _id
            agg = Aggregation.newAggregation(
                    Aggregation.match(Criteria.where("_id").is(subjectId)),
                    LookupOperation.newLookup()
                            .from("student-info")
                            .localField("_id")
                            .foreignField("subjects")
                            .as("students"),
                    Aggregation.project("students")
            );
        }

        // 2️⃣ Run aggregation
        AggregationResults<Document> results =
                mongoTemplate.aggregate(agg, "subjects", Document.class);

        List<Document> allSubjects = results.getMappedResults();
        if (allSubjects.isEmpty()) return Collections.emptyList();

        // 3️⃣ Merge students across all matched subjects
        List<Document> studentDocs = allSubjects.stream()
                .flatMap(d -> ((List<Document>) d.get("students")).stream())
                .toList();

        // 4️⃣ Map to DTO
        return studentDocs.stream().map(d -> {
            StudentSumm s = new StudentSumm();
            s.setName(d.getString("name"));
            s.setDept(d.getString("department"));
            Object rollObj = d.get("rollno");
            s.setRollNo(rollObj != null ? rollObj.toString() : null);
            s.setEmail(d.getString("email"));
            return s;
        }).toList();
    }
}
