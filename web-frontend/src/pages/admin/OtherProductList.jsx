import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import OtherProductCard from "../../common/OtherProductcard";
import { Button, Form, Row, Col } from "react-bootstrap";
import CreateProductModal from "../../components/admin/forms/CreateProductModal";

const OtherProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // 🟨 Filter state (no is_liquor)
    const [filters, setFilters] = useState({
        is_active: "",
        is_in_stock: "",
    });

    useEffect(() => {
        fetchProducts();
    }, [filters]);

    const fetchProducts = async () => {
        try {
            setLoading(true);

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
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Manage Other Products</h2>
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
                <Row>
                    <Col md={3}>
                        <Form.Group controlId="is_active">
                            <Form.Label>Active Status</Form.Label>
                            <Form.Select name="is_active" value={filters.is_active} onChange={handleFilterChange}>
                                <option value="">All</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
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
