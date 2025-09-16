import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useAdminAuthStore from "../../stores/adminAuthStore";
import VerifyEmailEnterModel from "../../components/VerifyEmailEnterModel";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState("email");
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        password: ""
    });

    const login = useAdminAuthStore((state) => state.login);
    const loading = useAdminAuthStore((state) => state.loading);
    const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
    const resetError = useAdminAuthStore((state) => state.resetError);
    const error = useAdminAuthStore((state) => state.error);

    useEffect(() => {
        setFormData({ email: "", phone: "", password: "" });
        setShowPassword(false);
        resetError();
    }, [loginMethod]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        resetError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const credential = loginMethod === "email" ? formData.email.trim() : formData.phone.trim();
        const credentialLabel = loginMethod === "email" ? "Email" : "Phone number";

        if (!credential) {
            useAdminAuthStore.setState({ error: `${credentialLabel} is required.` });
            return;
        }

        if (!formData.password) {
            useAdminAuthStore.setState({ error: "Password is required." });
            return;
        }

        const dataToSend = {
            password: formData.password,
            ...(loginMethod === "email"
                ? { email: credential }
                : { phone: credential })
        };

        await login(dataToSend);
    };

    return (
        <div className="card p-4 shadow login-card">
            <h3 className="mb-4 text-center text-primary">🔐 Admin Login</h3>

            {/* Method Switch */}
            <div className="d-flex justify-content-center mb-3">
                <div className="btn-group gap-1" role="group" aria-label="Login Method Switch">
                    <button
                        type="button"
                        className={`btn ${loginMethod === "email" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setLoginMethod("email")}
                    >
                        Email
                    </button>
                    <button
                        type="button"
                        className={`btn ${loginMethod === "phone" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setLoginMethod("phone")}
                    >
                        Phone
                    </button>
                </div>
            </div>


            {/* Form */}
            <form onSubmit={handleSubmit}>
                {loginMethod === "email" ? (
                    <div className="mb-3">
                        <label className="form-label">Email <span className="text-danger">*</span></label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                            autoFocus
                        />
                        {/* Error Alert with Account not verified */}
                        {error && error.includes("Your account is not verified") && (
                            <div className="mt-2 d-flex justify-content-between align-items-center">
                                <span className="text-danger">Account not verified</span>
                                <button
                                    type="button"
                                    className="btn btn-link p-0 text-decoration-none ms-2"
                                    onClick={() => setShowVerifyModal(true)}
                                >
                                    Verify Now
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mb-3">
                        <label className="form-label">Phone <span className="text-danger">*</span></label>
                        <input
                            type="tel"
                            name="phone"
                            className="form-control"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+947XXXXXXXX"
                            autoComplete="tel"
                            pattern="^\+\d{1,3}\d{4,14}$"
                            title="Phone number must include country code"
                            autoFocus
                        />
                        {/* Error Alert with Account not verified */}
                        {error && error.includes("Your account is not verified") && (
                            <div className="mt-2 d-flex justify-content-between align-items-center">
                                <span className="text-danger">Account not verified</span>
                                <button
                                    type="button"
                                    className="btn btn-link p-0 text-decoration-none ms-2"
                                    onClick={() => setShowVerifyModal(true)}
                                >
                                    Verify Now
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label">Password <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="btn border"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* Error Alert with Forgot Password */}
                    {error && error.toLowerCase().includes("invalid credentials") && (
                        <div className="mt-2 d-flex justify-content-between align-items-center">
                            <span className="text-danger">Forgot password?</span>
                            <button
                                type="button"
                                className="btn btn-link p-0 text-decoration-none ms-2"
                                onClick={() => navigate("/reset-password")}
                            >
                                Click here
                            </button>
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <div className="text-center mt-4">
                Don't have an account?{" "}
                <button
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => navigate("/register")}
                >
                    Register here
                </button>
            </div>
            {/* Render Modal */}
            <VerifyEmailEnterModel
                show={showVerifyModal}
                onHide={() => setShowVerifyModal(false)}
            />
        </div>
    );
};

export default AdminLogin;
