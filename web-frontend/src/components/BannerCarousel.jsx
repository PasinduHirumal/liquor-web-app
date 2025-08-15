import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./BannerCarousel.css";

const BannerCarousel = () => {
  const [banners, setBanners] = useState([]);
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    arrows: true,
    pauseOnHover: false,
    adaptiveHeight: true
  };

  if (loading) {
    return <div className="banner-carousel__loading">Loading...</div>;
  }

  if (error) return <div className="banner-carousel__error">{error}</div>;

  if (banners.length === 0) {
    return <div className="banner-carousel__empty">No banners available</div>;
  }

  return (
    <div className="banner-carousel">
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <div key={index} className="banner-carousel__slide">
            <img
              src={banner.image}
              alt={banner.title}
              className="banner-carousel__image"
            />
            <div className="banner-carousel__overlay">
              <div className="banner-carousel__content">
                <h1 className="banner-carousel__title">{banner.title}</h1>
                <p className="banner-carousel__description">
                  {banner.description}
                </p>
                <button
                  className="banner-carousel__cta"
                  onClick={() => window.scrollTo({ top: 550, behavior: "smooth" })}
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerCarousel;