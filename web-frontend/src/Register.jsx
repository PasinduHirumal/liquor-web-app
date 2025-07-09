import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const RegisterForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: ""
    });

    const [response, setResponse] = useState(null);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors([]);
        setResponse(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setResponse(null);
        setLoading(true);

        try {
            const payload = {
                email: formData.email.trim(),
                password: formData.password,
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                phone: formData.phone.trim()
            };

            const res = await axiosInstance.post("/auth/register", payload);
            setResponse(res.data);

            // Redirect to login page after short delay
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors([{ message: error.response?.data?.message || "Network or server error" }]);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div style={{ maxWidth: "400px", width: "100%" }}>
                <h3 className="mb-4 text-center">📝 Admin Registration</h3>

                <form onSubmit={handleSubmit} className="mt-3" autoComplete="on">
                    <div className="mb-3">
                        <label className="form-label">Email <span className="text-danger">*</span></label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password (min 6 chars) <span className="text-danger">*</span></label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            minLength="6"
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">First Name <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            name="firstName"
                            className="form-control"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            autoComplete="given-name"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Last Name <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            name="lastName"
                            className="form-control"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            autoComplete="family-name"
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Phone <span className="text-danger">*</span></label>
                        <input
                            type="tel"
                            name="phone"
                            className="form-control"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+947XXXXXXXX"
                            pattern="^\+\d{1,3}\d{4,14}$"
                            title="Phone number must include country code, e.g. +947XXXXXXXX"
                            required
                            autoComplete="tel"
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                {/* Success Message */}
                {response && (
                    <div className="alert alert-success mt-3" role="alert">
                        ✅ {response.message} Redirecting to login...
                    </div>
                )}

                {/* Error Messages */}
                {errors.length > 0 && (
                    <div className="alert alert-danger mt-3" role="alert">
                        <ul className="mb-0">
                            {errors.map((err, idx) => (
                                <li key={idx}>
                                    <strong>{err.field ? `${err.field}: ` : ""}</strong>{err.message}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Redirect to Login */}
                <div className="text-center mt-4">
                    Already have an account?{" "}
                    <button
                        className="btn btn-link p-0"
                        onClick={() => navigate("/login")}
                    >
                        Login here
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
