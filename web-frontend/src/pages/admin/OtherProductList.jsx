import React, { useEffect, useState, useCallback } from "react";
import { axiosInstance } from "../../lib/axios";
import OtherProductCard from "../../common/OtherProductCard";
import { Button, Form, Row, Col } from "react-bootstrap";
import CreateProductModal from "../../components/admin/forms/createOtherProductModel/CreateProductModal";
import { debounce } from "lodash";

const OtherProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [filters, setFilters] = useState({
        is_active: "",
        is_in_stock: "",
        category_id: "",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Fetch categories on mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch products whenever filters change (or search term)
    useEffect(() => {
        if (searchTerm.trim()) {
            debouncedSearch(searchTerm, filters);
        } else {
            fetchProducts();
        }
    }, [filters, searchTerm]);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get("/categories/getAll");
            const activeCategories = (response.data.data || []).filter(
                (cat) => cat.is_active && !cat.is_liquor
            );
            setCategories(activeCategories);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = {};
            if (filters.is_active !== "") params.is_active = filters.is_active;
            if (filters.is_in_stock !== "") params.is_in_stock = filters.is_in_stock;
            if (filters.category_id) params.category_id = filters.category_id;

            const response = await axiosInstance.get("/other-products/getAll/dashboard", { params });
            setProducts(response.data.data || []);
        } catch (err) {
            setError(err.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    // Debounced search with multi-word support
    const debouncedSearch = useCallback(
        debounce(async (query, filters) => {
            try {
                setIsSearching(true);

                // detect if multi-word
                const isMultiWord = query.trim().split(/\s+/).length > 1;

                const params = {
                    q: query.trim(),
                    multiWord: isMultiWord,
                };
                if (filters.is_active !== "") params.is_active = filters.is_active;
                if (filters.is_in_stock !== "") params.is_in_stock = filters.is_in_stock;
                if (filters.category_id) params.category_id = filters.category_id;

                const response = await axiosInstance.get(
                    "/other-products/search/dashboard",
                    { params }
                );

                setProducts(response.data.data || []);
                setError(null);
            } catch (err) {
                console.error("Search error:", err);
                setError(err.message || "Failed to search products");
            } finally {
                setIsSearching(false);
            }
        }, 500),
        []
    );

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryClick = (categoryId) => {
        setFilters((prev) => ({
            ...prev,
            category_id: prev.category_id === categoryId ? "" : categoryId,
        }));
    };

    const handleProductCreated = () => {
        fetchProducts();
        setShowCreateModal(false);
    };

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: "#010524ff" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0 text-white">Manage Grocery Items</h2>
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                    Create Product
                </Button>
            </div>

            <CreateProductModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onProductCreated={handleProductCreated}
            />

            {/* Search Bar */}
            <div className="mb-3" style={{ maxWidth: "400px" }}>
                <Form.Control
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filters */}
            <div className="p-3 rounded mb-4 border" style={{ backgroundColor: "#010524ff" }}>
                <Row className="align-items-center mb-3 text-white">
                    <Col md={3} className="mb-3">
                        <Form.Group controlId="is_active">
                            <Form.Label>Active Status</Form.Label>
                            <Form.Select name="is_active" value={filters.is_active} onChange={handleFilterChange}>
                                <option value="">All</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3} className="mb-3">
                        <Form.Group controlId="is_in_stock">
                            <Form.Label>Stock Status</Form.Label>
                            <Form.Select name="is_in_stock" value={filters.is_in_stock} onChange={handleFilterChange}>
                                <option value="">All</option>
                                <option value="true">In Stock</option>
                                <option value="false">Out of Stock</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Categories */}
                <div className="mt-3 d-flex gap-2 overflow-auto pb-2" style={{ whiteSpace: "nowrap" }}>
                    <div
                        className={`category-pill ${!filters.category_id ? "active" : ""}`}
                        onClick={() => handleCategoryClick("")}
                        style={{
                            cursor: "pointer",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            backgroundColor: !filters.category_id ? "#1976d2" : "#f0f0f0",
                            color: !filters.category_id ? "white" : "inherit",
                            flexShrink: 0,
                        }}
                    >
                        All
                    </div>
                    {categories.map((category) => (
                        <div
                            key={category.category_id}
                            className={`category-pill ${filters.category_id === category.category_id ? "active" : ""}`}
                            onClick={() => handleCategoryClick(category.category_id)}
                            style={{
                                cursor: "pointer",
                                padding: "8px 16px",
                                borderRadius: "20px",
                                backgroundColor: filters.category_id === category.category_id ? "#1976d2" : "#f0f0f0",
                                color: filters.category_id === category.category_id ? "white" : "inherit",
                                flexShrink: 0,
                            }}
                        >
                            {category.icon && <img src={category.icon} alt={category.name} style={{ width: "20px", height: "20px", borderRadius: "50%", marginRight: "8px" }} />}
                            {category.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Products */}
            {(loading || isSearching) ? (
                <div className="d-flex justify-content-center align-items-center text-white" style={{ minHeight: "60vh" }}>
                    <div className="spinner-border" role="status" />
                    <span className="ms-2">{isSearching ? "Searching..." : "Loading..."}</span>
                </div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : products.length > 0 ? (
                <div className="row g-4">
                    {products.map((product) => (
                        <OtherProductCard key={product.product_id} product={product} adminOnly={true} userOnly={false} />
                    ))}
                </div>
            ) : (
                <div className="alert alert-info">No products found with selected filters or search.</div>
            )}
        </div>
    );
};

export default OtherProductList;
