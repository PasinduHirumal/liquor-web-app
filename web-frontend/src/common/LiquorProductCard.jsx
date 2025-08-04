import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LiquorProductCard = ({ product, detailButton = false }) => {
  const navigate = useNavigate();

  // Combine main_image + images[] without duplication
  const combinedImages = [
    ...(product.main_image ? [product.main_image] : []),
    ...(product.images || []),
  ].filter((value, index, self) => self.indexOf(value) === index); // Remove duplicates

  const [activeImage, setActiveImage] = useState(combinedImages?.[0]);

  useEffect(() => {
    setActiveImage(combinedImages?.[0]);
  }, [product]);

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
        style={{ transition: "transform 0.2s ease-in-out" }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        {/* Image Container with Origin Badge */}
        <div style={{ position: "relative" }}>
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
              style={{ height: "200px", borderBottom: "1px solid #eee" }}
            >
              <small className="text-muted">No Image Available</small>
            </div>
          )}

          {/* Origin Badge - Only show if product_from exists */}
          {product.product_from && (
            <span
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "rgba(64, 207, 59, 0.89)",
                color: "black",
                padding: "2px 6px",
                borderRadius: "4px",
                fontSize: "0.8rem",
                fontWeight: "bold",
              }}
            >
              {product.product_from.charAt(0).toUpperCase() +
                product.product_from.slice(1)}
            </span>
          )}
        </div>

        {/* Thumbnails */}
        {combinedImages.length > 1 && (
          <div className="d-flex justify-content-center gap-1 py-2 px-1 flex-wrap">
            {combinedImages.map((img, idx) => (
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

        <div className="card-body d-flex flex-column">
          <h6 className="card-title text-truncate mb-1">{product.name}</h6>

          <p className="card-text mb-1">
            <small className="text-muted">
              Category: {product.category_id?.name || "Uncategorized"}
            </small>
          </p>

          {/* Price */}
          <div className="mb-1">
            {product.discount_percentage > 0 ? (
              <>
                <span className="text-danger fw-bold me-2">
                  Rs: {product.selling_price?.toFixed(2)}
                </span> <br />
                <span className="text-decoration-line-through text-muted small">
                  Rs: {product.marked_price?.toFixed(2)}
                </span>
                <span className="badge bg-danger ms-2">
                  {product.discount_percentage}% OFF
                </span>
              </>
            ) : (
              <span className="fw-bold">Rs: {displayPrice?.toFixed(2) || "0.00"}</span>
            )}
          </div>

          {/* Stock */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small
              className={product.stock_quantity > 0 ? "text-success" : "text-danger"}
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

          {/* Badges */}
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

          {/* Button */}
          <div className="card-footer mt-auto text-center">
            {detailButton && (
              <button
                className="btn btn-primary btn-sm w-100 my-1"
                onClick={handleViewDetail}
              >
                View Details
              </button>
            )}
            <button
              className="btn btn-success btn-sm w-100"
              onClick={() => { console.log("navigate to application") }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquorProductCard;