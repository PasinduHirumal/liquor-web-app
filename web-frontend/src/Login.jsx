import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        password: ""
    });

    const [response, setResponse] = useState(null);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResponse(null);

        if (!formData.email && !formData.phone) {
            setError("Please enter either an email or a phone number.");
            return;
        }

        try {
            // Prepare data only with filled fields
            const dataToSend = {};
            if (formData.email) dataToSend.email = formData.email.trim();
            if (formData.phone) dataToSend.phone = formData.phone.trim();
            dataToSend.password = formData.password;

            const res = await axiosInstance.post("/auth/login", dataToSend);

            setResponse(res.data);
        } catch (err) {
            setError(
                err.response?.data?.message || "Network or server error. Please try again."
            );
        }
    };

    return (
        <div className="container mt-4" style={{ maxWidth: "400px" }}>
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit} className="mt-3" autoComplete="on">
                <div className="mb-3">
                    <label className="form-label">Email (optional)</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Phone (optional)</label>
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
                    />
                </div>

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

                <button type="submit" className="btn btn-primary w-100">Login</button>
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
    );
};

export default LoginForm;
