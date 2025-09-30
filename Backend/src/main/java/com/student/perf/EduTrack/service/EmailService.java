package com.student.perf.EduTrack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("edutrack.edu@gmail.com");
        message.setTo(to);
        message.setSubject("EduTrack - Email Verification OTP");
        message.setText("Your OTP is: " + otp + " (valid for 5 minutes).");
        mailSender.send(message);
    }
}
