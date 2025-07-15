import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ToastProvider from "./common/ToastProvider";
import Login from "./routes/Login";
import Register from "./routes/Register";
import VerifyOtpPage from "./components/admin/VerifyOtpPage";

import useAdminAuthStore from "./stores/adminAuthStore";
import useUserAuthStore from "./stores/userAuthStore";

import { adminRoutes } from "./routes/admin/AdminRoutes";
import { userRoutes } from "./routes/user/UserRoutes";

function App() {
  const adminCheckAuth = useAdminAuthStore((state) => state.checkAuth);
  const userCheckAuth = useUserAuthStore((state) => state.checkAuth);
  const adminAuth = useAdminAuthStore((state) => state.isAuthenticated);
  const userAuth = useUserAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    adminCheckAuth();
    userCheckAuth();
  }, [adminCheckAuth, userCheckAuth]);

  return (
    <Router>
      <ToastProvider />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            adminAuth ? (
              <Navigate to="/admin" replace />
            ) : userAuth ? (
              <Navigate to="/user" replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            adminAuth || userAuth ? <Navigate to="/login" replace /> : <Register />
          }
        />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />

        {/* Admin & User Routes */}
        {adminRoutes}

        {userRoutes}

        {/* Catch-all */}
        <Route
          path="*"
          element={
            <Navigate to={adminAuth ? "/admin" : userAuth ? "/user" : "/login"} replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
