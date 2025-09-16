import { useState, useEffect, useRef } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

function ResetPassword() {
    const [step, setStep] = useState(1); // 1 = request OTP, 2 = verify + reset
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0); // seconds remaining
    const timerRef = useRef(null);

    useEffect(() => {
        if (timer > 0) {
            timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
        }
        return () => clearTimeout(timerRef.current);
    }, [timer]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Email is required");

        try {
            setLoading(true);
            const res = await axiosInstance.post("/verify/sendResetOtp", { email });
            toast.success(res.data.message);
            setStep(2);
            setTimer(150); // 2 minutes 30 seconds
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!email || !otp || !newPassword) {
            return toast.error("All fields are required");
        }

        try {
            setLoading(true);
            const res = await axiosInstance.post("/verify/resetPassword", {
                email,
                otp,
                newPassword,
            });
            toast.success(res.data.message);
            setStep(1);
            setEmail("");
            setOtp("");
            setNewPassword("");
            setTimer(0);
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
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
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
                        
                        <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={timer > 0}
                            className={`w-full mb-2 ${timer > 0 ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                                } text-white font-medium py-2 rounded transition`}
                        >
                            {timer > 0 ? `Resend OTP (${formatTimer(timer)})` : "Resend OTP"}
                        </button>

                        <div>
                            <label className="block text-gray-600 font-medium mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
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
