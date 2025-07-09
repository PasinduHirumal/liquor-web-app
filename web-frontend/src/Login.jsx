import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";

const LoginForm = () => {
    const [loginMethod, setLoginMethod] = useState("email"); // "email" or "phone"
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

        if (loginMethod === "email" && !formData.email.trim()) {
            setError("Email is required.");
            return;
        }

        if (loginMethod === "phone" && !formData.phone.trim()) {
            setError("Phone number is required.");
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

            if (loginMethod === "email") {
                dataToSend.email = formData.email.trim();
            } else {
                dataToSend.phone = formData.phone.trim();
            }

            const res = await axiosInstance.post("/auth/login", dataToSend);
            setResponse(res.data);
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
            <div style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="mb-4 text-center">🔐 Admin Login</h3>

                <div className="mb-3">
                    <label className="form-label">Login Method</label>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="loginMethod"
                            id="emailRadio"
                            value="email"
                            checked={loginMethod === "email"}
                            onChange={() => setLoginMethod("email")}
                        />
                        <label className="form-check-label" htmlFor="emailRadio">
                            Email
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="radio"
                            name="loginMethod"
                            id="phoneRadio"
                            value="phone"
                            checked={loginMethod === "phone"}
                            onChange={() => setLoginMethod("phone")}
                        />
                        <label className="form-check-label" htmlFor="phoneRadio">
                            Phone
                        </label>
                    </div>
                </div>

                <form onSubmit={handleSubmit} autoComplete="on">
                    {loginMethod === "email" && (
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
                    )}

                    {loginMethod === "phone" && (
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
                        <label className="form-label">
                            Password <span className="text-danger">*</span>
                        </label>
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

                {response && (
                    <div className="alert alert-success mt-3" role="alert">
                        ✅ {response.message}
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                        ❌ {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginForm;
