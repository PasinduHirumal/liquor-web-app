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
import LiquorEditForm from "../../components/admin/forms/editLiquorProductModel/LiquorEditForm";
import OtherProductList from "../../pages/admin/OtherProductList";
import OtherProductDetail from "../../pages/admin/detailPages/OtherProductDetail";
import OtherProductEditForm from "../../components/admin/forms/editOtherProductModel/OtherProductEditForm";
import ManageCategory from "../../pages/admin/ManageCategory";
import DriverDetaiPage from "../../pages/admin/detailPages/DriverDetaiPage";
import DriverProfileInfo from "../../components/admin/forms/DriverProfileInfo";
import DriverVehicleInfo from "../../components/admin/forms/DriverVehicleInfo";
import DriverLocationInfo from "../../components/admin/forms/DriverLocationInfo";
import DriverPerformanceInfo from "../../components/admin/forms/DriverPerformanceInfo";
import DriverFinancialInfo from "../../components/admin/forms/DriverFinancialInfo";
import DriverDocumentInfo from "../../components/admin/forms/DriverDocumentInfo";
import OrderLIst from "../../pages/admin/OrderList";
import OrderDetail from "../../pages/admin/detailPages/OrderDetail";
import SystemDetail from "../../pages/admin/SystemDetail";
import Report from "../../pages/admin/report/Report";
import ManageBanner from "../../pages/admin/ManageBanner";
import SuperMarket from "../../pages/admin/SuperMarket";
import AppInfo from "../../pages/admin/AppInfo";
import DriverPayment from "../../pages/admin/DriverPayment";

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
        path: "/order-list",
        element: (
            <AdminProtectedRoute>
                <OrderLIst />
            </AdminProtectedRoute>
        ),
    },
    {
        path: "/wharehouse",
        element: (
            <AdminProtectedRoute>
                <SystemDetail />
            </AdminProtectedRoute>
        ),
    },
    {
        path: "/supermarket",
        element: (
            <AdminProtectedRoute>
                <SuperMarket />
            </AdminProtectedRoute>
        ),
    },
    {
        path: "/reports",
        element: (
            <AdminProtectedRoute>
                <Report />
            </AdminProtectedRoute>
        ),
    },
    {
        path: "/app-info",
        element: (
            <AdminProtectedRoute>
                <AppInfo />
            </AdminProtectedRoute>
        ),
    },
    {
        path: "/order-list/:id",
        element: <OrderDetail />
    },
    {
        path: "/liquor-list",
        element: <LiquorList />
    },
    {
        path: "/profile/:id",
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
        path: "/driver-list/:id",
        element: <DriverDetaiPage />
    },
    {
        path: "/driver-list/:id/edit-profile",
        element: <DriverProfileInfo />
    },
    {
        path: "/driver-list/:id/edit-vehicles",
        element: <DriverVehicleInfo />
    },
    {
        path: "/driver-list/:id/edit-location",
        element: <DriverLocationInfo />
    },
    {
        path: "/driver-list/:id/edit-performance",
        element: <DriverPerformanceInfo />
    },
    {
        path: "/driver-list/:id/edit-financial",
        element: <DriverFinancialInfo />
    },
    {
        path: "/driver-list/:id/edit-documents",
        element: <DriverDocumentInfo />
    },
    {
        path: "/driver-payments",
        element: <DriverPayment />
    },
    {
        path: "/manage-banner",
        element: <ManageBanner />
    },
];