import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState("email");
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        password: ""
    });

    const [response, setResponse] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
        setResponse(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResponse(null);

        const credential = loginMethod === "email" ? formData.email.trim() : formData.phone.trim();
        const credentialLabel = loginMethod === "email" ? "Email" : "Phone number";

        if (!credential) {
            setError(`${credentialLabel} is required.`);
            return;
        }

        if (!formData.password) {
            setError("Password is required.");
            return;
        }

        try {
            setLoading(true);
            const dataToSend = { password: formData.password };
            loginMethod === "email"
                ? (dataToSend.email = credential)
                : (dataToSend.phone = credential);

            const res = await axiosInstance.post("/auth/login", dataToSend);
            setResponse(res.data);

            setTimeout(() => navigate("/"), 1000);
        } catch (err) {
            setError(err.response?.data?.message || "Network or server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container d-flex align-items-center justify-content-center">
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
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label">Password <span className="text-danger">*</span></label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
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
                    </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Success */}
                {response && (
                    <div className="alert alert-success mt-3 animate__animated animate__fadeIn">
                        ✅ {response.message} Redirecting...
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="alert alert-danger mt-3 animate__animated animate__fadeIn">
                        ❌ {error}
                    </div>
                )}

                <div className="text-center mt-4">
                    Don't have an account?{" "}
                    <button
                        className="btn btn-link p-0 text-decoration-none"
                        onClick={() => navigate("/register")}
                    >
                        Register here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
