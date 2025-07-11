import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const RegisterForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: ""
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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

            toast.success(res.data.message || "Registered successfully!");

            localStorage.setItem("otpEmail", payload.email);

            setTimeout(() => {
                navigate("/verify-otp", { state: { email: payload.email } });
            }, 1500);
        } catch (error) {
            if (error.response?.data?.errors) {
                error.response.data.errors.forEach(err => {
                    toast.error(`${err.field ? `${err.field}: ` : ""}${err.message}`);
                });
            } else {
                toast.error(error.response?.data?.message || "Network or server error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container d-flex justify-content-center align-items-center">
            <div className="card shadow p-4 register-card">
                <h3 className="mb-4 text-center text-primary">📝 Admin Registration</h3>

                <form onSubmit={handleSubmit} autoComplete="on">
                    {/* First Name & Last Name */}
                    <div className="row mb-3">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <label className="form-label">
                                First Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                className="form-control"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">
                                Last Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                className="form-control"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label">Email <span className="text-danger">*</span></label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password with toggle */}
                    <div className="mb-3">
                        <label className="form-label">Password (min 6 chars) <span className="text-danger">*</span></label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                                minLength="6"
                                required
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

                    {/* Phone */}
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
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                {/* Redirect to Login */}
                <div className="text-center mt-3">
                    Already have an account?{" "}
                    <button
                        className="btn btn-link p-0 text-decoration-none"
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