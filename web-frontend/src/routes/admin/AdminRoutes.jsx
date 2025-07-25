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
import LiquorProductDetail from "../../pages/admin/detailPages/LiquorProductDetail";
import LiquorEditForm from "../../components/admin/forms/LiquorEditForm"
import OtherProductList from "../../pages/admin/OtherProductList";
import OtherProductDetail from "../../pages/admin/detailPages/OtherProductDetail";
import OtherProductEditForm from "../../components/admin/forms/OtherProductEditForm";
import ManageCategory from "../../pages/admin/ManageCategory";
import DriverDetaiPage from "../../pages/admin/detailPages/DriverDetaiPage";
import DriverProfileInfo from "../../components/admin/forms/DriverProfileInfo";
import DriverVehicleInfo from "../../components/admin/forms/DriverVehicleInfo";
import DriverLocationInfo from "../../components/admin/forms/DriverLocationInfo";
import DriverPerformanceInfo from "../../components/admin/forms/DriverPerformanceInfo";
import DriverFinancialInfo from "../../components/admin/forms/DriverFinancialInfo";
import DriverDocumentInfo from "../../components/admin/forms/DriverDocumentInfo";

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
        element: <LiquorList />
    },
    {
        path: "/admin/profile/:id",
        element: <AdminProfile />
    },
    {
        path: "/products/:id",
        element: <LiquorProductDetail />
    },
    {
        path: "/other-products/:id",
        element: <OtherProductDetail />
    },
    {
        path: "/products/edit/:id",
        element: <LiquorEditForm />
    },
    {
        path: "/other-products/edit/:id",
        element: <OtherProductEditForm />
    },
    {
        path: "/other-product-list",
        element: <OtherProductList />
    },
    {
        path: "/category",
        element: <ManageCategory />
    },
    {
        path: "/admin/drivers/:id",
        element: <DriverDetaiPage />
    },
    {
        path: "/admin/drivers/:id/edit-profile",
        element: <DriverProfileInfo />
    },
    {
        path: "/admin/drivers/:id/edit-vehicles",
        element: <DriverVehicleInfo />
    },
    {
        path: "/admin/drivers/:id/edit-location",
        element: <DriverLocationInfo />
    },
    {
        path: "/admin/drivers/:id/edit-performance",
        element: <DriverPerformanceInfo />
    },
    {
        path: "/admin/drivers/:id/edit-financial",
        element: <DriverFinancialInfo />
    },
    {
        path: "/admin/drivers/:id/edit-documents",
        element: <DriverDocumentInfo />
    },
];