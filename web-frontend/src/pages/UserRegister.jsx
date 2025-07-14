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
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Optional: client-side validation
        if (!formData.email && !formData.phone) {
            toast.error("Email or phone is required");
            return;
        }

        try {
            setLoading(true);
            const res = await axiosInstance.post("/auth/user/register", formData);
            toast.success(res.data.message);
            navigate("/login");
        } catch (error) {
            const errMsg = error?.response?.data?.message || "Registration failed";
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white">
            <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className="w-1/2 border px-3 py-2 rounded"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        className="w-1/2 border px-3 py-2 rounded"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full border px-3 py-2 rounded"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone (+XXXXXXXXXXX)"
                    className="w-full border px-3 py-2 rounded"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full border px-3 py-2 rounded"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="nic_number"
                    placeholder="NIC Number (12 chars)"
                    className="w-full border px-3 py-2 rounded"
                    value={formData.nic_number}
                    onChange={handleChange}
                    required
                />

                <input
                    type="date"
                    name="dateOfBirth"
                    className="w-full border px-3 py-2 rounded"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
