import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"; // import icons

function ResetPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const [infoMessage, setInfoMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false); // password toggle
    const timerRef = useRef(null);

    useEffect(() => {
        if (timer > 0) {
            timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
        }
        return () => clearTimeout(timerRef.current);
    }, [timer]);

    const handleSendOtp = async (e) => {
        e?.preventDefault();
        if (!email) return toast.error("Email is required");

        try {
            setLoading(true);
            const res = await axiosInstance.post("/verify/sendResetOtp", { email });
            toast.success(res.data.message || "OTP sent successfully!");
            setStep(2);
            setTimer(150);
            setInfoMessage("Check your email for the OTP.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!email || !otp || !newPassword) return toast.error("All fields are required");

        try {
            setLoading(true);
            const res = await axiosInstance.post("/verify/resetPassword", { email, otp, newPassword });
            toast.success(res.data.message || "Password reset successful!");
            setStep(1);
            setEmail("");
            setOtp("");
            setNewPassword("");
            setTimer(0);
            setInfoMessage("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    const formatTimer = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Reset Password
                </h2>

                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div>
                            <label className="block text-gray-600 font-medium mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded transition disabled:opacity-50"
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded transition"
                        >
                            Back
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="mb-4">
                            <p className="text-gray-800 font-medium text-center">
                                <span className="font-semibold">Email Address:</span> {email}
                            </p>

                            {infoMessage && (
                                <p className="text-sm text-center text-blue-600 font-medium">{infoMessage}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-600 font-medium mb-1">
                                OTP Code
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>

                        {timer > 0 && (
                            <p className="text-sm text-gray-500">
                                OTP expires in: <span className="font-semibold">{formatTimer(timer)}</span>
                            </p>
                        )}

                        {timer === 0 && (
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="w-full mb-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded transition"
                            >
                                Resend OTP
                            </button>
                        )}

                        {/* Password field with toggle */}
                        <div className="relative">
                            <label className="block text-gray-600 font-medium mb-1">
                                New Password
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <div
                                className="absolute inset-y-12 right-3 flex items-center cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition disabled:opacity-50"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded transition"
                        >
                            Back
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;
