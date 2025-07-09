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
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setResponse(null);

        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", formData);
            setResponse(res.data);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors([{ message: error.response?.data?.message || "Something went wrong" }]);
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Admin Register</h2>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password (min 6 chars)</label>
                    <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        minLength="6"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Phone (e.g. +947XXXXXXXX)</label>
                    <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+947XXXXXXXX"
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Register</button>
            </form>

            {response && (
                <div className="alert alert-success mt-3">
                    ✅ {response.message}
                </div>
            )}

            {errors.length > 0 && (
                <div className="alert alert-danger mt-3">
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
