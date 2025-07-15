// user.routes.js
import UserNavbar from "../../components/user/UserNavbar";
import UserHome from "./UserHome";
import UserProfile from "../../pages/user/UserProfile";
import useUserAuthStore from "../../stores/userAuthStore";

import React from "react";
import UserProfileEdit from "../../pages/user/EditUserProfile";

const Loader = () => (
    <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
        <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
        <span className="ms-2">Loading...</span>
    </div>
);

const UserProtectedRoute = ({ children }) => {
    const { loading } = useUserAuthStore();
    if (loading) return <Loader />;
    return (
        <>
            <UserNavbar />
            {children}
        </>
    );
};

export const userRoutes = [
    {
        path: "/user",
        element: (
            <UserProtectedRoute>
                <UserHome />
            </UserProtectedRoute>
        ),
    },
    {
        path: "/profile/:profileId",
        element: (
            <UserProtectedRoute>
                <UserProfile />
            </UserProtectedRoute>
        ),
    },
    {
        path: "/profile/edit/:id",
        element: (
            <UserProtectedRoute>
                <UserProfileEdit />
            </UserProtectedRoute>
        ),
    },
];
