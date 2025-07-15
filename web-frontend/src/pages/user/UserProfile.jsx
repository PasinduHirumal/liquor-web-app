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
        return <div className="text-center mt-4">Profile not found.</div>;
    }

    return (
        <div className="container mt-5">
            <h2>User Profile</h2>
            <ul className="list-group">
                <li className="list-group-item"><strong>Name:</strong> {profile.firstName} {profile.lastName}</li>
                <li className="list-group-item"><strong>Email:</strong> {profile.email}</li>
                <li className="list-group-item"><strong>Role:</strong> {profile.role}</li>
                <li className="list-group-item"><strong>Account Completed:</strong> {profile.isAccountCompleted ? "Yes" : "No"}</li>
                <li className="list-group-item"><strong>Active:</strong> {profile.isActive ? "Yes" : "No"}</li>
            </ul>
        </div>
    );
};

export default UserProfile;
