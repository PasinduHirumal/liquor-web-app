import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import UserNavbar from "../../components/user/UserNavbar";
import UserProfile from "../../pages/user/UserProfile";
import useUserAuthStore from "../../stores/userAuthStore";
import Address from "../../pages/user/Address";
import PublicHome from "../PublicHome";

const Loader = () => (
    <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
        <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
        <span className="ms-2">Loading...</span>
    </div>
);

const UserProtectedRoute = ({ children }) => {
    const { loading, isAuthenticated } = useUserAuthStore();
    const location = useLocation();

    if (loading) return <Loader />;

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

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
                <PublicHome />
            </UserProtectedRoute>
        ),
    },
    {
        path: "/profile/:profileId",
        element: <UserProfile />
    },
    {
        path: "/address",
        element: <Address />
    },
];
