import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import LiquorProductCard from "../common/LiquorProductCard";

const CategoryProducts = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch category details
                const categoryRes = await axiosInstance.get(`/categories/${id}`);
                if (categoryRes.data?.success) {
                    setCategory(categoryRes.data.data);
                }

                // Fetch all products for this category
                const productsRes = await axiosInstance.get(`/products/getAll?category_id=${id}`);
                if (productsRes.data?.success) {
                    setProducts(productsRes.data.data);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error("Error fetching category products:", err);
                setError("Failed to load products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-light">Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5 text-center text-danger">
                <p>{error}</p>
                <button className="btn btn-warning" onClick={() => navigate('/products')}>
                    Browse All Products
                </button>
            </div>
        );
    }

    return (
        <div className="container py-4" style={{ minHeight: "70vh" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-light mb-0">
                    {category?.name || "Category"} Products
                    {category?.description && (
                        <small className="d-block text-muted mt-1">{category.description}</small>
                    )}
                </h2>
                <button 
                    className="btn btn-outline-light btn-sm"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
            </div>

            {products.length > 0 ? (
                <div className="row g-3">
                    {products.map((product) => (
                        <div key={product.product_id || product.id} className="col-md-4 col-lg-3">
                            <LiquorProductCard 
                                product={product}
                                adminOnly={false}
                                userOnly={true}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-5">
                    <div className="card bg-dark text-light border-secondary">
                        <div className="card-body">
                            <h5 className="card-title">No Products Found</h5>
                            <p className="card-text">
                                There are currently no products available in this category.
                            </p>
                            <button 
                                className="btn btn-warning"
                                onClick={() => navigate(-1)}
                            >
                                Browse All Products
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryProducts;
