import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import useUserAuthStore from "../../stores/userAuthStore";
import UserProfileEdit from "./EditUserProfile";
import { Modal } from "react-bootstrap";

const UserProfile = () => {
    const { user } = useUserAuthStore();
    const { profileId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const fetchUserProfile = async (targetId) => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/users/getUserById/${targetId}`);
            setProfile(res.data.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching user profile:", err);
            setError("Failed to fetch user profile.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const targetId = profileId || user?.id;
        if (targetId) {
            fetchUserProfile(targetId);
        } else {
            setLoading(false);
            setError("User ID not found.");
        }
    }, [profileId, user?.id]);

    const handleEditClick = () => setShowEditModal(true);
    const handleCloseEditModal = () => setShowEditModal(false);

    const handleProfileUpdated = () => {
        const targetId = profileId || user?.id;
        if (targetId) {
            fetchUserProfile(targetId);
        }
        setShowEditModal(false);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
                <div className="spinner-border text-primary" role="status" />
                <span className="ms-2">Loading Profile...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-4 text-danger">
                <strong>{error}</strong>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center mt-4 text-danger">
                <strong>Profile not found.</strong>
            </div>
        );
    }

    return (
        <>
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center rounded-top-4">
                                <h3 className="mb-0">User Profile</h3>
                                {(!profileId || profileId === user?.id) && (
                                    <button
                                        className="btn btn-light btn-sm"
                                        onClick={handleEditClick}
                                    >
                                        <i className="bi bi-pencil-square me-1"></i> Edit
                                    </button>
                                )}
                            </div>
                            <div className="card-body p-4">
                                <ul className="list-group list-group-flush">
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <strong>Name:</strong>
                                        <span>{profile.firstName} {profile.lastName}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <strong>NIC Number:</strong>
                                        <span>{profile.nic_number}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <strong>Phone:</strong>
                                        <span>{profile.phone}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <strong>Email:</strong>
                                        <span>{profile.email}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <strong>Role:</strong>
                                        <span className="badge bg-secondary text-uppercase">{profile.role}</span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <strong>Account Completed:</strong>
                                        <span className={`badge ${profile.isAccountCompleted ? "bg-success" : "bg-warning text-dark"}`}>
                                            {profile.isAccountCompleted ? "Yes" : "No"}
                                        </span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        <strong>Active:</strong>
                                        <span className={`badge ${profile.isActive ? "bg-success" : "bg-danger"}`}>
                                            {profile.isActive ? "Yes" : "No"}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal
                show={showEditModal}
                onHide={handleCloseEditModal}
                size="lg"
                centered
                backdrop="static"
            >
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {profile && (
                        <UserProfileEdit
                            id={profileId || user?.id}
                            onClose={handleCloseEditModal}
                            onUpdate={handleProfileUpdated}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default UserProfile;
