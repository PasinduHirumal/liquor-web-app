import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const VerifyOtpPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || localStorage.getItem("otpEmail");

    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(0); // Start with 0
    const [resending, setResending] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    // Redirect if email is missing
    useEffect(() => {
        if (!email) {
            navigate("/register");
        }
    }, [email, navigate]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft === 0) return;
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
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    const sendOtp = async () => {
        setMessage("");
        setError("");
        setResending(true);

        try {
            await axiosInstance.post("/verify/sendVerifyOtp", { email });
            setOtpSent(true);
            setTimeLeft(150); // Start timer
            setMessage("OTP has been sent to your email.");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send OTP.");
        } finally {
            setResending(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        try {
            const res = await axiosInstance.post("/verify/verifyEmail", { email, otp });
            setMessage(res.data.message);
            localStorage.removeItem("otpEmail");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Verification failed.");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ maxWidth: 500, width: "100%" }}>
                <h4 className="text-center mb-3">🔐 Email Verification</h4>

                {/* Email Display */}
                <p className="text-center text-muted">
                    To verify your identity, we will send a code to <strong>{email}</strong>.
                </p>

                {/* Send OTP Section */}
                {!otpSent && (
                    <div className="text-center">
                        <button className="btn btn-primary" onClick={sendOtp} disabled={resending}>
                            {resending ? "Sending..." : "Send OTP"}
                        </button>
                    </div>
                )}

                {/* OTP Form */}
                {otpSent && (
                    <>
                        <form onSubmit={handleVerify} className="mt-4">
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

                        {/* Timer */}
                        <div className="text-center mt-3">
                            {timeLeft > 0 ? (
                                <>
                                    Time remaining: <strong>{formatTime(timeLeft)}</strong>
                                </>
                            ) : (
                                <div>
                                    Didn't receive the code?{" "}
                                    <button className="btn btn-link p-0" onClick={sendOtp}>
                                        Resend OTP
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Messages */}
                {message && <div className="alert alert-success mt-3">{message}</div>}
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </div>
        </div>
    );
};

export default VerifyOtpPage;
