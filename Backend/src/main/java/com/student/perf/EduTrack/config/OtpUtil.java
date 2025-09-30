package com.student.perf.EduTrack.config;

import java.security.SecureRandom;
import java.time.LocalDateTime;

public class OtpUtil {
    private static final SecureRandom random = new SecureRandom();

    public static String generateOtp() {
        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
        return String.valueOf(otp);
    }
}
