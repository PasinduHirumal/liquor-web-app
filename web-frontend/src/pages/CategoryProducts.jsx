import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import LiquorProductCard from "../common/LiquorProductCard";

const CategoryProducts = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);

    const [loadingCategory, setLoadingCategory] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const [errorCategory, setErrorCategory] = useState(null);
    const [errorProducts, setErrorProducts] = useState(null);

    useEffect(() => {
        // Fetch all categories and find the current one
        const fetchCategory = async () => {
            try {
                setLoadingCategory(true);
                const res = await axiosInstance.get("/categories/getAll", {
                    params: { is_active: true }
                });

                if (res.data?.success) {
                    const cat = res.data.data.find(c => c.category_id === id);
                    if (cat) {
                        setCategory(cat);
                    } else {
                        setErrorCategory("Category not found");
                    }
                } else {
                    setErrorCategory("Failed to load category details.");
                }
            } catch (err) {
                console.error("Error fetching category:", err);
                setErrorCategory("Error loading category details.");
            } finally {
                setLoadingCategory(false);
            }
        };

        // Fetch products for this category
        const fetchProducts = async () => {
            try {
                setLoadingProducts(true);
                const res = await axiosInstance.get(`/products/getAll`, {
                    params: { category_id: id }
                });
                if (res.data?.success && res.data.data) {
                    setProducts(res.data.data);
                    if (res.data.data.length === 0) {
                        setErrorProducts("No products found for this category.");
                    }
                } else {
                    setProducts([]);
                    setErrorProducts("No products found for this category.");
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                setErrorProducts("Error loading products.");
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchCategory();
        fetchProducts();
    }, [id]);

    // Loading state
    if (loadingCategory || loadingProducts) {
        return (
            <div className="text-center" style={{ backgroundColor: "#010524ff", minHeight: "100vh", paddingTop: "20vh" }}>
                <div className="spinner-border text-white" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-light">Loading category and products...</p>
            </div>
        );
    }

    // Category fetch error
    if (errorCategory) {
        return (
            <div className="pt-5 text-center text-danger" style={{ backgroundColor: "#010524ff", minHeight: "100vh", paddingTop: "20vh" }}>
                <p>{errorCategory}</p>
                <button className="btn btn-warning" onClick={() => navigate("/")}>
                    Browse All Products
                </button>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: "#010524ff", minHeight: "100vh" }}>
            <div className="d-flex align-items-center mb-4 gap-4">
                <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
                <h2 className="text-light mb-0">
                    {category?.name || "Category"} Products
                </h2>
            </div>

            {errorProducts ? (
                <div className="text-center py-5">
                    <div className="card bg-dark text-light border-secondary">
                        <div className="card-body">
                            <h5 className="card-title">No Products Found</h5>
                            <p className="card-text">{errorProducts}</p>
                            <button
                                className="btn btn-warning"
                                onClick={() => navigate("/")}
                            >
                                Browse All Products
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row g-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <LiquorProductCard
                                key={product.product_id}
                                product={product}
                                detailButton={false}
                            />
                        ))
                    ) : (
                        <div className="col-12">
                            <div className="alert alert-info" role="alert">
                                No products found for this category.
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryProducts;
