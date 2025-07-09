import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./Login";
import RegisterForm from "./Register";

const Home = () => {
  return (
    <div className="container mt-4">
      <h1>Welcome Home!</h1>
      <p>You have successfully registered and logged in.</p>
    </div>
  );
};

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
