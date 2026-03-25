import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export default function CartButton({ productId, disabled = false }) {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isInCart, setIsInCart] = useState(false);

    useEffect(() => {
        let active = true;

        const checkCartStatus = async () => {
            try {
                setChecking(true);
                const res = await axiosInstance.get(
                    `/cart/check/is-in-cart/product/${productId}`
                );

                if (!active) return;
                setIsInCart(Boolean(res.data?.data?.isItemInCart));
            } catch (error) {
                if (!active) return;
                setIsInCart(false);
            } finally {
                if (active) setChecking(false);
            }
        };

        if (productId) checkCartStatus();

        return () => {
            active = false;
        };
    }, [productId]);

    const handleAddToCart = async () => {
        if (disabled || loading) return;

        try {
            setLoading(true);
            const res = await axiosInstance.post(`/cart/add/product/${productId}`);

            setIsInCart(true);
            toast.success(res.data?.message || "Product added to cart");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.errors?.[0]?.message ||
                "Failed to add to cart";

            if (error.response?.status === 401 || error.response?.status === 403) {
                toast.error("Please log in as a user to use cart");
                navigate("/login");
                return;
            }

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoToCart = () => navigate("/cart");

    return (
        <button
            type="button"
            className={`btn btn-sm w-100 ${isInCart ? "btn-outline-warning" : "btn-warning"
                }`}
            onClick={isInCart ? handleGoToCart : handleAddToCart}
            disabled={disabled || loading || checking}
            style={{ fontWeight: 600 }}
        >
            {disabled
                ? "Unavailable"
                : checking
                    ? "Checking..."
                    : loading
                        ? "Adding..."
                        : isInCart
                            ? "Go to Cart"
                            : "Add to Cart"}
        </button>
    );
}