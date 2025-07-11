import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../stores/authStore"; // adjust path as necessary

const Navbar = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
            <Link className="navbar-brand" to="/">
                🏠 Home
            </Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link to="/admin-users" className="nav-link">
                            👥 Admin Users
                        </Link>
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
