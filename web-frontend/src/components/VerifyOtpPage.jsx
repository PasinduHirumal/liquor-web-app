import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const VerifyOtpPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get email from route state or localStorage fallback
    const email = location.state?.email || localStorage.getItem("otpEmail");

    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(150); // 2 mins 30 secs
    const [resending, setResending] = useState(false);

    useEffect(() => {
        // Redirect back to registration if no email found
        if (!email) {
            navigate("/register");
        }
    }, [email, navigate]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const res = await axiosInstance.post("/verify/verifyEmail", { email, otp });
            setMessage(res.data.message);

            // Clear stored email on success
            localStorage.removeItem("otpEmail");

            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Verification failed");
        }
    };

    const handleResend = async () => {
        setMessage("");
        setError("");
        setResending(true);

        try {
            await axiosInstance.post("/verify/sendVerifyOtp", { email });
            setMessage("OTP resent successfully.");
            setTimeLeft(150); // restart countdown
        } catch (err) {
            setError(err.response?.data?.message || "Failed to resend OTP.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ maxWidth: 500, width: "100%" }}>
                <h4 className="text-center mb-3">🔐 Email Verification</h4>

                {/* Description & Email Display */}
                <p className="text-center text-muted mb-3">
                    We've sent a 6-digit verification code to <strong>{email}</strong>. Please check your inbox and enter the OTP below.
                </p>

                <form onSubmit={handleVerify}>
                    <div className="mb-3">
                        <label className="form-label">Enter OTP</label>
                        <input
                            type="text"
                            className="form-control"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit code"
                            maxLength="6"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100">Verify</button>
                </form>

                {/* Time Remaining */}
                <div className="text-center mt-3">
                    Time remaining: <strong>{formatTime(timeLeft)}</strong>
                </div>

                {/* Resend OTP Button */}
                <div className="text-center mt-3">
                    Didn’t get the code?{" "}
                    <button
                        className="btn btn-link p-0"
                        onClick={handleResend}
                        disabled={timeLeft > 0 || resending}
                    >
                        {resending ? "Sending..." : "Resend OTP"}
                    </button>
                </div>

                {/* Messages */}
                {message && <div className="alert alert-success mt-3">{message}</div>}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
        </div>
    );
};

export default VerifyOtpPage;
