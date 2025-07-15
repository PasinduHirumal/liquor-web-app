import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const UserProfileEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        nic_number: "",
        dateOfBirth: "",
        addresses: [""],
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`/users/getUserById/${id}`);
                if (res.data.success) {
                    const user = res.data.data;

                    setFormData({
                        email: user.email || "",
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        phone: user.phone || "",
                        nic_number: user.nic_number || "",
                        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
                        addresses: user.addresses && user.addresses.length > 0 ? user.addresses : [""],
                    });
                } else {
                    toast.error("Failed to load user data.");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error loading user data.");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    const handleChange = (e, index) => {
        const { name, value } = e.target;

        if (name === "addresses") {
            const newAddresses = [...formData.addresses];
            newAddresses[index] = value;
            setFormData((prev) => ({ ...prev, addresses: newAddresses }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const addAddress = () => {
        setFormData((prev) => ({ ...prev, addresses: [...prev.addresses, ""] }));
    };

    const removeAddress = (index) => {
        const newAddresses = formData.addresses.filter((_, i) => i !== index);
        setFormData((prev) => ({ ...prev, addresses: newAddresses.length > 0 ? newAddresses : [""] }));
    };

    const validateForm = () => {
        if (!formData.email) {
            toast.error("Email is required");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            toast.error("Email is invalid");
            return false;
        }
        if (!formData.firstName) {
            toast.error("First name is required");
            return false;
        }
        if (!formData.lastName) {
            toast.error("Last name is required");
            return false;
        }
        if (!formData.phone) {
            toast.error("Phone is required");
            return false;
        }
        if (!formData.nic_number || formData.nic_number.length !== 12) {
            toast.error("NIC number must be 12 characters");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setSubmitting(true);
            const res = await axiosInstance.patch(`/users/update/${id}`, formData);
            if (res.data.success) {
                toast.success("Profile updated successfully!");
                navigate(-1);
            } else {
                toast.error(res.data.message || "Update failed");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Server error");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
                <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
                <span className="ms-2 fs-5">Loading profile...</span>
            </div>
        );
    }

    return (
        <div className="container mt-5 pt-4">
            <div className="row justify-content-center">
                <div className="col-lg-7 col-md-9">
                    <div className="card shadow-lg rounded-4 border-0">
                        <div className="card-header bg-primary text-white text-center rounded-top-4 py-3">
                            <h2 className="mb-0">Edit Profile</h2>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="form-label fw-semibold">
                                        Email (cannot be changed)
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        disabled
                                    />
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label htmlFor="firstName" className="form-label fw-semibold">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="lastName" className="form-label fw-semibold">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6">
                                        <label htmlFor="phone" className="form-label fw-semibold">
                                            Phone *
                                        </label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="+1234567890"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="nic_number" className="form-label fw-semibold">
                                            NIC Number *
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nic_number"
                                            name="nic_number"
                                            value={formData.nic_number}
                                            onChange={handleChange}
                                            required
                                            maxLength={12}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="dateOfBirth" className="form-label fw-semibold">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">Addresses</label>
                                    {formData.addresses.map((addr, idx) => (
                                        <div key={idx} className="input-group mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="addresses"
                                                value={addr}
                                                onChange={(e) => handleChange(e, idx)}
                                                maxLength={350}
                                                placeholder={`Address #${idx + 1}`}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => removeAddress(idx)}
                                                disabled={formData.addresses.length <= 1}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={addAddress}
                                    >
                                        + Add Address
                                    </button>
                                </div>

                                <div className="d-grid">
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfileEdit;
