import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./OtpVerificationPage.css";

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  // Countdown timer for resend button
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // auto move to next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      setMessage("Please enter all 6 digits");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/auth/signup/verify-otp?email=${email}&otp=${otpCode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        //body: JSON.stringify({ email, otp: otpCode }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Invalid OTP");
      } else {
        setMessage("OTP verified successfully! Redirecting...");
        setTimeout(() => navigate("/authpage"), 2000);
      }
    } catch (err) {
      setMessage("Error verifying OTP: " + err.message);
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/signup/send-otp?email=${email}`,
        { method: "POST", credentials: "include" }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.message?.includes("frequently")) {
          setMessage("Please wait 1 minute before requesting a new OTP.");
          setResendTimer(60); // disable for 60s
        } else {
          setMessage(data.message || "Error resending OTP");
        }
      } else {
        setMessage("A new OTP has been sent to your email.");
        setResendTimer(60);
      }
    } catch (err) {
      setMessage("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="otp-page">
      <div className="otp-container">
        <h2 className="otp-title">Verify Your Email</h2>
        <p className="otp-subtitle">
          We’ve sent a 6-digit verification code to <b>{email}</b>
        </p>

        <form onSubmit={handleVerify} className="otp-form">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                className="otp-input"
              />
            ))}
          </div>

          <button type="submit" className="verify-button" disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <div className="resend-section">
          <button
            onClick={handleResend}
            className="resend-button"
            disabled={resendTimer > 0 || loading}
          >
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
          </button>
        </div>

        {message && <p className="otp-message">{message}</p>}
      </div>
    </div>
  );
};

export default OtpVerificationPage;
