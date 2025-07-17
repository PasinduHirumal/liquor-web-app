import React from "react";
import { Outlet } from "react-router-dom";
import useAdminAuthStore from "../stores/adminAuthStore";
import useUserAuthStore from "../stores/userAuthStore";
import AdminNavbar from "../components/admin/AdminNavbar";
import UserNavbar from "../components/user/UserNavbar";
import PublicNavbar from "../components/publicNavbar";

const MainLayout = () => {
    const isAdminAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
    const isUserAuthenticated = useUserAuthStore((state) => state.isAuthenticated);

    return (
        <>
            {isAdminAuthenticated ? (
                <AdminNavbar />
            ) : isUserAuthenticated ? (
                <UserNavbar />
            ) : (
                <PublicNavbar />
            )}
            <Outlet />
        </>
    );
};

export default MainLayout;
