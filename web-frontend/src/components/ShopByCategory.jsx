import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
                    params: { is_active: true, is_liquor: true },
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
            <section className="container py-5 text-center text-white">
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
            <h2 className="text-center text-white fw-bold mb-4">
                SHOP BY CATEGORY
            </h2>

            <div
                style={{
                    display: "flex",
                    overflowX: "auto",
                    gap: "1rem",
                    padding: "0 1rem",
                    scrollbarWidth: "thin",
                }}
                className="category-scroll"
            >
                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <div
                            key={cat.category_id}
                            style={{
                                flex: "0 0 auto",
                                width: "150px",
                            }}
                        >
                            <div
                                className="category-card position-relative text-center rounded shadow-sm text-white"
                                style={{
                                    backgroundImage: `url(${cat.icon})`,
                                    backgroundSize: "contain",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    height: "150px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Overlay */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        background: "rgba(0, 0, 0, 0.5)",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: "10px",
                                    }}
                                >
                                    <h5 className="mb-2">{cat.name}</h5>
                                    <Link
                                        to={`/category/${cat.category_id}`}
                                        className="btn btn-light btn-sm"
                                    >
                                        Shop Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-white">
                        No categories found
                    </p>
                )}
            </div>
        </section>
    );
};

export default ShopByCategory;
