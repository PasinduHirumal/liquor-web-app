import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ToastProvider from "./common/ToastProvider";

import Login from "./routes/Login";
import Register from "./routes/Register";
import Home from "./routes/Home";
import VerifyOtpPage from "./components/VerifyOtpPage";
import AdminUserList from "./pages/AdminList";
import Navbar from "./components/Navbar";
import useAuthStore from "./stores/adminAuthStore";
import UserList from "./pages/UserList";


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
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
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
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
