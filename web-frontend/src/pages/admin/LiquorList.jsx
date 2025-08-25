import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { axiosInstance } from "../../lib/axios";
import LiquorProductCard from "../../common/LiquorProductCard";
import LiquorCreateForm from "../../components/admin/forms/createLiquorProductModel/LiquorCreateForm";
import { debounce } from "lodash";

const LiquorList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        is_liquor: "true",
        is_active: "",
        is_in_stock: "",
        categoryId: "",
    });
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [toggleLoading, setToggleLoading] = useState(false);

    // fetch categories & products (without search)
    const fetchProducts = async () => {
        try {
            setLoading(true);

            const categoriesResponse = await axiosInstance.get("/categories/getAll");
            const activeCategories = (categoriesResponse.data.data || []).filter(
                (cat) => cat.is_active && cat.is_liquor
            );
            setCategories(activeCategories);

            const params = {};
            if (filters.is_liquor !== "") params.is_liquor = filters.is_liquor === "true";
            if (filters.is_active !== "") params.is_active = filters.is_active === "true";
            if (filters.is_in_stock !== "") params.is_in_stock = filters.is_in_stock === "true";
            if (filters.categoryId) params.category_id = filters.categoryId;

            const productsResponse = await axiosInstance.get("/products/getAll/dashboard", { params });
            setProducts(productsResponse.data.data || []);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to fetch data");
            console.error("Fetch data error:", err);
        } finally {
            setLoading(false);
        }
    };

    // search with debounce + multiword support
    const debouncedSearch = useCallback(
        debounce(async (searchValue, filters) => {
            if (!searchValue.trim()) {
                fetchProducts();
                return;
            }
            try {
                setIsSearching(true);

                // detect multi-word
                const isMultiWord = searchValue.trim().split(/\s+/).length > 1;

                const params = {
                    q: searchValue.trim(),
                    multiWord: isMultiWord,
                    is_liquor: true,
                };
                if (filters.is_active !== "") params.is_active = filters.is_active === "true";
                if (filters.is_in_stock !== "") params.is_in_stock = filters.is_in_stock === "true";
                if (filters.categoryId) params.category_id = filters.categoryId;

                const res = await axiosInstance.get("/products/search/dashboard", { params });
                setProducts(res.data.data || []);
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

    // effect for filters & search
    useEffect(() => {
        if (searchTerm.trim()) {
            debouncedSearch(searchTerm, filters);
        } else {
            fetchProducts();
        }
    }, [filters, searchTerm, debouncedSearch]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCategoryClick = (categoryId) => {
        setFilters((prev) => ({
            ...prev,
            categoryId: prev.categoryId === categoryId ? "" : categoryId,
        }));
    };

    const handleToggleActive = async () => {
        try {
            setToggleLoading(true);
            const anyInactive = products.some((p) => !p.is_active);
            const newActiveValue = anyInactive;
            await axiosInstance.patch("/appInfo/update/toggle", { is_active: newActiveValue });
            await fetchProducts();
        } catch (err) {
            console.error("Toggle active error:", err);
            setError("Failed to toggle product active status.");
        } finally {
            setToggleLoading(false);
        }
    };

    const handleCreateSuccess = (newProduct) => {
        setProducts((prev) => [newProduct, ...prev]);
        setShowCreateModal(false);
    };

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: "#010524ff" }}>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h2 className="text-white">Manage Liquors</h2>
                <div>
                    <Button
                        variant="secondary"
                        className="me-2"
                        onClick={handleToggleActive}
                        disabled={toggleLoading}
                    >
                        {toggleLoading
                            ? "Processing..."
                            : products.some((p) => !p.is_active)
                                ? "Activate All Liquors"
                                : "Deactivate All Liquors"}
                    </Button>

                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                        Create Item
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-4" style={{ maxWidth: "400px" }}>
                <Form.Control
                    type="text"
                    placeholder="Search liquor products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Filters */}
            <div className="card mb-4 border-secondary text-white" style={{ backgroundColor: "#010524ff" }}>
                <div className="card-body">
                    <h5 className="card-title mb-3">Filters</h5>
                    <Form>
                        <Row className="g-3 mb-3">
                            <Col md={4}>
                                <Form.Group controlId="filterActive">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        name="is_active"
                                        value={filters.is_active}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">All</option>
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group controlId="filterStock">
                                    <Form.Label>Stock</Form.Label>
                                    <Form.Select
                                        name="is_in_stock"
                                        value={filters.is_in_stock}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="">All</option>
                                        <option value="true">In Stock</option>
                                        <option value="false">Out of Stock</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Categories */}
                        <div className="overflow-auto d-flex flex-nowrap gap-2 py-2 px-1">
                            <Button
                                variant={!filters.categoryId ? "primary" : "outline-primary"}
                                onClick={() => handleCategoryClick("")}
                                className="d-flex align-items-center justify-content-center px-3 py-2"
                                style={{ flex: "0 0 auto", borderRadius: "20px", fontWeight: 500, minWidth: "80px" }}
                            >
                                All
                            </Button>

                            {categories.map((category) => (
                                <Button
                                    key={category.category_id}
                                    variant={
                                        filters.categoryId === category.category_id ? "primary" : "outline-primary"
                                    }
                                    onClick={() => handleCategoryClick(category.category_id)}
                                    className="d-flex align-items-center gap-2 px-3 py-2"
                                    style={{ flex: "0 0 auto", borderRadius: "20px", fontWeight: 500, minWidth: "100px" }}
                                >
                                    {category.icon && (
                                        <img
                                            src={category.icon}
                                            alt={category.name}
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    )}
                                    <span style={{ whiteSpace: "nowrap" }}>{category.name}</span>
                                </Button>
                            ))}
                        </div>
                    </Form>
                </div>
            </div>

            {/* Loading */}
            {(loading || isSearching) && (
                <div className="d-flex justify-content-center align-items-center text-white" style={{ minHeight: "60vh" }}>
                    <div className="spinner-border" role="status" />
                    <span className="ms-2">{isSearching ? "Searching..." : "Loading..."}</span>
                </div>
            )}

            {/* Error */}
            {!loading && !isSearching && error && (
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            )}

            {/* Products */}
            {!loading && !isSearching && !error && (
                <div className="row g-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <LiquorProductCard
                                key={product.product_id}
                                product={product}
                                adminOnly={true}
                                userOnly={false}
                            />
                        ))
                    ) : (
                        <div className="col-12">
                            <div className="alert alert-info text-center">
                                {searchTerm
                                    ? `No products found for "${searchTerm}" with current filters.`
                                    : "No products found matching your filters"}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Create Modal */}
            <Modal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                size="lg"
                centered
                className="mt-5 pb-5"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create New Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LiquorCreateForm
                        onSuccess={handleCreateSuccess}
                        onCancel={() => setShowCreateModal(false)}
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default LiquorList;
