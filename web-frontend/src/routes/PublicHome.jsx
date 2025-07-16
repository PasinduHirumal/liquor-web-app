import React from "react";
import PublicNavbar from "../components/PublicNavbar";

const PublicHome = () => {
  return (
    <>
      <PublicNavbar isAuthenticated={false} />
      
      <div className="container-fluid mt-5 pt-4">
        <h1>Welcome to the Public Home Page</h1>
        <p>This content is visible to everyone.</p>
      </div>
    </>
  );
};

export default PublicHome;
