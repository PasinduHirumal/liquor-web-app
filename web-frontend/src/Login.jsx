import React, { useState } from "react";
import axios from "axios";

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
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setResponse(null);

        // At least one of email or phone must be filled
        if (!formData.email && !formData.phone) {
            setError("Please enter either an email or a phone number.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", formData, {
                withCredentials: true // important if server sets a cookie
            });
            setResponse(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="container mt-4">
            <h2>Admin Login</h2>
            <form onSubmit={handleSubmit} className="mt-3">

                <div className="mb-3">
                    <label className="form-label">Email (optional)</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
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
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Login</button>
            </form>

            {response && (
                <div className="alert alert-success mt-3">
                    ✅ {response.message}
                </div>
            )}

            {error && (
                <div className="alert alert-danger mt-3">
                    ❌ {error}
                </div>
            )}
        </div>
    );
};

export default LoginForm;
