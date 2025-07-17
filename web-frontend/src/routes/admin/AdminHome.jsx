import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";

const AdminHome = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        is_active: true,
        is_in_stock: true
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/products/getAll', {
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

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    if (loading) return <div className="text-center mt-5 fs-4">Loading products...</div>;
    if (error) return <div className="container-fluid mt-4">Error: {error}</div>;

    return (
        <div className="container-fluid mt-4">
            <h1 className="mb-4">Product Management</h1>

            {/* Filter Controls */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Filters</h5>
                    <div className="form-check form-switch mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="activeFilter"
                            checked={filters.is_active}
                            onChange={(e) => handleFilterChange('is_active', e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="activeFilter">
                            Show Active Products Only
                        </label>
                    </div>
                    <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="stockFilter"
                            checked={filters.is_in_stock}
                            onChange={(e) => handleFilterChange('is_in_stock', e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="stockFilter">
                            Show In-Stock Products Only
                        </label>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product.product_id} className="col">
                            <div className={`card h-100 ${!product.is_active ? 'opacity-75' : ''}`}>
                                {/* Product Image */}
                                {product.images && product.images.length > 0 ? (
                                    <img
                                        src={product.images[0]}
                                        className="card-img-top object-fit-contain"
                                        alt={product.name}
                                        style={{ height: '200px' }}
                                    />
                                ) : (
                                    <div
                                        className="bg-light d-flex align-items-center justify-content-center"
                                        style={{ height: '200px' }}
                                    >
                                        <span className="text-muted">No Image</span>
                                    </div>
                                )}

                                <div className="card-body">
                                    <h5 className="card-title">{product.name}</h5>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Category:</span>
                                        <span>{product.category_id?.name || 'Uncategorized'}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Price:</span>
                                        <span className="fw-bold">${product.price?.toFixed(2) || '0.00'}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-muted">Stock:</span>
                                        <span>{product.stock_quantity || 0}</span>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className={`badge ${product.is_active ? 'bg-success' : 'bg-secondary'}`}>
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className={`badge ${product.is_in_stock ? 'bg-primary' : 'bg-warning'}`}>
                                            {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>
                                </div>

                                <div className="card-footer bg-transparent">
                                    <small className="text-muted">ID: {product.product_id}</small>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-info text-center">
                            No products found matching your filters
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminHome;