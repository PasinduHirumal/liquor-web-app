import React, { useEffect, useState } from "react";
import LiquorProduct from "../pages/LiquorProduct";
import OtherProduct from "../pages/OtherProducts";
import { axiosInstance } from "../lib/axios";
import BannerCarousel from "../components/BannerCarousel";
import ShopByCategory from "../components/ShopByCategory";

const PublicHome = () => {
  const [hasActiveLiquor, setHasActiveLiquor] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkActiveLiquor = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/products/getAll", {
          params: { is_active: true, is_liquor: true },
        });
        const activeLiquors = response.data.data || [];
        setHasActiveLiquor(activeLiquors.length > 0);
      } catch (err) {
        console.error("Failed to check active liquor products:", err);
        setHasActiveLiquor(true);
      } finally {
        setLoading(false);
      }
    };

    checkActiveLiquor();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center"
        style={{
          minHeight: "100vh",
          backgroundColor: "#010524ff",
          paddingTop: "20vh",
        }}
      >
        <div className="spinner-border text-white" role="status" />
      </div>
    );
  }

  return (
    <>
      <BannerCarousel />
      {hasActiveLiquor && <ShopByCategory />}
      {hasActiveLiquor && <LiquorProduct />}
      <OtherProduct />
    </>
  );
};

export default PublicHome;
