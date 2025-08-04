import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import OtherProductCard from "../common/OtherProductCard";

const OtherProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/other-products/getAll");
        const allProducts = response.data.data || [];

        const filteredProducts = allProducts.filter(
          (product) => product.is_active === true && product.is_in_stock === true
        );

        setProducts(filteredProducts.slice(0, 12));
      } catch (err) {
        setError(err.message || "Failed to fetch products");
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  const handleViewAll = () => {
    navigate("/other-product-all");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Grocery Items</h2>
        {products.length > 6 && (
          <button className="btn btn-outline-primary" onClick={handleViewAll}>
            View All
          </button>
        )}
      </div>

      <div className="row g-4">
        {products.length > 0 ? (
          products.map((product) => (
            <OtherProductCard key={product.product_id} product={product} />
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info" role="alert">
              No products found.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherProduct;
