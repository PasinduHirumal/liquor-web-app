import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import LiquorProductCard from "../common/LiquorProductCard";

const LiquorAll = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
    };

    applyFilters();
  }, [products, filters]);

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
        <h2 className="mb-0">Liquor Products</h2>
      </div>

      <div className="row g-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <LiquorProductCard key={product.product_id} product={product} />
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

export default LiquorAll;
