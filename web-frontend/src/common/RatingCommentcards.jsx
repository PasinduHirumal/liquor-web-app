import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { FaStar, FaRegStar } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles/RatingCommentCards.css";

const RatingCommentCards = ({ productId }) => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({
        total_rating_value: 0,
        number_of_ratings: 0,
        average_rating_value: 0,
    });

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const res = await axiosInstance.get(`/ratings/getAll/product/${productId}`);
                setRatings(res.data?.data || []);
                setSummary({
                    total_rating_value: res.data?.total_rating_value || 0,
                    number_of_ratings: res.data?.number_of_ratings || 0,
                    average_rating_value: res.data?.average_rating_value || 0,
                });
            } catch (err) {
                console.error("Failed to load ratings:", err.message);
            } finally {
                setLoading(false);
            }
        };
        if (productId) fetchRatings();
    }, [productId]);

    const renderStars = (count) => {
        return Array.from({ length: 5 }, (_, i) =>
            i < count ? (
                <FaStar key={i} className="star filled" />
            ) : (
                <FaRegStar key={i} className="star" />
            )
        );
    };

    return (
        <div className="rating-comments-section mt-4">
            <h3 className="mb-3">Customer Reviews</h3>

            {/* Ratings List */}
            {loading ? (
                <Skeleton count={3} height={60} />
            ) : ratings.length > 0 ? (
                ratings.map((rating) => (
                    <div key={rating.rating_id} className="rating-card p-3 mb-3">
                        <div className="d-flex align-items-center mb-2">
                            <div className="rating-stars">{renderStars(rating.rating)}</div>
                            <span className="ms-2 text-muted small">
                                {new Date(rating.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="mb-0">{rating.comment || "No comment provided."}</p>
                        <small className="text-muted d-block">
                            By: {rating.user_id?.username || "Anonymous"}
                        </small>
                        <small className="text-muted">{rating.user_id?.email}</small>
                    </div>
                ))
            ) : (
                <p className="text-muted">No reviews yet. Be the first to leave a review!</p>
            )}
        </div>
    );
};

export default RatingCommentCards;
