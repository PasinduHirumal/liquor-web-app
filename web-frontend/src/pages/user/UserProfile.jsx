import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import useUserAuthStore from "../../stores/userAuthStore";

const UserProfile = () => {
    const { user } = useUserAuthStore();
    const { profileId } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axiosInstance.get(`/users/getUserById/${profileId || user?.id}`);
                setProfile(res.data.data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
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
                <div className="spinner-border text-primary" role="status"></div>
                <span className="ms-2">Loading Profile...</span>
            </div>
        );
    }

    if (!profile) {
        return <div className="text-center mt-4 text-danger">Profile not found.</div>;
    }

    return (
        <div className="container mt-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-header bg-primary text-white text-center rounded-top-4">
                            <h3 className="mb-0">User Profile</h3>
                        </div>
                        <div className="card-body p-4">
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Name:</strong>
                                    <span>{profile.firstName} {profile.lastName}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Email:</strong>
                                    <span>{profile.email}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Role:</strong>
                                    <span className="badge bg-secondary">{profile.role}</span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Account Completed:</strong>
                                    <span className={`badge ${profile.isAccountCompleted ? "bg-success" : "bg-warning"}`}>
                                        {profile.isAccountCompleted ? "Yes" : "No"}
                                    </span>
                                </li>
                                <li className="list-group-item d-flex justify-content-between">
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
