import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const RatingStars = ({ productId }) => {
    const [ratings, setRatings] = useState({
        average: 0,
        count: 0,
    });

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const { data } = await axiosInstance.get(`/ratings/getAll/product/${productId}`);
                if (data.success) {
                    setRatings({
                        average: data.average_rating_value || 0,
                        count: data.number_of_ratings || 0,
                    });
                }
            } catch (error) {
                console.error("Error fetching ratings:", error);
            }
        };

        if (productId) fetchRatings();
    }, [productId]);

    // Render star rating
    const renderStars = (average) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (average >= i) {
                stars.push(<FaStar key={i} color="#FFD700" />);
            } else if (average >= i - 0.5) {
                stars.push(<FaStarHalfAlt key={i} color="#FFD700" />);
            } else {
                stars.push(<FaRegStar key={i} color="#FFD700" />);
            }
        }
        return stars;
    };

    return (
        <div className="mb-1">
            <div className="d-flex align-items-center gap-1">
                {renderStars(ratings.average)}
                <small style={{ color: "#9ca3af" }}>
                    {ratings.average.toFixed(1)} / 5 ({ratings.count})
                </small>
            </div>
        </div>
    );
};

export default RatingStars;
