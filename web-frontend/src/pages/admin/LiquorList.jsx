import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { axiosInstance } from "../../lib/axios";
import ProductCard from "../../common/LiquorProductCard";
import LiquorCreateForm from "../../components/admin/LiquorCreateForm";

const LiquorList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        is_active: true,
        is_in_stock: true
    });
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get("/products/getAll", {
                    params: filters
                });
                setProducts(response.data.data);
            } catch (err) {
                setError(err.message || "Failed to fetch products");
                console.error("Fetch products error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, checked } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleCreateSuccess = (newProduct) => {
        setProducts([newProduct, ...products]);
        setShowCreateModal(false);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
                <div className="spinner-border" role="status" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Manage Liquors</h2>
                <Button
                    variant="primary"
                    onClick={() => setShowCreateModal(true)}
                    className="ms-2"
                >
                    Create Item
                </Button>
            </div>

            {/* Filters */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-3">Filters</h5>

                    <div className="d-flex gap-4 flex-wrap">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="is_active"
                                id="filterActive"
                                checked={filters.is_active}
                                onChange={handleFilterChange}
                            />
                            <label className="form-check-label" htmlFor="filterActive">
                                Active
                            </label>
                        </div>

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name="is_in_stock"
                                id="filterInStock"
                                checked={filters.is_in_stock}
                                onChange={handleFilterChange}
                            />
                            <label className="form-check-label" htmlFor="filterInStock">
                                In Stock
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="row g-4">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.product_id} product={product} showId={true} />
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-info text-center">
                            No products found matching your filters
                        </div>
                    </div>
                )}
            </div>

            {/* Create Product Modal */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" className="mt-5 pb-5">
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