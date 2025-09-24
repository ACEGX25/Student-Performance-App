package com.student.perf.EduTrack.service;

import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import com.student.perf.EduTrack.model.Assignment;
import com.student.perf.EduTrack.repository.AssignmentRepository;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Service
public class AssignmentService {

    private final GridFSBucket gridFSBucket;
    private final GridFsTemplate gridFsTemplate;
    private final AssignmentRepository assignmentRepository;

    @Autowired
    public AssignmentService(MongoDatabaseFactory mongoDatabaseFactory,
                             GridFsTemplate gridFsTemplate,
                             AssignmentRepository assignmentRepository) {
        this.gridFSBucket = GridFSBuckets.create(mongoDatabaseFactory.getMongoDatabase());
        this.gridFsTemplate = gridFsTemplate;
        this.assignmentRepository = assignmentRepository;
    }

    // Upload assignment with additional metadata (subject, description, dueDate)
    public String uploadAssignment(MultipartFile file, String subject, String description, String dueDate) {
        try {
            // Validate file size (10 MB limit)
            if (file.getSize() > 10 * 1024 * 1024) {
                throw new IOException("File size exceeds the limit of 10MB");
            }

            // Validate file type (only PDFs allowed)
            if (!"application/pdf".equals(file.getContentType())) {
                throw new IOException("Only PDF files are allowed");
            }

            // Proceed with uploading the file to GridFS with metadata
            try (InputStream inputStream = file.getInputStream()) {
                GridFSUploadOptions options = new GridFSUploadOptions()
                        .metadata(new Document("contentType", file.getContentType())
                                .append("subject", subject)
                                .append("description", description)
                                .append("dueDate", dueDate));

                // Upload file to GridFS
                ObjectId fileId = gridFSBucket.uploadFromStream(file.getOriginalFilename(), inputStream, options);

                // Save assignment metadata in "assignments" collection
                Assignment assignments = new Assignment();
                assignments.setSubject(subject);
                assignments.setDescription(description);
                assignments.setDueDate(dueDate);
                assignments.setFileId(fileId.toHexString());
                assignments.setCreatedAt(System.currentTimeMillis());
                // optional: if you want to track staff user: assignment.setUploadedBy(...)

                assignmentRepository.save(assignments);

                return fileId.toHexString();
            }

        } catch (Exception e) {
            throw new RuntimeException("Error uploading file: " + e.getMessage(), e);
        }
    }


    // Method to retrieve the file from GridFS
    public InputStream getFile(String fileId) throws IOException {
        ObjectId objectId = new ObjectId(fileId);
        return gridFSBucket.openDownloadStream(objectId);
    }

    // Delete Assignment
    public void deleteAssignment(String fileId) {
        gridFSBucket.delete(new ObjectId(fileId));
    }

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }
}
