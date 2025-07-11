import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore";

const Navbar = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid px-4">
                {/* Brand */}
                <NavLink to="/" className="navbar-brand" end>
                    🍷 Liquor Web App
                </NavLink>

                {/* Toggler for mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                    aria-controls="navbarContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Collapsible content */}
                <div className="collapse navbar-collapse" id="navbarContent">
                    <ul className="navbar-nav ms-auto align-items-lg-center">
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
