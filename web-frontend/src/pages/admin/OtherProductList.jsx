import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import OtherProductCard from "../../common/OtherProductCard";
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import CreateProductModal from "../../components/admin/forms/CreateProductModal";

const OtherProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [filters, setFilters] = useState({
        is_active: "",
        is_in_stock: "",
        categoryId: "",
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get("/categories/getAll");
            const activeCategories = (response.data.data || []).filter((cat) => cat.is_active && !cat.is_liquor);
            setCategories(activeCategories);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== "") queryParams.append(key, value);
            });

            const response = await axiosInstance.get(`/other-products/getAll?${queryParams.toString()}`);
            const allProducts = response.data.data || [];
            setProducts(allProducts);
        } catch (err) {
            setError(err.message || "Failed to fetch products");
            console.error("Fetch products error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleProductCreated = () => {
        fetchProducts();
        setShowCreateModal(false);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const clearCategoryFilter = () => {
        setFilters((prev) => ({ ...prev, categoryId: "" }));
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Manage Grocery Items</h2>
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                    Create Product
                </Button>
            </div>

            <CreateProductModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onProductCreated={handleProductCreated}
            />

            <div className="bg-light p-3 rounded mb-4">
                <Row className="align-items-center">
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
                    <Col md={4} className="mb-3">
                        <Form.Label>Category</Form.Label>
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
            </div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                    <div className="spinner-border" role="status" />
                </div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : products.length > 0 ? (
                <div className="row g-4">
                    {products.map((product) => (
                        <OtherProductCard key={product.product_id} product={product} showDetailButton={true} />
                    ))}
                </div>
            ) : (
                <div className="alert alert-info">No products found with selected filters.</div>
            )}
        </div>
    );
};

export default OtherProductList;
