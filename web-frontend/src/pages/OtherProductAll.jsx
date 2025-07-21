import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import OtherProductCard from "../common/OtherProductCard";

const OtherProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get("/other-products/getAll");
                const allProducts = response.data.data || [];
                setProducts(allProducts);
            } catch (err) {
                setError(err.message || "Failed to fetch products");
                console.error("Fetch products error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Grocery Items</h2>
            </div>

            <div className="row g-4">
                {products.length > 0 ? (
                    products.map((product) => (
                        <OtherProductCard key={product.product_id} product={product} />
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-info" role="alert">
                            No products found.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OtherProductList;
