import React, { useEffect, useState } from "react";
import LiquorProduct from "../pages/LiquorProduct";
import OtherProduct from "../pages/OtherProducts";
import { axiosInstance } from "../lib/axios";
import Banner from "../common/Banner";

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
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  return (
    <>
      <Banner />
      {hasActiveLiquor && <LiquorProduct />}
      <OtherProduct />
    </>
  );
};

export default PublicHome;
