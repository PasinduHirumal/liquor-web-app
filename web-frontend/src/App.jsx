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
import AdminHome from "./routes/AdminHome";
import UserHome from "./routes/UserHome";
import VerifyOtpPage from "./components/VerifyOtpPage";
import AdminUserList from "./pages/AdminList";
import UserList from "./pages/UserList";
import AdminProfile from "./pages/AdminProfile";
import AdminNavbar from "./components/AdminNavbar";
import UserNavbar from "./components/UserNavbar";

import useAdminAuthStore from "./stores/adminAuthStore";
import useUserAuthStore from "./stores/userAuthStore";

// Loader UI
const Loader = () => (
  <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
    <div className="spinner-border text-primary" role="status" aria-hidden="true"></div>
    <span className="ms-2">Loading...</span>
  </div>
);

// Protected Route for Admin
const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuthStore();
  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
};

// Protected Route for User
const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUserAuthStore();
  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <>
      <UserNavbar />
      {children}
    </>
  );
};

function App() {
  const adminCheckAuth = useAdminAuthStore((state) => state.checkAuth);
  const userCheckAuth = useUserAuthStore((state) => state.checkAuth);

  useEffect(() => {
    adminCheckAuth();
    userCheckAuth();
  }, [adminCheckAuth, userCheckAuth]);

  const adminAuth = useAdminAuthStore((state) => state.isAuthenticated);
  const userAuth = useUserAuthStore((state) => state.isAuthenticated);

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

        {/* Admin Protected Routes */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminHome />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin-users"
          element={
            <AdminProtectedRoute>
              <AdminUserList />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <AdminProtectedRoute>
              <UserList />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <AdminProtectedRoute>
              <AdminProfile />
            </AdminProtectedRoute>
          }
        />

        {/* User Protected Route */}
        <Route
          path="/user"
          element={
            <UserProtectedRoute>
              <UserHome />
            </UserProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={adminAuth ? "/admin" : userAuth ? "/user" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
