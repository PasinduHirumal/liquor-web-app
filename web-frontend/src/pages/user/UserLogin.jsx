import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useUserAuthStore from "../../stores/userAuthStore";

const UserLogin = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState("email");
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        password: "",
    });

    const login = useUserAuthStore((state) => state.login);
    const loading = useUserAuthStore((state) => state.loading);
    const isAuthenticated = useUserAuthStore((state) => state.isAuthenticated);
    const resetError = useUserAuthStore((state) => state.resetError);
    const checkAuth = useUserAuthStore((state) => state.checkAuth);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        setFormData({ email: "", phone: "", password: "" });
        setShowPassword(false);
        resetError();
    }, [loginMethod]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        resetError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const credential = loginMethod === "email" ? formData.email.trim() : formData.phone.trim();
        const credentialLabel = loginMethod === "email" ? "Email" : "Phone number";

        if (!credential) {
            useUserAuthStore.setState({ error: `${credentialLabel} is required.` });
            return;
        }

        if (!formData.password) {
            useUserAuthStore.setState({ error: "Password is required." });
            return;
        }

        // Email format check
        if (loginMethod === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(credential)) {
                useUserAuthStore.setState({ error: "Invalid email format." });
                return;
            }
        }

        // Phone format check
        if (loginMethod === "phone") {
            const phoneRegex = /^\+?\d{7,15}$/;
            if (!phoneRegex.test(credential)) {
                useUserAuthStore.setState({ error: "Invalid phone number format." });
                return;
            }
        }

        const payload = {
            password: formData.password,
            ...(loginMethod === "email" ? { email: credential } : { phone: credential }),
        };

        await login(payload);
    };

    return (
        <div className="card p-4 shadow login-card">
            <h3 className="mb-4 text-center text-primary">👤 User Login</h3>

            {/* Method Switch */}
            <div className="d-flex justify-content-center mb-3">
                <div className="btn-group gap-1" role="group" aria-label="Login Method Switch">
                    <button
                        type="button"
                        className={`btn ${loginMethod === "email" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setLoginMethod("email")}
                    >
                        Email
                    </button>
                    <button
                        type="button"
                        className={`btn ${loginMethod === "phone" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setLoginMethod("phone")}
                    >
                        Phone
                    </button>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
                {loginMethod === "email" ? (
                    <div className="mb-3">
                        <label className="form-label">Email <span className="text-danger">*</span></label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                            autoFocus
                        />
                    </div>
                ) : (
                    <div className="mb-3">
                        <label className="form-label">Phone <span className="text-danger">*</span></label>
                        <input
                            type="tel"
                            name="phone"
                            className="form-control"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+947XXXXXXXX"
                            autoComplete="tel"
                            pattern="^\+?\d{7,15}$"
                            title="Phone number must include country code"
                            autoFocus
                        />
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label">Password <span className="text-danger">*</span></label>
                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            autoComplete="current-password"
                        />
                        <button
                            type="button"
                            className="btn border"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <div className="text-center mt-4">
                Don't have an account?{" "}
                <button
                    className="btn btn-link p-0 text-decoration-none"
                    onClick={() => navigate("/register")}
                >
                    Register here
                </button>
            </div>
        </div>
    );
};

export default UserLogin;
