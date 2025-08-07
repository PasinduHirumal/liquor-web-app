import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import OtherProductCard from "../../common/OtherProductCard";
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import CreateProductModal from "../../components/admin/forms/CreateProductModal";

const OtherProductList = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
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
    }, [filters.is_active, filters.is_in_stock]);

    useEffect(() => {
        const applyFilters = () => {
            let filtered = allProducts.filter(product => {
                // Apply category filter if selected
                if (filters.categoryId && product.category_id?.id !== filters.categoryId) {
                    return false;
                }
                return true;
            });
            setFilteredProducts(filtered);
        };

        applyFilters();
    }, [allProducts, filters.categoryId]);

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
            if (filters.is_active !== "") queryParams.append('is_active', filters.is_active);
            if (filters.is_in_stock !== "") queryParams.append('is_in_stock', filters.is_in_stock);

            const response = await axiosInstance.get(`/other-products/getAll?${queryParams.toString()}`);
            const products = response.data.data || [];
            setAllProducts(products);
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

    const handleCategoryClick = (categoryId) => {
        setFilters(prev => ({
            ...prev,
            categoryId: prev.categoryId === categoryId ? "" : categoryId
        }));
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
                <Row className="align-items-center mb-3">
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

                <div className="mt-3">
                    <div
                        className="d-flex gap-2 overflow-auto pb-2"
                        style={{ whiteSpace: "nowrap", scrollSnapType: "x mandatory" }}
                    >
                        <Button
                            variant={!filters.categoryId ? "primary" : "outline-secondary"}
                            size="md"
                            onClick={() => handleCategoryClick("")}
                            className="d-flex align-items-center"
                        >
                            All
                        </Button>

                        {categories.map(category => (
                            <Button
                                key={category.category_id}
                                variant={filters.categoryId === category.category_id ? "primary" : "outline-secondary"}
                                size="md"
                                onClick={() => handleCategoryClick(category.category_id)}
                                className="d-flex align-items-center gap-2 flex-shrink-0"
                            >
                                {category.icon && (
                                    <img
                                        src={category.icon}
                                        alt={category.name}
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                )}
                                {category.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                    <div className="spinner-border" role="status" />
                </div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : filteredProducts.length > 0 ? (
                <div className="row g-4">
                    {filteredProducts.map((product) => (
                        <OtherProductCard
                            key={product.product_id}
                            product={product}
                            adminOnly={true}
                            userOnly={false}
                        />
                    ))}
                </div>
            ) : (
                <div className="alert alert-info">No products found with selected filters.</div>
            )}
        </div>
    );
};

export default OtherProductList;