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

    const handleCategoryClick = (categoryId) => {
        setFilters(prev => ({
            ...prev,
            categoryId: prev.categoryId === categoryId ? "" : categoryId
        }));
    };

    const handleCreateSuccess = (newProduct) => {
        setProducts((prev) => [newProduct, ...prev]);
        setShowCreateModal(false);
    };

    return (
        <div className="container-fluid py-4">
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
                        <Row className="align-items-center mb-3">
                            <Col xs="auto">
                                <Form.Check
                                    type="checkbox"
                                    id="filterActive"
                                    label="Active"
                                    name="is_active"
                                    checked={filters.is_active}
                                    onChange={handleFilterChange}
                                />
                            </Col>

                            <Col xs="auto">
                                <Form.Check
                                    type="checkbox"
                                    id="filterInStock"
                                    label="In Stock"
                                    name="is_in_stock"
                                    checked={filters.is_in_stock}
                                    onChange={handleFilterChange}
                                />
                            </Col>
                        </Row>

                        <div className="overflow-auto d-flex flex-nowrap gap-2 py-2" style={{ whiteSpace: "nowrap" }}>
                            <Button
                                variant={!filters.categoryId ? "primary" : "outline-secondary"}
                                size="md"
                                onClick={() => handleCategoryClick("")}
                                className="d-flex align-items-center"
                            >
                                All
                            </Button>

                            {categories.map((category) => (
                                <Button
                                    key={category.category_id}
                                    variant={filters.categoryId === category.category_id ? "primary" : "outline-secondary"}
                                    size="md"
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
                                                objectFit: "cover"
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
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default LiquorList;