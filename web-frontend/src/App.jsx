import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminRegister from "./pages/admin/AdminRegister";

import ToastProvider from "./common/ToastProvider";
import Login from "./routes/Login";
import Register from "./routes/Register";
import VerifyOtpPage from "./components/VerifyOtpPage";
import ResetPassword from "./components/ResetPassword";
import PublicHome from "./routes/PublicHome";
import CategoryProducts from "./pages/CategoryProducts";

import useAdminAuthStore from "./stores/adminAuthStore";
import useUserAuthStore from "./stores/userAuthStore";

import { adminRoutes } from "./routes/admin/AdminRoutes";
import { userRoutes } from "./routes/user/UserRoutes";
import MainLayout from "./layout/Mainlayout";
import LiquorAll from "./pages/LiquorAll";
import OtherProductAll from "./pages/OtherProductAll";
import ScrollToTop from "./common/ScrollToTop";
import ScrollTopButton from "./common/ScrollTopButton";

function App() {
  const adminCheckAuth = useAdminAuthStore((state) => state.checkAuth);
  const userCheckAuth = useUserAuthStore((state) => state.checkAuth);
  const adminAuth = useAdminAuthStore((state) => state.isAuthenticated);
  const userAuth = useUserAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    adminCheckAuth();
    userCheckAuth();
  }, []);

  return (
    <div style={{ backgroundColor: "#010524ff" }}>
      <Router>
        <ToastProvider />
        <ScrollToTop />
        <ScrollTopButton />
        
        <Routes>
          <Route path="/" element={<MainLayout />}>

            <Route
              index
              element={
                adminAuth ? (
                  <Navigate to="/admin" replace />
                ) : userAuth ? (
                  <Navigate to="/user" replace />
                ) : (
                  <PublicHome />
                )
              }
            />

            <Route
              path="login"
              element={
                adminAuth || userAuth ? <Navigate to="/" replace /> : <Login />
              }
            />

            <Route
              path="register"
              element={
                adminAuth || userAuth ? <Navigate to="/" replace /> : <Register />
              }
            />

            <Route path="verify-otp" element={<VerifyOtpPage />} />
            <Route path="reset-password" element={<ResetPassword />} />

            <Route path="/liquor-all" element={<LiquorAll />} />
            <Route path="/other-product-all" element={<OtherProductAll />} />
            <Route path="/category/:id" element={<CategoryProducts />} />

            {/* Admin Routes */}
            {adminRoutes.map(({ path, element }, i) => (
              <Route key={`admin-${i}`} path={path} element={element} />
            ))}

            {/* User Routes */}
            {userRoutes.map(({ path, element }, i) => (
              <Route key={`user-${i}`} path={path} element={element} />
            ))}

            <Route
              path="*"
              element={
                adminAuth ? (
                  <Navigate to="/admin" replace />
                ) : userAuth ? (
                  <Navigate to="/user" replace />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
