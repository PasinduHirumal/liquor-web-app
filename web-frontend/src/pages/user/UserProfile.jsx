import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import useUserAuthStore from "../../stores/userAuthStore";
import UserProfileEdit from "./EditUserProfile";

const USER_APP_URL = import.meta.env.VITE_USER_APP_DOWNLOAD_URL;

const UserProfile = () => {
    const { user } = useUserAuthStore();
    const { profileId } = useParams();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const targetId = profileId || user?.id;

    const formatDateOfBirth = (dob) => {
        if (!dob) return "-";

        if (typeof dob === "string") {
            const date = new Date(dob);
            return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
        }

        if (dob?._seconds) {
            const date = new Date(dob._seconds * 1000);
            return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
        }

        return "-";
    };

    const formatRole = (role) => {
        if (!role) return "-";
        return String(role).replace(/_/g, " ").toUpperCase();
    };

    const fetchUserProfile = useCallback(async () => {
        if (!targetId) {
            setError("User ID not found.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const res = await axiosInstance.get(`/users/getUserById/${targetId}`);
            setProfile(res?.data?.data || null);
        } catch (err) {
            console.error("Error fetching user profile:", err);
            setError(
                err?.response?.data?.message || "Failed to fetch user profile."
            );
            setProfile(null);
        } finally {
            setLoading(false);
        }
    }, [targetId]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    if (loading) {
        return (
            <div className="container py-5">
                <div className="d-flex flex-column justify-content-center align-items-center text-center py-5">
                    <div
                        className="spinner-border text-primary mb-3"
                        style={{ width: "3rem", height: "3rem" }}
                        role="status"
                    />
                    <h5 className="mb-1 fw-semibold text-dark">Loading Profile...</h5>
                    <p className="text-muted mb-0">Please wait a moment</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="alert alert-danger shadow-sm border-0 rounded-4 text-center py-4">
                            <h5 className="fw-bold mb-2">Something went wrong</h5>
                            <p className="mb-0">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="alert alert-warning shadow-sm border-0 rounded-4 text-center py-4">
                            <h5 className="fw-bold mb-2">Profile not found</h5>
                            <p className="mb-0">The requested user profile could not be loaded.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-xl-9 col-lg-10">
                        <div
                            className="card border-0 shadow-lg rounded-4 overflow-hidden"
                        >
                            {/* Top Banner */}
                            <div
                                className="position-relative bg-light"
                            >
                                <div className="position-relative p-4 p-md-5 text-dark">
                                    <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3">
                                        <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end gap-4">
                                            <img
                                                src={
                                                    profile.profilePicUrl ||
                                                    "https://via.placeholder.com/140x140.png?text=User"
                                                }
                                                alt={`${profile.firstName || "User"} profile`}
                                                className="rounded-circle border border-4 border-white shadow"
                                                style={{
                                                    width: "130px",
                                                    height: "130px",
                                                    objectFit: "cover",
                                                    backgroundColor: "#fff",
                                                }}
                                            />

                                            <div className="text-center text-md-start">
                                                <h2 className="fw-bold mb-1">
                                                    {profile.firstName} {profile.lastName}
                                                </h2>
                                                <p className="mb-2 opacity-75">{profile.email}</p>
                                                <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-2">
                                                    <span className="badge bg-primary text-white px-3 py-2 rounded-pill fw-semibold">
                                                        {formatRole(profile.role)}
                                                    </span>
                                                    <span
                                                        className={`badge px-3 py-2 rounded-pill fw-semibold ${profile.isActive
                                                            ? "bg-success"
                                                            : "bg-danger"
                                                            }`}
                                                    >
                                                        {profile.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                    <span
                                                        className={`badge px-3 py-2 rounded-pill fw-semibold ${profile.isAccountVerified
                                                            ? "bg-info text-dark"
                                                            : "bg-warning text-dark"
                                                            }`}
                                                    >
                                                        {profile.isAccountVerified
                                                            ? "Verified"
                                                            : "Not Verified"}
                                                    </span>
                                                </div>
                                                <button
                                                    className="btn btn-dark mt-3"
                                                    onClick={() => window.open(USER_APP_URL, "_blank")}
                                                >
                                                    Download App
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="card-body p-4 p-md-5">
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <div className="card border-0 shadow-sm rounded-4 h-100">
                                            <div className="card-body p-4">
                                                <h5 className="fw-bold mb-4 text-primary">
                                                    <i className="bi bi-person-lines-fill me-2"></i>
                                                    Personal Information
                                                </h5>

                                                <div className="d-flex justify-content-between py-2 border-bottom">
                                                    <span className="text-muted">Name</span>
                                                    <span className="fw-semibold">
                                                        {profile.firstName || "-"} {profile.lastName || "-"}
                                                    </span>
                                                </div>

                                                <div className="d-flex justify-content-between py-2 border-bottom">
                                                    <span className="text-muted">NIC Number</span>
                                                    <span className="fw-semibold">
                                                        {profile.nic_number || "-"}
                                                    </span>
                                                </div>

                                                <div className="d-flex justify-content-between py-2">
                                                    <span className="text-muted">Date of Birth</span>
                                                    <span className="fw-semibold">
                                                        {formatDateOfBirth(profile.dateOfBirth)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="card border-0 shadow-sm rounded-4 h-100">
                                            <div className="card-body p-4">
                                                <h5 className="fw-bold mb-4 text-primary">
                                                    <i className="bi bi-shield-check me-2"></i>
                                                    Account Information
                                                </h5>

                                                <div className="d-flex justify-content-between py-2 border-bottom">
                                                    <span className="text-muted">Email</span>
                                                    <span className="fw-semibold text-break text-end ms-3">
                                                        {profile.email || "-"}
                                                    </span>
                                                </div>

                                                <div className="d-flex justify-content-between py-2 border-bottom">
                                                    <span className="text-muted">Phone Number</span>
                                                    <span className="fw-semibold">
                                                        {profile.phoneNumber || "-"}
                                                    </span>
                                                </div>

                                                <div className="d-flex justify-content-between py-2 border-bottom">
                                                    <span className="text-muted">Account Completed</span>
                                                    <span
                                                        className={`badge ${profile.isAccountCompleted
                                                            ? "bg-success"
                                                            : "bg-warning text-dark"
                                                            }`}
                                                    >
                                                        {profile.isAccountCompleted ? "Yes" : "No"}
                                                    </span>
                                                </div>

                                                <div className="d-flex justify-content-between py-2 border-bottom">
                                                    <span className="text-muted">Enterprise Member</span>
                                                    <span
                                                        className={`badge ${profile.isEnterpriseMember
                                                            ? "bg-primary"
                                                            : "bg-secondary"
                                                            }`}
                                                    >
                                                        {profile.isEnterpriseMember ? "Yes" : "No"}
                                                    </span>
                                                </div>

                                                <div className="d-flex justify-content-between py-2">
                                                    <span className="text-muted">Pending Membership</span>
                                                    <span
                                                        className={`badge ${profile.havePendingMembership
                                                            ? "bg-warning text-dark"
                                                            : "bg-success"
                                                            }`}
                                                    >
                                                        {profile.havePendingMembership ? "Yes" : "No"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserProfile;