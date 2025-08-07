import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import OtherProductCard from "../common/OtherProductCard";

const OtherProductAll = () => {
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
                    (cat) => cat.is_active && !cat.is_liquor
                );
                setCategories(activeCategories);
            } catch (err) {
                setError(err.message || "Failed to fetch categories");
                console.error("Category fetch error:", err);
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
                    is_liquor: false,
                    is_active: filters.is_active === "true",
                    is_in_stock: filters.is_in_stock === "true",
                };
                if (filters.categoryId) {
                    params.category_id = filters.categoryId;
                }

                const res = await axiosInstance.get("/other-products/getAll", { params });
                setProducts(res.data.data || []);
            } catch (err) {
                setError(err.message || "Failed to fetch products");
                console.error("Product fetch error:", err);
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, [filters]);

    const handleCategoryClick = (categoryId) => {
        setFilters((prev) => ({
            ...prev,
            categoryId: prev.categoryId === categoryId ? "" : categoryId,
        }));
    };

    return (
        <div className="container-fluid py-4">
            <div className="mb-4">
                <h2 className="mb-3">Grocery Items</h2>

                {/* Category Filter */}
                {!loadingCategories && (
                    <div className="overflow-auto pb-2">
                        <div className="d-flex flex-nowrap gap-3">
                            <div
                                className={`border border-primary category-pill ${!filters.categoryId ? "active" : ""}`}
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
                                }}
                            >
                                <span>All</span>
                            </div>

                            {categories.map((category) => (
                                <div
                                    key={category.category_id}
                                    className={`border border-primary category-pill ${filters.categoryId === category.category_id ? "active" : ""}`}
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
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "50vh" }}
                >
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
                            <OtherProductCard key={product.product_id} product={product} />
                        ))
                    ) : (
                        <div className="col-12">
                            <div className="alert alert-info" role="alert">
                                No products available.
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OtherProductAll;
