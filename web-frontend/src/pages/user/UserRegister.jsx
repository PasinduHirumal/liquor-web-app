import React, { useMemo, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";

const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    nic_number: "",
    dateOfBirth: "",
    profilePicUrl: "",
};

const UserRegister = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [preview, setPreview] = useState("");

    const maxDob = useMemo(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 18);
        return d.toISOString().split("T")[0];
    }, []);

    const handleChange = ({ target: { name, value } }) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image");
            return;
        }

        try {
            const base64 = await fileToBase64(file);
            setFormData((prev) => ({ ...prev, profilePicUrl: base64 }));
            setPreview(base64);
        } catch {
            toast.error("Failed to read image");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim().toLowerCase(),
            phoneNumber: formData.phoneNumber.trim(),
            password: formData.password,
            nic_number: formData.nic_number.trim(),
            dateOfBirth: formData.dateOfBirth,
            profilePicUrl: formData.profilePicUrl,
        };

        if (
            !payload.firstName ||
            !payload.lastName ||
            !payload.email ||
            !payload.phoneNumber ||
            !payload.password ||
            !payload.nic_number ||
            !payload.dateOfBirth ||
            !payload.profilePicUrl
        ) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setLoading(true);

            const res = await axiosInstance.post("/auth/user/register", payload);

            toast.success(res?.data?.message || "Registration successful");
            navigate("/login");
        } catch (error) {
            const errors = error?.response?.data?.errors;
            const errMsg = error?.response?.data?.message || "Registration failed";

            if (Array.isArray(errors) && errors.length) {
                toast.error(errors[0]?.message || errMsg);
            } else {
                toast.error(errMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-white px-3">
            <div
                className="card shadow p-4 my-5"
                style={{ width: "100%", maxWidth: "520px", borderRadius: "16px" }}
            >
                <h3 className="mb-4 text-center text-primary">📝 User Registration</h3>

                <form onSubmit={handleSubmit} autoComplete="on">
                    <div className="mb-4 text-center">
                        <div className="mb-3">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Profile Preview"
                                    className="rounded-circle border"
                                    style={{ width: "90px", height: "90px", objectFit: "cover" }}
                                />
                            ) : (
                                <FaUserCircle size={90} className="text-secondary" />
                            )}
                        </div>

                        <label className="form-label d-block">
                            Profile Picture <span className="text-danger">*</span>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            onChange={handleImageChange}
                            required={!formData.profilePicUrl}
                        />
                    </div>

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
                                minLength={2}
                                maxLength={50}
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
                                minLength={2}
                                maxLength={50}
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Email <span className="text-danger">*</span>
                        </label>
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

                    <div className="mb-3">
                        <label className="form-label">
                            Phone Number <span className="text-danger">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            className="form-control"
                            placeholder="+94771234567"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            pattern="^\+\d{1,3}\d{4,14}$"
                            title="Phone number must include country code, e.g. +94771234567"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            Password <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="form-control"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={6}
                                maxLength={128}
                                required
                            />
                            <button
                                type="button"
                                className="btn border"
                                onClick={() => setShowPassword((prev) => !prev)}
                                tabIndex={-1}
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">
                            NIC Number <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            name="nic_number"
                            className="form-control"
                            placeholder="Enter 12-digit NIC number"
                            value={formData.nic_number}
                            onChange={handleChange}
                            pattern="^[0-9]{12}$"
                            title="NIC should be exactly 12 digits"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">
                            Date of Birth <span className="text-danger">*</span>
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            className="form-control"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            max={maxDob}
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
                        type="button"
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

export default UserRegister;