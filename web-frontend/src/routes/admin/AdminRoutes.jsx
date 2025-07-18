import React from "react";
import LiquorList from "../../pages/admin/LiquorList";
import AdminUserList from "../../pages/admin/AdminList";
import UserList from "../../pages/admin/UserList";
import AdminProfile from "../../pages/admin/AdminProfile";
import AdminNavbar from "../../components/admin/AdminNavbar";
import useAdminAuthStore from "../../stores/adminAuthStore";
import { Navigate, useLocation } from "react-router-dom";
import DriverList from "../../pages/admin/DriverList";
import PublicHome from "../PublicHome";
import LiquorProductDetail from "../../components/admin/LiquorProductDetail";
import LiquorEditForm from "../../components/admin/LiquorEditForm";
import OtherProductList from "../../pages/admin/OtherProductList";

const Loader = () => (
    <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
        <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
        <span className="ms-2">Loading...</span>
    </div>
);


const AdminProtectedRoute = ({ children }) => {
    const { loading, isAuthenticated } = useAdminAuthStore();
    const location = useLocation();

    if (loading) return <Loader />;

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

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
                <PublicHome />
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
        path: "/driver-list",
        element: (
            <AdminProtectedRoute>
                <DriverList />
            </AdminProtectedRoute>
        ),
    },
    {
        path: "/liquor-list",
        element: (
            <AdminProtectedRoute>
                <LiquorList />
            </AdminProtectedRoute>
        ),
    },
    {
        path: "/admin/profile/:id",
        element: (
            <AdminProtectedRoute>
                <AdminProfile />
            </AdminProtectedRoute>
        ),
    },
    {
        path: "/products/:id",
        element: (
            <AdminProtectedRoute>
                <LiquorProductDetail />
            </AdminProtectedRoute>
        ),
    },
    {
        path: "/products/edit/:id",
        element: (
            <AdminProtectedRoute>
                <LiquorEditForm />
            </AdminProtectedRoute>
        ),
    },
    {
        path: "/other-product-list",
        element: (
            <AdminProtectedRoute>
                <OtherProductList />
            </AdminProtectedRoute>
        ),
    },
];