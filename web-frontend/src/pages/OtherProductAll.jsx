import React, { useEffect, useState, useCallback } from "react";
import { axiosInstance } from "../lib/axios";
import OtherProductCard from "../common/OtherProductCard";
import { debounce } from "lodash";

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
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);

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

    // Fetch products with filters (no search)
    const fetchProductsWithFilters = async (filters) => {
        try {
            setLoadingProducts(true);
            const params = {
                is_liquor: false,
                is_active: filters.is_active === "true",
                is_in_stock: filters.is_in_stock === "true",
            };
            if (filters.categoryId) params.category_id = filters.categoryId;

            const res = await axiosInstance.get("/other-products/getAll", { params });
            setProducts(res.data.data || []);
        } catch (err) {
            setError(err.message || "Failed to fetch products");
            console.error("Product fetch error:", err);
        } finally {
            setLoadingProducts(false);
        }
    };

    // Debounced search function with multiword detection
    const debouncedSearch = useCallback(
        debounce(async (searchValue, filters) => {
            if (!searchValue.trim()) {
                fetchProductsWithFilters(filters);
                return;
            }

            try {
                setIsSearching(true);
                const isMultiWord = searchValue.trim().split(/\s+/).length > 1;

                const params = {
                    q: searchValue,
                    multiWord: isMultiWord,
                    is_liquor: false,
                    is_active: filters.is_active === "true",
                    is_in_stock: filters.is_in_stock === "true",
                };
                if (filters.categoryId) params.category_id = filters.categoryId;

                const res = await axiosInstance.get("/other-products/search/feed", { params });
                setProducts(res.data.data || []);
            } catch (err) {
                setError(err.message || "Failed to search products");
                console.error("Search error:", err);
            } finally {
                setIsSearching(false);
            }
        }, 500),
        []
    );

    // Fetch products when filters or search change
    useEffect(() => {
        if (searchTerm.trim()) {
            debouncedSearch(searchTerm, filters);
        } else {
            fetchProductsWithFilters(filters);
        }
    }, [filters, searchTerm, debouncedSearch]);

    const handleCategoryClick = (categoryId) => {
        setFilters((prev) => ({
            ...prev,
            categoryId: prev.categoryId === categoryId ? "" : categoryId,
        }));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const clearSearch = () => setSearchTerm("");

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: "#010524ff", minHeight: "100vh" }}>
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                    <h2 className="mb-0 text-white">Grocery Items</h2>

                    {/* Search Bar */}
                    <div className="mt-2 mt-md-0" style={{ maxWidth: "300px", flex: "1 1 auto" }}>
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search grocery products..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                style={{
                                    backgroundColor: "#ffffffff",
                                    color: "#000000ff",
                                    border: "1px solid #1c1f2b",
                                }}
                            />
                            {searchTerm && (
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={clearSearch}
                                    style={{ borderColor: "#1c1f2b", color: "#fff" }}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

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
                                        backgroundColor: filters.categoryId === category.category_id ? "#1976d2" : "#f0f0f0",
                                        color: filters.categoryId === category.category_id ? "white" : "inherit",
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
                                            style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover", marginRight: "8px" }}
                                        />
                                    )}
                                    <span>{category.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Search Status */}
            {searchTerm && (
                <div className="mb-3">
                    <span className="text-white">
                        Searching for: "{searchTerm}"
                        <button
                            className="btn btn-link text-white p-0 ms-2"
                            onClick={clearSearch}
                            style={{ textDecoration: "none" }}
                        >
                            <small>Clear</small>
                        </button>
                    </span>
                </div>
            )}

            {/* Products Grid */}
            {isSearching || loadingProducts ? (
                <div className="d-flex justify-content-center align-items-center text-white" style={{ minHeight: "50vh" }}>
                    <div className="spinner-border" role="status" />
                    <span className="ms-2">{isSearching ? "Searching..." : "Loading products..."}</span>
                </div>
            ) : error ? (
                <div className="alert alert-danger" role="alert">{error}</div>
            ) : (
                <div className="row g-4">
                    {products.length > 0 ? (
                        products.map((product) => <OtherProductCard key={product.product_id} product={product} />)
                    ) : (
                        <div className="col-12">
                            <div className="alert alert-info" role="alert">
                                {searchTerm
                                    ? `No products found for "${searchTerm}" with the current filters.`
                                    : "No products match the current filters."
                                }
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OtherProductAll;
