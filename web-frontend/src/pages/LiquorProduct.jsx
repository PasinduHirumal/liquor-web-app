import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import LiquorProductCard from "../common/LiquorProductCard";

const LiquorProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters] = useState({
    is_active: true,
    is_in_stock: true,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/products/getAll");
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
      setVisibleProducts(filtered.slice(0, 12));
    };

    applyFilters();
  }, [products, filters]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center text-white" style={{ minHeight: "80vh" }}>
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
    <div className="container-fluid py-4" style={{ backgroundColor: "#010524ff" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0 text-white">Liquor Products</h2>
        {filteredProducts.length > 6 && (
          <button className="btn btn-outline-light" onClick={() => navigate("/liquor-all")}>
            View All
          </button>
        )}
      </div>

      <div className="row g-4">
        {visibleProducts.length > 0 ? (
          visibleProducts.map((product) => (
            <LiquorProductCard key={product.product_id} product={product} />
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
  );
};

export default LiquorProduct;
