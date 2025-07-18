import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import OtherProductCard from "../common/OtherProductcard";

const OtherProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters] = useState({
    is_active: true,
    is_in_stock: true,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/other-products/getAll");
        const allProducts = response.data.data || [];
        setProducts(allProducts);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = products.filter(
        (p) => p.is_active === filters.is_active && p.is_in_stock === filters.is_in_stock
      );
      setFilteredProducts(filtered);
      setVisibleProducts(showAll ? filtered : filtered.slice(0, 6));
    };

    applyFilters();
  }, [products, filters, showAll]);

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
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
        <h2 className="mb-0">All Products</h2>
        {filteredProducts.length > 6 && (
          <button className="btn btn-outline-primary" onClick={toggleShowAll}>
            {showAll ? "Show Less" : "View More"}
          </button>
        )}
      </div>

      <div className="row g-4">
        {visibleProducts.length > 0 ? (
          visibleProducts.map((product) => (
            <OtherProductCard key={product.product_id} product={product} />
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info" role="alert">
              No products available based on filters.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherProduct;
