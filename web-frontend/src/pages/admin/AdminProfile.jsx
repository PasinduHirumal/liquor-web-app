import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { format } from "date-fns";
import { FaUserCircle } from "react-icons/fa";

const AdminProfile = () => {
    const { id } = useParams();
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAdminDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axiosInstance.get(`/admin/getById/${id}`);

            if (!data?.data) {
                throw new Error("Admin data not found in response");
            }

            setAdmin(data.data);
        } catch (error) {
            console.error("Error fetching admin:", error);
            setError(error?.response?.data?.message || "Failed to fetch admin details");
            toast.error(error?.response?.data?.message || "Failed to fetch admin details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminDetails();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), "MMMM dd, yyyy");
        } catch {
            return "Invalid date";
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case "super_admin":
                return "bg-danger";
            case "admin":
                return "bg-primary";
            case "pending":
                return "bg-warning text-dark";
            default:
                return "bg-secondary";
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <span className="ms-2">Loading admin details...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center">
                    {error}
                    <button
                        className="btn btn-sm btn-outline-danger ms-3"
                        onClick={fetchAdminDetails}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!admin) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning text-center">
                    Admin not found
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="row justify-content-center">
                <div className="col-md-10 col-lg-8">
                    <div className="card shadow-sm border-0 rounded-3">
                        <div className="card-header bg-dark text-white rounded-top-3 py-3">
                            <h3 className="mb-0 text-center">Admin Profile</h3>
                        </div>
                        <div className="card-body p-4">
                            <div className="d-flex flex-column flex-md-row align-items-center mb-4">
                                <div className="mb-3 mb-md-0 me-md-4">
                                    <div className="bg-light rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: "100px", height: "100px" }}>
                                        <FaUserCircle size={60} color="#0d6efd" />
                                    </div>
                                </div>
                                <div className="text-center text-md-start">
                                    <h2 className="mb-1">{admin.firstName} {admin.lastName}</h2>
                                    <span className={`badge ${getRoleBadgeClass(admin.role)} fs-6`}>
                                        {admin.role?.replace(/_/g, ' ').toUpperCase()}
                                    </span>
                                    {admin.isActive === false && (
                                        <span className="badge bg-dark ms-2 fs-6">INACTIVE</span>
                                    )}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card mb-3">
                                        <div className="card-header bg-light">Personal Information</div>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                <strong>Admin ID:</strong>
                                                <span className="text-muted font-monospace">{admin.id}</span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                <strong>Email:</strong>
                                                <span>{admin.email || "N/A"}</span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                <strong>Phone:</strong>
                                                <span>{admin.phone || "N/A"}</span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                <strong>Date of Birth:</strong>
                                                <span>{formatDate(admin.dateOfBirth)}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="card mb-3">
                                        <div className="card-header bg-light">Account Information</div>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                <strong>Status:</strong>
                                                <span>
                                                    {admin.isActive ? (
                                                        <span className="badge bg-success">Active</span>
                                                    ) : (
                                                        <span className="badge bg-secondary">Inactive</span>
                                                    )}
                                                </span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                <strong>Admin Approval:</strong>
                                                <span>
                                                    {admin.isAdminAccepted ? (
                                                        <span className="badge bg-success">Approved</span>
                                                    ) : (
                                                        <span className="badge bg-warning text-dark">Pending</span>
                                                    )}
                                                </span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                <strong>Email Verified:</strong>
                                                <span>
                                                    {admin.isAccountVerified ? (
                                                        <span className="badge bg-success">Verified</span>
                                                    ) : (
                                                        <span className="badge bg-warning text-dark">Unverified</span>
                                                    )}
                                                </span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                <strong>Warehouse:</strong>
                                                <span>{admin.where_house_id?.name}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;