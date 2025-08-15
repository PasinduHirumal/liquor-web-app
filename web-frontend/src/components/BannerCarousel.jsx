import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axiosInstance.get("/banners/getAll", {
          params: { isActive: true },
        });

        if (response.data.success && response.data.data.length > 0) {
          setBanners(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch banners:", err);
        setError("Failed to load banners");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto-slide every 7 seconds
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [banners]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center text-white" style={{ minHeight: "80vh" }}>
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  if (error) return <div>{error}</div>;

  if (banners.length === 0) return <div>No banners available</div>;

  const currentBanner = banners[currentIndex];

  return (
    <div
      style={{
        width: "100%",
        height: "450px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <img
        src={currentBanner.image}
        alt={currentBanner.title}
        style={{
          width: "100%",
          height: "100%",
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
          maxWidth: "80%",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
          {currentBanner.title}
        </h1>
        <p style={{ fontSize: "1rem", marginBottom: "1rem" }}>
          {currentBanner.description}
        </p>
        <button
          style={{
            padding: "0.5rem 1rem",
            fontSize: "0.9rem",
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

      {/* Navigation buttons with icons */}
      <button
        onClick={() =>
          setCurrentIndex((currentIndex - 1 + banners.length) % banners.length)
        }
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "#fff",
          border: "none",
          padding: "0.5rem",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AiOutlineLeft size={24} />
      </button>
      <button
        onClick={() => setCurrentIndex((currentIndex + 1) % banners.length)}
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translateY(-50%)",
          backgroundColor: "rgba(0,0,0,0.5)",
          color: "#fff",
          border: "none",
          padding: "0.5rem",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AiOutlineRight size={24} />
      </button>
    </div>
  );
};

export default BannerCarousel;
