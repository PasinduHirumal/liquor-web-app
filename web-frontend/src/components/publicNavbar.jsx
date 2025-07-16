import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const PublicNavbar = ({ isAuthenticated = false }) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogin = () => navigate("/login");
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);
  const closeCollapse = () => setIsCollapsed(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid px-4">
        <NavLink to="/" className="navbar-brand" onClick={closeCollapse}>
          🍷 Liquor Web App
        </NavLink>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={toggleCollapse}
          aria-label="Toggle navigation"
          aria-expanded={isCollapsed}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isCollapsed ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiX size={28} color="white" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiMenu size={28} color="white" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <div className={`collapse navbar-collapse ${isCollapsed ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                onClick={closeCollapse}
              >
                Home
              </NavLink>
            </li>

            {!isAuthenticated && (
              <li className="nav-item mt-2 mt-lg-0">
                <button className="btn btn-primary ms-lg-3" onClick={handleLogin}>
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
