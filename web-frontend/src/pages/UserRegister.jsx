import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        nic_number: "",
        dateOfBirth: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email && !formData.phone) {
            toast.error("Email or phone is required");
            return;
        }

        try {
            setLoading(true);
            const res = await axiosInstance.post("/auth/user/register", formData);
            toast.success(res.data.message || "Registration successful");
            navigate("/login");
        } catch (error) {
            const errMsg = error?.response?.data?.message || "Registration failed";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container d-flex justify-content-center align-items-center">
            <div className="card shadow p-4 register-card">
                <h3 className="mb-4 text-center text-primary">📝 User Registration</h3>

                <form onSubmit={handleSubmit} autoComplete="on">
                    {/* First and Last Name */}
                    <div className="row mb-3">
                        <div className="col-md-6 mb-3 mb-md-0">
                            <label className="form-label">First Name <span className="text-danger">*</span></label>
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
                            <label className="form-label">Last Name <span className="text-danger">*</span></label>
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
                            placeholder="you@example.com"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className="mb-3">
                        <label className="form-label">Phone <span className="text-danger">*</span></label>
                        <input
                            type="tel"
                            name="phone"
                            className="form-control"
                            placeholder="+947XXXXXXXX"
                            value={formData.phone}
                            onChange={handleChange}
                            pattern="^\+?\d{7,15}$"
                            title="Phone number must include country code"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                        <label className="form-label">Password <span className="text-danger">*</span></label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Enter a strong password"
                            value={formData.password}
                            onChange={handleChange}
                            minLength={6}
                            required
                        />
                    </div>

                    {/* NIC Number */}
                    <div className="mb-3">
                        <label className="form-label">NIC Number <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            name="nic_number"
                            className="form-control"
                            placeholder="Enter 12-digit NIC number"
                            value={formData.nic_number}
                            onChange={handleChange}
                            pattern="^[0-9]{12}$"
                            title="NIC should be 12 digits"
                            required
                        />
                    </div>

                    {/* Date of Birth */}
                    <div className="mb-3">
                        <label className="form-label">Date of Birth <span className="text-danger">*</span></label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            className="form-control"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

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
