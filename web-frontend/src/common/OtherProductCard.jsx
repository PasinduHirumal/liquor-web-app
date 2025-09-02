import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RatingStars from "./RatingStars";

const OtherProductCard = ({ product, adminOnly = false, userOnly = true }) => {
    const combinedImages = React.useMemo(() => {
        const imgs = product.images ? [...product.images] : [];
        if (product.main_image && !imgs.includes(product.main_image)) {
            imgs.unshift(product.main_image);
        }
        return imgs;
    }, [product.images, product.main_image]);

    const [activeImage, setActiveImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (product.main_image) {
            setActiveImage(product.main_image);
        } else if (combinedImages.length > 0) {
            setActiveImage(combinedImages[0]);
        } else {
            setActiveImage(null);
        }
    }, [product.main_image, combinedImages]);

    const handleViewDetail = () => {
        navigate(`/other-products/${product.product_id}`);
    };

    const displayPrice =
        product.discount_percentage > 0
            ? product.selling_price
            : product.marked_price;

    return (
        <div className="col-12 col-sm-6 col-md-4 col-lg-2 mb-4">
            <div
                className="card h-100 shadow-sm border-secondary"
                style={{
                    transition: "transform 0.2s ease-in-out",
                    backgroundColor: "#0b0d17",
                    color: "#fff",
                    border: "1px solid #1c1f2b",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >

                {adminOnly && (
                    <div
                        className="header d-flex justify-content-between align-items-center px-2 py-1"
                        style={{
                            backgroundColor: "#141722",
                            borderBottom: "1px solid #1c1f2b",
                            fontSize: "0.85rem",
                            fontWeight: "bold",
                            color: "#fff",
                        }}
                    >
                        <span>
                            {product.isProfit ? (
                                <span style={{ color: "#22c55e" }}>Profit</span>
                            ) : (
                                <span style={{ color: "#ef4444" }}>No Profit</span>
                            )}
                        </span>
                        <span>
                            Profit Value:{" "}
                            <span style={{ color: "#ffb703" }}>
                                Rs: {Number(product.profit_value || 0).toFixed(2)}
                            </span>
                        </span>
                    </div>
                )}
                <div style={{ position: "relative" }}>
                    {activeImage ? (
                        <img
                            src={activeImage}
                            alt={product.name}
                            className="card-img-top p-2"
                            style={{
                                height: "200px",
                                objectFit: "contain",
                                backgroundColor: "#141722",
                                borderBottom: "1px solid #1c1f2b",
                            }}
                        />
                    ) : (
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                                height: "200px",
                                borderBottom: "1px solid #1c1f2b",
                                backgroundColor: "#141722",
                            }}
                        >
                            <small className="text-muted">No Image Available</small>
                        </div>
                    )}

                    {product.product_from && (
                        <span
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                backgroundColor: "#ffb703",
                                color: "#000",
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
                                    border:
                                        img === activeImage
                                            ? "2px solid #ffb703"
                                            : "1px solid #555",
                                    borderRadius: "3px",
                                }}
                            />
                        ))}
                    </div>
                )}

                <div className="card-body d-flex flex-column">
                    <h6 className="card-title text-truncate mb-1" style={{ color: "#fff" }}>
                        {product.name}
                    </h6>

                    <RatingStars productId={product.product_id || product.id} />

                    <p className="card-text mb-1">
                        <small style={{ color: "#9ca3af" }}>
                            Category: {product.category_id?.name || "Uncategorized"}
                        </small>
                    </p>

                    <div className="mb-1">
                        {product.discount_percentage > 0 ? (
                            <>
                                <span style={{ color: "#ef4444", fontWeight: "bold" }}>
                                    Rs: {displayPrice.toFixed(2)}
                                </span>
                                <br />
                                <span
                                    className="text-decoration-line-through"
                                    style={{ color: "#6b7280", fontSize: "0.85rem" }}
                                >
                                    Rs: {product.marked_price.toFixed(2)}
                                </span>
                                <span
                                    className="ms-2"
                                    style={{
                                        backgroundColor: "#ef4444",
                                        color: "#fff",
                                        padding: "2px 5px",
                                        borderRadius: "3px",
                                        fontSize: "0.75rem",
                                    }}
                                >
                                    {product.discount_percentage}% OFF
                                </span>
                            </>
                        ) : (
                            <span style={{ fontWeight: "bold", color: "#fff" }}>
                                Rs: {displayPrice.toFixed(2)}
                            </span>
                        )}
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <small
                            style={{
                                color:
                                    product.stock_quantity > 0 ? "#22c55e" : "#ef4444",
                                fontWeight: "bold",
                            }}
                        >
                            {product.stock_quantity > 0
                                ? `${product.stock_quantity} in stock`
                                : "Out of stock"}
                        </small>
                        <small style={{ color: "#9ca3af" }}>
                            {product.weight ? `${product.weight}g` : ""}
                        </small>
                    </div>

                    {adminOnly && (
                        <div className="mb-2">
                            <span
                                className={`badge me-1 ${product.is_active ? "bg-success" : "bg-secondary"}`}
                            >
                                {product.is_active ? "Active" : "Inactive"}
                            </span>
                            {product.is_liquor && (
                                <span className="badge bg-danger me-1">Liquor</span>
                            )}
                            <span
                                className={`badge ${product.is_in_stock
                                    ? "bg-primary"
                                    : "bg-warning text-dark"
                                    }`}
                            >
                                {product.is_in_stock ? "Available" : "Unavailable"}
                            </span>
                        </div>
                    )}

                    <div className="card-footer mt-auto text-center" style={{ background: "transparent", borderTop: "1px solid #1c1f2b" }}>
                        {adminOnly && (
                            <button
                                className="btn btn-outline-light btn-sm w-100"
                                onClick={handleViewDetail}
                            >
                                View Details
                            </button>
                        )}
                        {userOnly && (
                            <button
                                className="btn btn-warning btn-sm w-100"
                                style={{ fontWeight: "bold", color: "#000" }}
                                onClick={() => { console.log("navigate to application") }}
                            >
                                Buy Now
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtherProductCard;
