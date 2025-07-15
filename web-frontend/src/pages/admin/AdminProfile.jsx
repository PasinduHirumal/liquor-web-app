import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const AdminProfile = () => {
    const { id } = useParams();
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAdminDetails = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/admin/getById/${id}`);
            setAdmin(res.data.data || null);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching admin:", error);
            toast.error(error?.response?.data?.message || "Failed to fetch admin details");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminDetails();
    }, [id]);

    if (loading)
        return (
            <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
                <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
                <span className="ms-2">Loading...</span>
            </div>
        );

    if (!admin)
        return (
            <div className="alert alert-danger text-center mt-5 pt-5" role="alert">
                Admin not found
            </div>
        );

    const formattedDOB = admin.dateOfBirth
        ? new Date(admin.dateOfBirth).toLocaleDateString()
        : "N/A";

    return (
        <div className="container mt-5 pt-5">
            <div className="card shadow-sm mx-auto" style={{ maxWidth: "450px" }}>
                <div className="card-body text-center">
                    {/* Profile icon placeholder */}
                    <div className="mb-3">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="72"
                            height="72"
                            fill="#0d6efd"
                            className="bi bi-person-circle"
                            viewBox="0 0 16 16"
                        >
                            <path d="M13.468 12.37C12.758 11.226 11.474 10.5 10 10.5c-1.474 0-2.758.726-3.468 1.87A6.987 6.987 0 0 1 8 15a6.987 6.987 0 0 1 5.468-2.63z" />
                            <path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            <path fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z" />
                        </svg>
                    </div>
                    <h3 className="card-title mb-3">
                        {admin.firstName} {admin.lastName}
                    </h3>
                    <ul className="list-group list-group-flush text-start">
                        <li className="list-group-item">
                            <strong>ID:</strong> {admin._id || admin.id}
                        </li>
                        <li className="list-group-item">
                            <strong>Email:</strong> {admin.email}
                        </li>
                        <li className="list-group-item">
                            <strong>Phone:</strong> {admin.phone || "N/A"}
                        </li>
                        <li className="list-group-item">
                            <strong>NIC:</strong> {admin.nic_number || "N/A"}
                        </li>
                        <li className="list-group-item">
                            <strong>Date of Birth:</strong> {formattedDOB}
                        </li>
                        <li className="list-group-item">
                            <strong>Role:</strong> {admin.role}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
