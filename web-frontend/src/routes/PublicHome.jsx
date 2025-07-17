import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import PublicNavbar from "../components/publicNavbar";

const PublicHome = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/products/getAll");
        setProducts(response.data.data);
      } catch (err) {
        setError(err.message || "Failed to fetch products");
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
        <h2 className="mb-4">All Products</h2>
        <div className="row g-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.product_id} className="col-12 col-sm-6 col-md-4 col-lg-2">
                <div
                  className="card h-100"
                  style={{
                    opacity: product.is_active ? 1 : 0.7,
                    transition: "transform 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  {product.images?.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "contain", backgroundColor: "#f8f9fa" }}
                    />
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center bg-light"
                      style={{ height: "200px" }}
                    >
                      <small className="text-muted">No Image</small>
                    </div>
                  )}

                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title text-truncate">{product.name}</h6>
                    <p className="card-text mb-1">
                      <small className="text-muted">
                        Category: {product.category_id?.name || "Uncategorized"}
                      </small>
                    </p>
                    <p className="card-text mb-1">
                      <small>
                        Price: <strong>${product.price?.toFixed(2) || "0.00"}</strong>
                      </small>
                    </p>
                    <p className="card-text mb-2">
                      <small className="text-muted">Stock: {product.stock_quantity || 0}</small>
                    </p>

                    <div className="mb-2">
                      <span
                        className={`badge me-1 ${product.is_active ? "bg-success" : "bg-secondary"}`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                      <span
                        className={`badge ${product.is_in_stock ? "bg-primary" : "bg-warning text-dark"}`}
                      >
                        {product.is_in_stock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    <div className="mt-auto text-end">
                      <small className="text-muted">ID: {product.product_id}</small>
                    </div>
                  </div>
                </div>
              </div>
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
