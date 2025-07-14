import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const VerifyOtpPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email || localStorage.getItem("otpEmail");

    const [otp, setOtp] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        if (!email) {
            navigate("/register");
            return;
        }
        sendOtp();
    }, []);

    useEffect(() => {
        if (!timeLeft) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    const sendOtp = async () => {
        if (!email || loading) return;

        setLoading(true);
        try {
            const res = await axiosInstance.post("/verify/sendVerifyOtp", { email });

            setOtpSent(true);
            setTimeLeft(150);
            setOtp("");
            inputRef.current?.focus();

            toast.success(res.data.message || "OTP has been sent.");
        } catch (err) {
            console.error("Send OTP error:", err.response || err.message || err);
            toast.error(err.response?.data?.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axiosInstance.post("/verify/verifyEmail", { email, otp });

            toast.success(res.data.message || "Email verified successfully.");
            localStorage.removeItem("otpEmail");

            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || "Verification failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-4" style={{ maxWidth: 500, width: "100%" }}>
                <h4 className="text-center mb-3">🔐 Email Verification</h4>

                <p className="text-center text-muted">
                    A verification code will be sent to <strong>{email}</strong>
                </p>

                {loading && !otpSent && (
                    <div className="text-center my-2">
                        <div className="spinner-border text-primary" role="status" />
                        <p className="mt-2">Sending OTP...</p>
                    </div>
                )}

                {otpSent && (
                    <>
                        <form onSubmit={handleVerify} className="mt-4">
                            <div className="mb-3">
                                <label className="form-label">Enter OTP</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={otp}
                                    ref={inputRef}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d{0,6}$/.test(value)) setOtp(value);
                                    }}
                                    placeholder="Enter 6-digit code"
                                    maxLength="6"
                                    required
                                    autoFocus
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success w-100"
                                disabled={otp.length !== 6 || loading}
                            >
                                {loading ? "Verifying..." : "Verify"}
                            </button>
                        </form>

                        <div className="text-center mt-3">
                            {timeLeft > 0 ? (
                                <span>
                                    ⏱ Time remaining: <strong>{formatTime(timeLeft)}</strong>
                                </span>
                            ) : (
                                <div>
                                    Didn’t receive the code?{" "}
                                    <button
                                        className="btn btn-link p-0"
                                        onClick={sendOtp}
                                        disabled={loading}
                                    >
                                        {loading ? "Resending..." : "Resend OTP"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyOtpPage;
