import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ToastProvider from "./components/ToastProvider";

import LoginForm from "./routes/Login";
import RegisterForm from "./pages/Register";
import Home from "./routes/Home";
import VerifyOtpPage from "./components/VerifyOtpPage";
import AdminUserList from "./pages/AdminUserList";
import Navbar from "./components/Navbar";
import useAuthStore from "./stores/authStore";


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <ToastProvider />

      {isAuthenticated && <Navbar />}

      <Routes>
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterForm />}
        />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-users"
          element={
            <ProtectedRoute>
              <AdminUserList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
