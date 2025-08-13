import React from "react";
import bannerImage from "../assets/banner.jpg";

const Banner = () => {
  return (
    <div style={{ width: "100%", position: "relative", overflow: "hidden" }}>
      <img
        src={bannerImage}
        alt="Premium Spirits & Wine Collection"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
        }}
      />

      {/* Overlay text */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "#fff",
          textAlign: "center",
          backgroundColor: "rgba(0,0,0,0.4)",
          padding: "1rem 2rem",
          borderRadius: "8px",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
          Premium Spirits & Wine Collection
        </h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
          Discover Our Curated Selection of Fine Beverages
        </p>
        <button
          style={{
            padding: "0.7rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#fff",
            color: "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
        >
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default Banner;
