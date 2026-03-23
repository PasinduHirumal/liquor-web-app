import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useUserAuthStore from "../../stores/userAuthStore";

const initialForm = {
    email: "",
    phoneNumber: "",
    password: "",
};

const UserLogin = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState("email");
    const [formData, setFormData] = useState(initialForm);

    const login = useUserAuthStore((state) => state.login);
    const loading = useUserAuthStore((state) => state.loading);
    const isAuthenticated = useUserAuthStore((state) => state.isAuthenticated);
    const resetError = useUserAuthStore((state) => state.resetError);
    const checkAuth = useUserAuthStore((state) => state.checkAuth);
    const error = useUserAuthStore((state) => state.error);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (isAuthenticated) navigate("/");
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        setFormData(initialForm);
        setShowPassword(false);
        resetError();
    }, [loginMethod, resetError]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        resetError();
    };

    const setStoreError = (message) => {
        useUserAuthStore.setState({ error: message });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        resetError();

        const email = formData.email.trim().toLowerCase();
        const phoneNumber = formData.phoneNumber.trim();
        const password = formData.password;

        const credential = loginMethod === "email" ? email : phoneNumber;
        const credentialLabel = loginMethod === "email" ? "Email" : "Phone number";

        if (!credential) {
            setStoreError(`${credentialLabel} is required.`);
            return;
        }

        if (!password.trim()) {
            setStoreError("Password is required.");
            return;
        }

        if (loginMethod === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setStoreError("Invalid email format.");
                return;
            }
        }

        if (loginMethod === "phone") {
            const phoneRegex = /^\+\d{1,3}\d{4,14}$/;
            if (!phoneRegex.test(phoneNumber)) {
                setStoreError("Phone number must include country code, e.g. +94771234567.");
                return;
            }
        }

        const payload = {
            password,
            ...(loginMethod === "email"
                ? { email }
                : { phoneNumber }),
        };

        await login(payload);
    };

    return (
        <div className="card p-4 shadow login-card">
            <h3 className="mb-4 text-center text-primary">👤 User Login</h3>

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

            <form onSubmit={handleSubmit} noValidate>
                {loginMethod === "email" ? (
                    <div className="mb-3">
                        <label className="form-label">
                            Email <span className="text-danger">*</span>
                        </label>
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
                        <label className="form-label">
                            Phone <span className="text-danger">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            className="form-control"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            placeholder="+94771234567"
                            autoComplete="tel"
                            pattern="^\+\d{1,3}\d{4,14}$"
                            title="Phone number must include country code"
                            autoFocus
                        />
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label">
                        Password <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            className="form-control"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            className="btn border"
                            onClick={() => setShowPassword((prev) => !prev)}
                            tabIndex={-1}
                            title={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <div className="mt-2 mb-4 d-flex justify-content-between align-items-center">
                    <span className="text-secondary">Forgot password?</span>
                    <button
                        type="button"
                        className="btn btn-link p-0 text-decoration-none ms-2"
                        onClick={() => navigate("/reset-password")}
                    >
                        Click here
                    </button>
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
                    type="button"
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