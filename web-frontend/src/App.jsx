import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./routes/Login";
import RegisterForm from "./routes/Register";
import Home from "./pages/Home";
import VerifyOtpPage from "./components/VerifyOtpPage";
import AdminUserList from "./components/AdminUserList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/admin-users" element={<AdminUserList />} />
      </Routes>
    </Router>
  );
}

export default App;
