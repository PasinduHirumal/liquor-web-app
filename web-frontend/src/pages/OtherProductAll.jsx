import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import OtherProductCard from "../common/OtherProductCard";

const OtherProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

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
                    !selectedCategory ||
                    product.category_id?.id === selectedCategory
                );
            });

            setFilteredProducts(filtered);
        };

        applyFilters();
    }, [products, selectedCategory]);

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
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
            <div className="mb-4">
                <h2 className="mb-3">Grocery Items</h2>

                <div className="d-flex flex-wrap gap-3 align-items-center">
                    <div
                        className={`category-pill ${!selectedCategory ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(null)}
                        style={{
                            cursor: 'pointer',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            backgroundColor: !selectedCategory ? '#1976d2' : '#f0f0f0',
                            color: !selectedCategory ? 'white' : 'inherit',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <span>All</span>
                    </div>

                    {categories.map(category => (
                        <div
                            key={category.category_id}
                            className={`category-pill ${selectedCategory === category.category_id ? 'active' : ''}`}
                            onClick={() => handleCategoryClick(category.category_id)}
                            style={{
                                cursor: 'pointer',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                backgroundColor: selectedCategory === category.category_id ? '#1976d2' : '#f0f0f0',
                                color: selectedCategory === category.category_id ? 'white' : 'inherit',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {category.icon && (
                                <img
                                    src={category.icon}
                                    alt={category.name}
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        objectFit: 'cover'
                                    }}
                                />
                            )}
                            <span>{category.name}</span>
                        </div>
                    ))}
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