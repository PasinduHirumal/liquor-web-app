import React from "react";
import AdminHome from "./AdminHome";
import AdminUserList from "../../pages/admin/AdminList";
import UserList from "../../pages/admin/UserList";
import AdminProfile from "../../pages/admin/AdminProfile";
import AdminNavbar from "../../components/admin/AdminNavbar";
import useAdminAuthStore from "../../stores/adminAuthStore";

const Loader = () => (
    <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
        <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
        <span className="ms-2">Loading...</span>
    </div>
);

const AdminProtectedRoute = ({ children }) => {
    const { loading } = useAdminAuthStore();
    if (loading) return <Loader />;
    return (
        <>
            <AdminNavbar />
            {children}
        </>
    );
};

export const adminRoutes = [
    {
        path: "/admin",
        element: (
            <AdminProtectedRoute>
                <AdminHome />
            </AdminProtectedRoute>
        ),
    },
    {
        path: "/admin-users-list",
        element: (
            <AdminProtectedRoute>
                <AdminUserList />
            </AdminProtectedRoute>
        ),
    },
    {
        path: "/users-list",
        element: (
            <AdminProtectedRoute>
                <UserList />
            </AdminProtectedRoute>
        ),
    },
    {
        path: "/admin/profile/:id", // Changed to avoid conflict with user profile
        element: (
            <AdminProtectedRoute>
                <AdminProfile />
            </AdminProtectedRoute>
        ),
    },
];
