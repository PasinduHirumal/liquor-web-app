import React, { useState } from "react";
import axios from "axios";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: ""
    });

    const [response, setResponse] = useState(null);
    const [errors, setErrors] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setResponse(null);

        try {
            // Trim all string inputs before sending
            const payload = {
                email: formData.email.trim(),
                password: formData.password,
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                phone: formData.phone.trim(),
            };

            const res = await axios.post("http://localhost:5000/api/auth/register", payload);

            setResponse(res.data);
            // Optionally reset form: setFormData({ email: "", password: "", firstName: "", lastName: "", phone: "" });
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors([{ message: error.response?.data?.message || "Network or server error" }]);
            }
        }
    };

    return (
        <div className="container mt-4" style={{ maxWidth: "400px" }}>
            <h2>Admin Register</h2>
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
                    <label className="form-label">Phone (e.g. +947XXXXXXXX) <span className="text-danger">*</span></label>
                    <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+947XXXXXXXX"
                        required
                        pattern="^\+\d{1,3}\d{4,14}$"
                        title="Phone number must include country code, e.g. +947XXXXXXXX"
                        autoComplete="tel"
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">Register</button>
            </form>

            {response && (
                <div className="alert alert-success mt-3" role="alert">
                    ✅ {response.message}
                </div>
            )}

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
        </div>
    );
};

export default RegisterForm;
