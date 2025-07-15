import React from "react";
import { Route, Navigate } from "react-router-dom";
import UserHome from "./UserHome";
import UserNavbar from "../../components/user/UserNavbar";
import useUserAuthStore from "../../stores/userAuthStore";

const Loader = () => (
    <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
        <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
        <span className="ms-2">Loading...</span>
    </div>
);

const UserProtectedRoute = ({ children }) => {
    const { loading, isAuthenticated } = useUserAuthStore();
    if (loading) return <Loader />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return (
        <>
            <UserNavbar />
            {children}
        </>
    );
};

export const userRoutes = (
    <Route
        path="/user"
        element={
            <UserProtectedRoute>
                <UserHome />
            </UserProtectedRoute>
        }
    />
);
