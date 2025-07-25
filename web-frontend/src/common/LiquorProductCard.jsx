import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LiquorProductCard = ({ product, detailButton = false }) => {
  const [activeImage, setActiveImage] = useState(product.images?.[0]);
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/products/${product.product_id || product.id}`);
  };

  const displayPrice =
    product.discount_percentage > 0
      ? product.selling_price
      : product.marked_price || product.price;

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4">
      <div
        className="card h-100 shadow-sm"
        style={{
          transition: "transform 0.2s ease-in-out"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {/* Main Image */}
        {activeImage ? (
          <img
            src={activeImage}
            alt={product.name}
            className="card-img-top p-2"
            style={{
              height: "200px",
              objectFit: "contain",
              backgroundColor: "#f8f9fa",
              borderBottom: "1px solid #eee",
            }}
          />
        ) : (
          <div
            className="d-flex justify-content-center align-items-center bg-light"
            style={{
              height: "200px",
              borderBottom: "1px solid #eee",
            }}
          >
            <small className="text-muted">No Image Available</small>
          </div>
        )}

        {/* Thumbnails */}
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
                  border:
                    img === activeImage
                      ? "2px solid #007bff"
                      : "1px solid #ccc",
                  borderRadius: "3px",
                }}
              />
            ))}
          </div>
        )}

        {/* Product Details */}
        <div className="card-body d-flex flex-column">
          <h6 className="card-title text-truncate mb-1">{product.name}</h6>

          <p className="card-text mb-1">
            <small className="text-muted">
              Category: {product.category_id?.name || "Uncategorized"}
            </small>
          </p>

          {/* Price Display */}
          <div className="mb-1">
            {product.discount_percentage > 0 ? (
              <>
                <span className="text-danger fw-bold me-2">
                  ${product.selling_price?.toFixed(2)}
                </span>
                <span className="text-decoration-line-through text-muted small">
                  ${product.marked_price?.toFixed(2)}
                </span>
                <span className="badge bg-danger ms-2">
                  {product.discount_percentage}% OFF
                </span>
              </>
            ) : (
              <span className="fw-bold">
                ${displayPrice?.toFixed(2) || "0.00"}
              </span>
            )}
          </div>

          {/* Stock Info */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small
              className={
                product.stock_quantity > 0 ? "text-success" : "text-danger"
              }
            >
              <strong>
                {product.stock_quantity > 0
                  ? `${product.stock_quantity} in stock`
                  : "Out of stock"}
              </strong>
            </small>
            <small className="text-muted">
              {product.volume ? `${product.volume}ml` : ""}
            </small>
          </div>

          {/* Status Badges */}
          <div className="mb-2">
            <span
              className={`badge me-1 ${product.is_active ? "bg-success" : "bg-secondary"
                }`}
            >
              {product.is_active ? "Active" : "Inactive"}
            </span>
            <span
              className={`badge ${product.is_in_stock ? "bg-primary" : "bg-warning text-dark"
                }`}
            >
              {product.is_in_stock ? "Available" : "Unavailable"}
            </span>
          </div>

          {/* Detail Button */}
          {detailButton && (
            <div className="card-footer mt-auto text-center">
              <button
                className="btn btn-primary btn-sm w-100"
                onClick={handleViewDetail}
              >
                View Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiquorProductCard;
