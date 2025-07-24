import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import OtherProductCard from "../common/OtherProductCard";

const OtherProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category_id: "",
        is_liquor: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsRes, categoriesRes] = await Promise.all([
                    axiosInstance.get("/other-products/getAll"),
                    axiosInstance.get("/categories/getAll"),
                ]);

                const allProducts = productsRes.data.data || [];
                const activeCategories = (categoriesRes.data.data || []).filter(
                    (cat) => cat.is_active && !cat.is_liquor
                );

                setProducts(allProducts);
                setCategories(activeCategories);
            } catch (err) {
                setError(err.message || "Failed to fetch data");
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            let filtered = [...products];

            filtered = filtered.filter((product) => {
                return (
                    (filters.is_liquor === undefined || product.is_liquor === filters.is_liquor) &&
                    (!filters.category_id || product.category_id?.id === filters.category_id)
                );
            });

            setFilteredProducts(filtered);
        };

        applyFilters();
    }, [products, filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
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
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                <h2 className="mb-0">Grocery Items</h2>

                <div className="d-flex gap-3 align-items-center flex-wrap mt-2 mt-sm-0">
                    {/* Category Filter */}
                    <div className="form-group">
                        <select
                            name="category_id"
                            value={filters.category_id}
                            onChange={handleFilterChange}
                            className="form-select form-select-sm"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.category_id} value={category.category_id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <OtherProductCard key={product.product_id} product={product} />
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-info" role="alert">
                            No products match the current filters.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OtherProductList;
