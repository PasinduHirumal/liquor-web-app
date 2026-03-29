import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import UserNavbar from "../../components/user/UserNavbar";
import UserProfile from "../../pages/user/UserProfile";
import useUserAuthStore from "../../stores/userAuthStore";
import Address from "../../pages/user/Address";
import PublicHome from "../PublicHome";
import Cart from "../../pages/user/Cart";
import LocationPickerPage from "../../pages/LocationPickerPage";
import CheckoutSummary from "../../pages/user/CheckoutSummary";
import MyOrders from "../../pages/user/MyOrders";

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
        path: "/cart",
        element: <Cart />
    },
    {
        path: "/user-profile/:profileId",
        element: <UserProfile />
    },
    {
        path: "/address",
        element: <Address />
    },
    {
        path: "/location-picker",
        element: <LocationPickerPage />
    },
    {
        path: "/checkout/summary",
        element: <CheckoutSummary />
    },
    {
        path: "/my-orders",
        element: <MyOrders />
    },
];