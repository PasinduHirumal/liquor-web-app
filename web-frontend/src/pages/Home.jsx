import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
            toast.success("Logged out successfully");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Logout failed. Try again.");
        }
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
