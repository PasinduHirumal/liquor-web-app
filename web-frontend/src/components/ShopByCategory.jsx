import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const ShopByCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const res = await axiosInstance.get("/categories/getAll", {
                    params: { is_active: true },
                });
                if (res.data?.success) {
                    setCategories(res.data.data);
                } else {
                    setError("Failed to fetch categories");
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError("Error fetching categories");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="container py-5 text-center">
                <p>Loading categories...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="container py-5 text-center">
                <p className="text-danger">{error}</p>
            </section>
        );
    }

    return (
        <section className="container-fluid py-4 bg-black">
            <h2 className="text-center text-white fw-bold mb-4">SHOP BY CATEGORY</h2>
            <div className="row g-4">
                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <div className="col-md-4" key={cat.category_id}>
                            <div
                                className="category-card position-relative text-center rounded shadow-sm"
                                style={{
                                    backgroundColor: "#f4f4f4",
                                    height: "200px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                    borderRadius: "10px",
                                }}
                            >
                                <img
                                    src={cat.icon || "/images/placeholder.jpg"}
                                    alt={cat.name}
                                    style={{
                                        width: "150px",
                                        height: "150px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                />
                                <div
                                    className="overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
                                    style={{
                                        background: "rgba(0, 0, 0, 0.5)",
                                        opacity: 0,
                                        transition: "opacity 0.3s ease",
                                        color: "#fff",
                                    }}
                                >
                                    <h5 className="mb-2">{cat.name}</h5>
                                    <a
                                        href={`/category/${cat.category_id}`}
                                        className="btn btn-light btn-sm"
                                    >
                                        Shop Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">No categories found</p>
                )}
            </div>

            {/* Hover effect */}
            <style>
                {`
                    .category-card:hover .overlay {
                        opacity: 1;
                    }
                `}
            </style>
        </section>
    );
};

export default ShopByCategory;
