import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import ProductCard from "../../common/LiquorProductCard";

const LiquorList = () => {
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

    const handleFilterChange = (filterName, value) => {
        const parsedValue = value === "true";
        if (filters[filterName] === parsedValue) return;

        setFilters((prev) => ({
            ...prev,
            [filterName]: parsedValue
        }));
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
            <h2 className="mb-4">Manage Liquors</h2>

            {/* Filters */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Filters</h5>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="activeFilter" className="form-label">Product Status</label>
                            <select
                                className="form-select"
                                id="activeFilter"
                                value={filters.is_active.toString()}
                                onChange={(e) => handleFilterChange("is_active", e.target.value)}
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="stockFilter" className="form-label">Stock Availability</label>
                            <select
                                className="form-select"
                                id="stockFilter"
                                value={filters.is_in_stock.toString()}
                                onChange={(e) => handleFilterChange("is_in_stock", e.target.value)}
                            >
                                <option value="true">In Stock</option>
                                <option value="false">Sold Out</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="row g-4">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.product_id} product={product} />
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

export default LiquorList;
