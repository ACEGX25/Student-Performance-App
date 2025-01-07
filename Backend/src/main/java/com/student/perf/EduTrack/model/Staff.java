package com.student.perf.EduTrack.model;


import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "staff")
public class Staff extends User {

    private String department;
    private String expertise;
    private int experience;
    private String qualification;
    private String designation;
    private String area_of_interest;
    private String address;
    private Date date_of_birth;
    private int sub_feedback;
}
