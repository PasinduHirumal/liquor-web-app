import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import useUserAuthStore from "../../stores/userAuthStore";

const UserProfile = () => {
    const { user } = useUserAuthStore();
    const { profileId } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const targetId = profileId || user?.id;
                if (!targetId) {
                    setError("User ID not found.");
                    return;
                }

                const res = await axiosInstance.get(`/users/getUserById/${targetId}`);
                setProfile(res.data.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setError("Failed to fetch user profile.");
            } finally {
                setLoading(false);
            }
        };

        if (profileId || user?.id) {
            fetchUserProfile();
        }
    }, [profileId, user]);

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

    const isOwnProfile = user?.user_id === profile.id;

    return (
        <div className="container mt-5 pt-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center rounded-top-4">
                            <h3 className="mb-0">User Profile</h3>
                            {isOwnProfile && (
                                <button
                                    className="btn btn-light btn-sm"
                                    onClick={() => navigate(`/profile/edit/${profile.id}`)}
                                >
                                    Edit Profile
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
    );
};

export default UserProfile;
