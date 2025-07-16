import React from "react";
import { Link } from "react-router-dom";

const PublicNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">MyApp</Link>
        <div className="d-flex">
          <Link className="btn btn-outline-primary me-2" to="/login">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
