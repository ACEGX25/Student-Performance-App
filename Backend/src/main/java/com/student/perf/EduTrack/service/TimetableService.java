package com.student.perf.EduTrack.service;

import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

@Service
public class TimetableService {

    private final GridFSBucket gridFSBucket;

    @Autowired
    public TimetableService(MongoDatabaseFactory mongoDatabaseFactory) {
        this.gridFSBucket = GridFSBuckets.create(mongoDatabaseFactory.getMongoDatabase());
    }

    // Upload timetable image with metadata (semester, department, uploadedBy)
    public String uploadTimetableImage(MultipartFile file, String semester, String department) {
        try {
            // Validate file size (5 MB limit)
            if (file.getSize() > 5 * 1024 * 1024) {
                throw new IOException("File size exceeds the limit of 5MB");
            }

            // Validate file type (only images allowed - JPEG, PNG)
            String contentType = file.getContentType();
            if (!contentType.equals("image/jpeg") && !contentType.equals("image/png")) {
                throw new IOException("Only JPEG and PNG files are allowed");
            }

            // Proceed with uploading the image to GridFS with metadata
            try (InputStream inputStream = file.getInputStream()) {
                GridFSUploadOptions options = new GridFSUploadOptions()
                        .metadata(new Document("contentType", contentType)
                                .append("semester", semester)
                                .append("department", department));

                // Upload file and return the file ID
                ObjectId fileId = gridFSBucket.uploadFromStream(file.getOriginalFilename(), inputStream, options);
                return fileId.toHexString();
            }

        } catch (Exception e) {
            throw new RuntimeException("Error uploading timetable image: " + e.getMessage(), e);
        }
    }

    // Method to retrieve the timetable image from GridFS
    public InputStream getTimetableImage(String fileId) throws IOException {
        ObjectId objectId = new ObjectId(fileId);
        return gridFSBucket.openDownloadStream(objectId);
    }

    // Delete timetable image
    public void deleteTimetableImage(String fileId) {
        gridFSBucket.delete(new ObjectId(fileId));
    }

    public Document getTimetableMetadata(String fileId) {
        ObjectId objectId = new ObjectId(fileId);
        return gridFSBucket.find(new Document("_id", objectId))
                .first()
                .getMetadata();
    }



}



