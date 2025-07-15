import React from "react";
import { Route } from "react-router-dom";
import AdminHome from "./AdminHome";
import AdminUserList from "../../pages/admin/AdminList";
import UserList from "../../pages/admin/UserList";
import AdminProfile from "../../pages/admin/AdminProfile";
import AdminNavbar from "../../components/admin/AdminNavbar";
import useAdminAuthStore from "../../stores/adminAuthStore";
import { Navigate } from "react-router-dom";

const Loader = () => (
    <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
        <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
        <span className="ms-2">Loading...</span>
    </div>
);

const AdminProtectedRoute = ({ children }) => {
    const { loading, isAuthenticated } = useAdminAuthStore();
    if (loading) return <Loader />;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return (
        <>
            <AdminNavbar />
            {children}
        </>
    );
};

export const adminRoutes = (
    <>
        <Route
            path="/admin"
            element={
                <AdminProtectedRoute>
                    <AdminHome />
                </AdminProtectedRoute>
            }
        />
        <Route
            path="/admin-users"
            element={
                <AdminProtectedRoute>
                    <AdminUserList />
                </AdminProtectedRoute>
            }
        />
        <Route
            path="/users"
            element={
                <AdminProtectedRoute>
                    <UserList />
                </AdminProtectedRoute>
            }
        />
        <Route
            path="/profile/:id"
            element={
                <AdminProtectedRoute>
                    <AdminProfile />
                </AdminProtectedRoute>
            }
        />
    </>
);
