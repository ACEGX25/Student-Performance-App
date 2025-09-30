package com.student.perf.EduTrack.service;

import com.student.perf.EduTrack.config.OtpUtil;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private final Map<String, String> otpCache = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> lastRequested = new ConcurrentHashMap<>();
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    // Generate OTP with 5 min expiry
    public String generateOtp(String email) {
        // Check 1 min cooldown
        LocalDateTime lastTime = lastRequested.get(email);
        if (lastTime != null && lastTime.plusMinutes(1).isAfter(LocalDateTime.now())) {
            throw new RuntimeException("OTP requested too frequently. Please wait 1 minute.");
        }

        String otp = OtpUtil.generateOtp();
        otpCache.put(email, otp);
        lastRequested.put(email, LocalDateTime.now());

        // Schedule removal of OTP after 5 min
        scheduler.schedule(() -> otpCache.remove(email), 5, TimeUnit.MINUTES);

        return otp;
    }

    public boolean verifyOtp(String email, String otp) {
        String cachedOtp = otpCache.get(email);
        if (cachedOtp != null && cachedOtp.equals(otp)) {
            otpCache.remove(email);
            return true;
        }
        return false;
    }

    public String getOtp(String email) {
        return otpCache.get(email);
    }
}
