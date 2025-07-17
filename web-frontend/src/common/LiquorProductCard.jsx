import React from "react";

const ProductCard = ({ product, showId = false }) => {
  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-2">
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
            <span className={`badge me-1 ${product.is_active ? "bg-success" : "bg-secondary"}`}>
              {product.is_active ? "Active" : "Inactive"}
            </span>
            <span
              className={`badge ${product.is_in_stock ? "bg-primary" : "bg-warning text-dark"}`}
            >
              {product.is_in_stock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {showId && (
            <div className="mt-auto text-end">
              <small className="text-muted">ID: {product.product_id}</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
