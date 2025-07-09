import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const navigate = useNavigate();

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

            const dataToSend = {
                password: formData.password
            };

            loginMethod === "email"
                ? (dataToSend.email = credential)
                : (dataToSend.phone = credential);

            const res = await axiosInstance.post("/auth/login", dataToSend);
            setResponse(res.data);

            // ✅ Redirect to homepage after a short delay
            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (err) {
            setError(
                err.response?.data?.message || "Network or server error. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div style={{ maxWidth: "420px", width: "100%" }}>
                <h3 className="mb-4 text-center">🔐 Admin Login</h3>

                {/* Tabs for selecting method */}
                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${loginMethod === "email" ? "active" : ""}`}
                            onClick={() => setLoginMethod("email")}
                        >
                            Email
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${loginMethod === "phone" ? "active" : ""}`}
                            onClick={() => setLoginMethod("phone")}
                        >
                            Phone
                        </button>
                    </li>
                </ul>

                {/* Form */}
                <form onSubmit={handleSubmit} autoComplete="on">
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
                                title="Phone number must include country code, e.g. +947XXXXXXXX"
                                autoFocus
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label">Password <span className="text-danger">*</span></label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Success Message */}
                {response && (
                    <div className="alert alert-success mt-3" role="alert">
                        ✅ {response.message} Redirecting...
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                        ❌ {error}
                    </div>
                )}

                {/* Register Prompt */}
                <div className="text-center mt-4">
                    <span>Don't have an account? </span>
                    <button
                        className="btn btn-link p-0 align-baseline"
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
