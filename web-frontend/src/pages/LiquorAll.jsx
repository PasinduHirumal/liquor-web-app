import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import LiquorProductCard from "../common/LiquorProductCard";
import { Button } from "react-bootstrap";

const LiquorAll = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    is_active: "true",
    is_in_stock: "true",
    categoryId: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const params = {
        is_liquor: true,
        is_active: filters.is_active === "true",
        is_in_stock: filters.is_in_stock === "true"
      };

      if (filters.categoryId) {
        params.category_id = filters.categoryId;
      }

      const [productsRes, categoriesRes] = await Promise.all([
        axiosInstance.get("/products/getAll", { params }),
        axiosInstance.get("/categories/getAll"),
      ]);

      setProducts(productsRes.data.data || []);
      const activeCategories = (categoriesRes.data.data || []).filter(
        cat => cat.is_active && cat.is_liquor
      );
      setCategories(activeCategories);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleCategoryClick = (categoryId) => {
    setFilters(prev => ({
      ...prev,
      categoryId: prev.categoryId === categoryId ? "" : categoryId,
    }));
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
      <div className="mb-4">
        <h2 className="mb-3">Liquor Products</h2>


        {/* Category Filter */}
        <div
          className="d-flex flex-nowrap overflow-auto py-2 gap-2"
          style={{ scrollbarWidth: 'thin' }}
        >
          <Button
            variant={!filters.categoryId ? "primary" : "outline-secondary"}
            onClick={() => handleCategoryClick("")}
            className="flex-shrink-0"
          >
            All
          </Button>

          {categories.map((category) => (
            <Button
              key={category.category_id}
              variant={
                filters.categoryId === category.category_id
                  ? "primary"
                  : "outline-secondary"
              }
              onClick={() => handleCategoryClick(category.category_id)}
              className="d-flex align-items-center gap-2 flex-shrink-0"
            >
              {category.icon && (
                <img
                  src={category.icon}
                  alt={category.name}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              )}
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
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
    </div>
  );
};

export default LiquorAll;