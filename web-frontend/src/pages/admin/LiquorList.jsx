import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import { axiosInstance } from "../../lib/axios";
import LiquorProductCard from "../../common/LiquorProductCard";
import LiquorCreateForm from "../../components/admin/forms/LiquorCreateForm";

const LiquorList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        is_active: true,
        is_in_stock: true,
        categoryId: "",
    });
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(true);

                const categoriesResponse = await axiosInstance.get("/categories/getAll");
                const activeCategories = (categoriesResponse.data.data || []).filter(
                    (cat) => cat.is_active && cat.is_liquor
                );
                setCategories(activeCategories);

                const params = {
                    is_active: filters.is_active,
                    is_in_stock: filters.is_in_stock,
                };
                if (filters.categoryId) {
                    params.categoryId = filters.categoryId;
                }

                const productsResponse = await axiosInstance.get("/products/getAll", {
                    params,
                });
                setProducts(productsResponse.data.data);
                setError(null);
            } catch (err) {
                setError(err.message || "Failed to fetch data");
                console.error("Fetch data error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleCreateSuccess = (newProduct) => {
        setProducts((prev) => [newProduct, ...prev]);
        setShowCreateModal(false);
    };

    const clearCategoryFilter = () => {
        setFilters((prev) => ({ ...prev, categoryId: "" }));
    };

    return (
        <div className="container-fluid py-4">
            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Manage Liquors</h2>
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                    Create Item
                </Button>
            </div>

            {/* Filters */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-3">Filters</h5>

                    <Form>
                        <Row className="align-items-center">
                            {/* Active Checkbox */}
                            <Col xs="auto" className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    id="filterActive"
                                    label="Active"
                                    name="is_active"
                                    checked={filters.is_active}
                                    onChange={handleFilterChange}
                                />
                            </Col>

                            {/* In Stock Checkbox */}
                            <Col xs="auto" className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    id="filterInStock"
                                    label="In Stock"
                                    name="is_in_stock"
                                    checked={filters.is_in_stock}
                                    onChange={handleFilterChange}
                                />
                            </Col>

                            {/* Category Select with Clear Button */}
                            <Col xs={12} sm={4} md={3} className="mb-3">
                                <InputGroup>
                                    <Form.Select
                                        name="categoryId"
                                        value={filters.categoryId}
                                        onChange={handleFilterChange}
                                        aria-label="Category Filter"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category.category_id} value={category.category_id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {filters.categoryId && (
                                        <Button
                                            variant="outline-secondary"
                                            onClick={clearCategoryFilter}
                                            aria-label="Clear category filter"
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </InputGroup>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "60vh" }}
                >
                    <div className="spinner-border" role="status" />
                </div>
            )}

            {/* Error State */}
            {!loading && error && (
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            )}

            {/* Product Grid */}
            {!loading && !error && (
                <div className="row g-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <LiquorProductCard
                                key={product.product_id}
                                product={product}
                                detailButton={true}
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
                        categories={categories}
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default LiquorList;
