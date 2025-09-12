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
            <section className="container mx-auto py-10 text-center text-white">
                <p>Loading categories...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="container mx-auto py-10 text-center">
                <p className="text-red-500">{error}</p>
            </section>
        );
    }

    return (
        <section className="w-full bg-black py-3">
            <h2 className="text-center text-white font-bold text-2xl md:text-3xl mb-6">
                SHOP BY CATEGORY
            </h2>

            <div className="flex overflow-x-auto space-x-4 px-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <div
                            key={cat.category_id}
                            className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 max-w-32 max-h-32"
                        >
                            <div
                                className="relative rounded-lg shadow-md overflow-hidden w-full h-full flex items-center justify-center bg-center bg-contain bg-no-repeat"
                                style={{ backgroundImage: `url(${cat.icon})` }}
                            >
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center px-2">
                                    <h5 className="text-white text-xs sm:text-sm md:text-base font-semibold mb-2 line-clamp-2">
                                        {cat.name}
                                    </h5>
                                    <Link
                                        to={`/category/${cat.category_id}`}
                                        className="bg-white text-black text-[10px] sm:text-xs md:text-sm px-2 py-1 rounded hover:bg-gray-200 transition"
                                    >
                                        Shop Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-white">No categories found</p>
                )}
            </div>
        </section>
    );
};

export default ShopByCategory;
