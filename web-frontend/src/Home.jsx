// Home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const Home = () => {
    const navigate = useNavigate();
    const [error, setError] = React.useState("");

    const handleLogout = async () => {
        setError("");
        try {
            await axiosInstance.post("/auth/logout");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Logout failed. Try again.");
        }
    };

    return (
        <div className="container mt-4" style={{ maxWidth: "600px" }}>
            <h1>Welcome Home!</h1>
            <p>You have successfully registered and logged in.</p>

            <button onClick={handleLogout} className="btn btn-danger mt-3">
                Logout
            </button>

            {error && (
                <div className="alert alert-danger mt-3" role="alert">
                    ❌ {error}
                </div>
            )}
        </div>
    );
};

export default Home;
