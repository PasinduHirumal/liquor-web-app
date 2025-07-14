import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";
import ToastProvider from "./common/ToastProvider";

import LoginForm from "./routes/Login";
import RegisterForm from "./pages/Register";
import Home from "./routes/Home";
import VerifyOtpPage from "./components/VerifyOtpPage";
import AdminUserList from "./pages/AdminList";
import Navbar from "./components/Navbar";
import useAuthStore from "./stores/adminAuthStore";
import UserList from "./pages/UserList";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
};

const ProtectedLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth(); // called once on mount
  }, [checkAuth]);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <ToastProvider />

      <Routes>
        {/* Public Routes */}
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterForm />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/admin-users" element={<AdminUserList />} />
            <Route path="/users" element={<UserList />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
