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
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
            <NavLink to="/" className="navbar-brand" end>
                🏠 Home
            </NavLink>

            <div className="collapse navbar-collapse">
                <ul className="navbar-nav ms-auto">
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
                    <li className="nav-item">
                        <button className="btn btn-danger ms-3" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
