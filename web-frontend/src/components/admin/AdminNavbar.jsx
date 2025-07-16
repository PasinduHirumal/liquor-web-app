import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import useAdminAuthStore from "../../stores/adminAuthStore";

const AdminNavbar = () => {
    const navigate = useNavigate();
    const logout = useAdminAuthStore((state) => state.logout);
    const user = useAdminAuthStore((state) => state.user);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const toggleCollapse = () => setIsCollapsed((prev) => !prev);
    const closeCollapse = () => setIsCollapsed(false);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top" aria-label="Main navigation">
            <div className="container-fluid px-4">
                <NavLink to="/" className="navbar-brand" onClick={closeCollapse}>
                    🍷 Liquor Web App
                </NavLink>

                <button
                    className="navbar-toggler border-0"
                    type="button"
                    onClick={toggleCollapse}
                    aria-label="Toggle navigation"
                    aria-controls="navbarSupportedContent"
                    aria-expanded={isCollapsed}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isCollapsed ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FiX size={28} color="white" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <FiMenu size={28} color="white" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </button>

                <div
                    className={`collapse navbar-collapse ${isCollapsed ? "show" : ""}`}
                    id="navbarSupportedContent"
                >
                    <ul className="navbar-nav ms-auto align-items-lg-center">
                        <li className="nav-item">
                            <NavLink
                                to="/"
                                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                                onClick={closeCollapse}
                            >
                                Home
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to={`/admin/profile/${user?._id || user?.id}`}
                                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                                onClick={closeCollapse}
                            >
                                Profile
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/users-list"
                                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                                onClick={closeCollapse}
                            >
                                Users
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/driver-list"
                                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                                onClick={closeCollapse}
                            >
                                Drivers
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/admin-users-list"
                                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                                onClick={closeCollapse}
                            >
                                Admin Users
                            </NavLink>
                        </li>

                        <li className="nav-item mt-2 mt-lg-0">
                            <button className="btn btn-danger ms-lg-3" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
