import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../stores/adminAuthStore";

const Navbar = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const collapseRef = useRef(null);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    useEffect(() => {
        const collapseEl = collapseRef.current;

        const handleShow = () => setIsCollapsed(true);
        const handleHide = () => setIsCollapsed(false);

        collapseEl?.addEventListener("show.bs.collapse", handleShow);
        collapseEl?.addEventListener("hide.bs.collapse", handleHide);

        return () => {
            collapseEl?.removeEventListener("show.bs.collapse", handleShow);
            collapseEl?.removeEventListener("hide.bs.collapse", handleHide);
        };
    }, []);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container-fluid px-4">
                {/* Brand */}
                <NavLink to="/" className="navbar-brand" end>
                    🍷 Liquor Web App
                </NavLink>

                {/* Toggler with animation */}
                <button
                    className="navbar-toggler border-0"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded={isCollapsed}
                    aria-label="Toggle navigation"
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

                {/* Collapsible content */}
                <div
                    className="collapse navbar-collapse"
                    id="navbarContent"
                    ref={collapseRef}
                >
                    <ul className="navbar-nav ms-auto align-items-lg-center">
                        <li className="nav-item">
                            <NavLink
                                to="/users"
                                className={({ isActive }) =>
                                    "nav-link" + (isActive ? " active" : "")
                                }
                            >
                                👥 Users
                            </NavLink>
                        </li>

                        <li className="nav-item">
                            <NavLink
                                to="/admin-users"
                                className={({ isActive }) =>
                                    "nav-link" + (isActive ? " active" : "")
                                }
                            >
                                👥 Admin Users
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

export default Navbar;
