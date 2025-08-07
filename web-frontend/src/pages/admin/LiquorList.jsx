import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { axiosInstance } from "../../lib/axios";
import LiquorProductCard from "../../common/LiquorProductCard";
import LiquorCreateForm from "../../components/admin/forms/LiquorCreateForm";

const LiquorList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        is_active: "",
        is_in_stock: "",
        categoryId: "",
    });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [toggleLoading, setToggleLoading] = useState(false);

    // Helper to parse filter string to boolean or undefined
    const parseBoolFilter = (val) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return undefined;
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const categoriesResponse = await axiosInstance.get("/categories/getAll");
            const activeCategories = (categoriesResponse.data.data || []).filter(
                (cat) => cat.is_active && cat.is_liquor
            );
            setCategories(activeCategories);

            // Prepare query params with booleans
            const params = {};
            const activeFilter = parseBoolFilter(filters.is_active);
            if (activeFilter !== undefined) params.is_active = activeFilter;
            const stockFilter = parseBoolFilter(filters.is_in_stock);
            if (stockFilter !== undefined) params.is_in_stock = stockFilter;
            if (filters.categoryId !== "") params.categoryId = filters.categoryId;

            const productsResponse = await axiosInstance.get("/products/getAll", {
                params,
            });

            setProducts(productsResponse.data.data || []);
            setError(null);
        } catch (err) {
            setError(err.message || "Failed to fetch data");
            console.error("Fetch data error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [filters]);

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

    // Toggle all liquors active/inactive using your endpoint
    const handleToggleActive = async () => {
        try {
            setToggleLoading(true);
            // Calculate new toggle value: if any product inactive => activate all, else deactivate all
            const anyInactive = products.some((p) => !p.is_active);
            const newActiveValue = anyInactive;

            await axiosInstance.patch(
                "/products/update-activeToggle",
                { is_active: newActiveValue }
            );

            // Refresh products list
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
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <h2>Manage Liquors</h2>
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

            {/* Filters */}
            <div className="card mb-4">
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

                        <div className="overflow-auto d-flex flex-nowrap gap-2 py-2">
                            <Button
                                variant={!filters.categoryId ? "primary" : "outline-secondary"}
                                onClick={() => handleCategoryClick("")}
                            >
                                All
                            </Button>
                            {categories.map((category) => (
                                <Button
                                    key={category.category_id}
                                    variant={
                                        filters.categoryId === category.category_id
                                            ? "primary"
                                            : "outline-secondary"
                                    }
                                    onClick={() => handleCategoryClick(category.category_id)}
                                    className="d-flex align-items-center gap-1"
                                    style={{ flex: "0 0 auto" }}
                                >
                                    {category.icon && (
                                        <img
                                            src={category.icon}
                                            alt={category.name}
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                                borderRadius: "50%",
                                                objectFit: "contain",
                                            }}
                                        />
                                    )}
                                    {category.name}
                                </Button>
                            ))}
                        </div>
                    </Form>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "60vh" }}
                >
                    <div className="spinner-border" role="status" />
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            )}

            {/* Products */}
            {!loading && !error && (
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
                                No products found matching your filters
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
