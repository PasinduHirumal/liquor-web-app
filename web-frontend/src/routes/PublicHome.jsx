import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import ProductCard from "../common/LiquorProductCard";

const PublicHome = () => {
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/products/getAll");
        const allProducts = response.data.data || [];
        setProducts(allProducts);
        setVisibleProducts(allProducts.slice(0, 6));
      } catch (err) {
        setError(err.message || "Failed to fetch products");
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleShowAll = () => {
    setVisibleProducts(showAll ? products.slice(0, 6) : products);
    setShowAll(!showAll);
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
    <>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">All Products</h2>
          {products.length > 6 && (
            <button className="btn btn-outline-primary" onClick={toggleShowAll}>
              {showAll ? "Show Less" : "View More"}
            </button>
          )}
        </div>

        <div className="row g-4">
          {visibleProducts.length > 0 ? (
            visibleProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info" role="alert">
                No products available.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PublicHome;
