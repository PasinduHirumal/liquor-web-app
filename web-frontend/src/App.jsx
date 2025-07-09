import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./routes/Login";
import RegisterForm from "./routes/Register";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />

        {/* Default redirect to login */}
        <Route path="/login" element={<LoginForm />} />

        {/* Register page */}
        <Route path="/register" element={<RegisterForm />} />

        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
