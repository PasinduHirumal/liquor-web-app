import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LiquorProductCard = ({ product, DetaiButton = false }) => {
  const [activeImage, setActiveImage] = useState(product.images?.[0]);
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/products/${product.product_id || product.id}`);
  };

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
      <div
        className="card h-100"
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {activeImage ? (
          <img
            src={activeImage}
            alt={product.name}
            className="card-img-top"
            style={{
              height: "200px",
              objectFit: "contain",
              backgroundColor: "#f8f9fa",
            }}
          />
        ) : (
          <div
            className="d-flex justify-content-center align-items-center bg-light"
            style={{ height: "200px" }}
          >
            <small className="text-muted">No Image</small>
          </div>
        )}

        {/* Thumbnail previews */}
        {product.images?.length > 1 && (
          <div className="d-flex justify-content-center gap-1 py-2 px-1 flex-wrap">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setActiveImage(img)}
                style={{
                  width: "30px",
                  height: "30px",
                  objectFit: "cover",
                  cursor: "pointer",
                  border: img === activeImage ? "2px solid #007bff" : "1px solid #ccc",
                  borderRadius: "3px",
                }}
              />
            ))}
          </div>
        )}

        <div className="card-body d-flex flex-column border-top">
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

          <div className="mb-3">
            <span className={`badge me-1 ${product.is_active ? "bg-success" : "bg-secondary"}`}>
              {product.is_active ? "Active" : "Inactive"}
            </span>
            <span
              className={`badge ${product.is_in_stock ? "bg-primary" : "bg-warning text-dark"}`}
            >
              {product.is_in_stock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {DetaiButton && (
            <div className="card-footer mt-auto text-center justify-content-center">
              <button className="btn btn-primary btn-sm w-100" onClick={handleViewDetail}>
                View Detail
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiquorProductCard;
