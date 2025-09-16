import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const VerifyOtpPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email || localStorage.getItem("otpEmail");

    const [otp, setOtp] = useState(Array(6).fill(""));
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [sendError, setSendError] = useState(false);

    const inputRefs = useRef([]);

    const hasSentOtp = useRef(false);

    useEffect(() => {
        if (!email) {
            navigate("/register");
            return;
        }
        if (!hasSentOtp.current) {
            sendOtp();
            hasSentOtp.current = true;
        }
    }, [email, navigate]);

    useEffect(() => {
        if (!timeLeft) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
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
        setSendError(false);
        try {
            const res = await axiosInstance.post("/verify/sendVerifyOtp", { email });

            setOtpSent(true);
            setTimeLeft(150);
            setOtp(Array(6).fill(""));
            inputRefs.current[0]?.focus();

            toast.success(res.data.message || "OTP has been sent.");
        } catch (err) {
            console.error("Send OTP error:", err.response || err.message || err);
            setSendError(true);
            toast.error(err.response?.data?.message || "Failed to send OTP.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const otpCode = otp.join("");
        if (otpCode.length !== 6) return;

        setLoading(true);

        try {
            const res = await axiosInstance.post("/verify/verifyEmail", {
                email,
                otp: otpCode,
            });

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
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold text-center text-gray-800">
                    🔐 Email Verification
                </h2>
                <p className="text-center text-gray-600 mt-2">
                    A verification code has been sent to <br />
                    <span className="font-semibold">{email}</span>
                </p>

                {loading && !otpSent && (
                    <div className="flex flex-col items-center mt-4">
                        <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm text-gray-500 mt-2">Sending OTP...</p>
                    </div>
                )}

                {!otpSent && sendError && (
                    <div className="text-center mt-4">
                        <p className="text-red-500">Failed to send OTP.</p>
                        <button
                            onClick={sendOtp}
                            disabled={loading}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
                        >
                            {loading ? "Retrying..." : "Resend OTP"}
                        </button>
                    </div>
                )}

                {otpSent && (
                    <form onSubmit={handleVerify} className="mt-6 space-y-4">
                        {/* OTP boxes */}
                        <div className="flex justify-center gap-2">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(e.target.value, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-12 h-12 text-center text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={otp.join("").length !== 6 || loading}
                            className="w-full rounded py-2 bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300"
                        >
                            {loading ? "Verifying..." : "Verify"}
                        </button>

                        {/* Timer / resend */}
                        <div className="text-center text-sm mt-3">
                            {timeLeft > 0 ? (
                                <span>
                                    ⏱ Time remaining:{" "}
                                    <span className="font-semibold">{formatTime(timeLeft)}</span>
                                </span>
                            ) : (
                                <div>
                                    Didn’t receive the code?{" "}
                                    <button
                                        type="button"
                                        onClick={sendOtp}
                                        disabled={loading}
                                        className="text-blue-600 rounded hover:underline disabled:text-gray-400"
                                    >
                                        {loading ? "Resending..." : "Resend OTP"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default VerifyOtpPage;
