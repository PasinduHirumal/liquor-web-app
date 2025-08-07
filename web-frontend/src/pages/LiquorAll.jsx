import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import LiquorProductCard from "../common/LiquorProductCard";
import { Button } from "react-bootstrap";

const LiquorAll = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    is_active: "true",
    is_in_stock: "true",
    categoryId: "",
  });

  // Fetch categories only once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await axiosInstance.get("/categories/getAll");
        const activeCategories = (res.data.data || []).filter(
          cat => cat.is_active && cat.is_liquor
        );
        setCategories(activeCategories);
      } catch (err) {
        console.error("Category fetch error:", err);
        setError(err.message || "Failed to fetch categories");
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const params = {
          is_liquor: true,
          is_active: filters.is_active === "true",
          is_in_stock: filters.is_in_stock === "true",
        };
        if (filters.categoryId) {
          params.category_id = filters.categoryId;
        }

        const res = await axiosInstance.get("/products/getAll", { params });
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Product fetch error:", err);
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleCategoryClick = (categoryId) => {
    setFilters(prev => ({
      ...prev,
      categoryId: prev.categoryId === categoryId ? "" : categoryId,
    }));
  };

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h2 className="mb-3">Liquor Products</h2>

        {/* Category Filter */}
        {!loadingCategories && (
          <div className="overflow-auto pb-2">
            <div className="d-flex flex-nowrap gap-3">

              {/* All button */}
              <div
                className={`category-pill ${!filters.categoryId ? "active" : ""}`}
                onClick={() => handleCategoryClick("")}
                style={{
                  cursor: "pointer",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  backgroundColor: !filters.categoryId ? "#1976d2" : "#f0f0f0",
                  color: !filters.categoryId ? "white" : "inherit",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <span>All</span>
              </div>

              {/* Category buttons */}
              {categories.map((category) => (
                <div
                  key={category.category_id}
                  className={`category-pill ${filters.categoryId === category.category_id ? "active" : ""
                    }`}
                  onClick={() => handleCategoryClick(category.category_id)}
                  style={{
                    cursor: "pointer",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    backgroundColor:
                      filters.categoryId === category.category_id
                        ? "#1976d2"
                        : "#f0f0f0",
                    color:
                      filters.categoryId === category.category_id
                        ? "white"
                        : "inherit",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {category.icon && (
                    <img
                      src={category.icon}
                      alt={category.name}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "8px",
                      }}
                    />
                  )}
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {loadingProducts ? (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
          <div className="spinner-border" role="status" />
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <div className="row g-4">
          {products.length > 0 ? (
            products.map((product) => (
              <LiquorProductCard
                key={product.product_id}
                product={product}
                detailButton={false}
              />
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info" role="alert">
                No products match the current filters.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiquorAll;
