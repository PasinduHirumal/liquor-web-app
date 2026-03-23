import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

export default function CheckoutButton({ addressId }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!addressId) {
            toast.error("Please select an address before checkout");
            return;
        }

        try {
            setLoading(true);

            const res = await axiosInstance.get(`/cart/checkout/order/address/${addressId}`);

            if (res.data.success) {
                toast.success("Checkout preview successful!");

                // Redirect to a checkout summary page (optional)
                navigate("/checkout/summary", {
                    state: {
                        checkoutData: res.data.data,
                    },
                });
            } else {
                toast.error(res.data.message || "Checkout failed");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error(error.response?.data?.message || "Checkout failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className="btn btn-warning w-100"
            onClick={handleCheckout}
            disabled={loading}
        >
            {loading ? "Processing..." : "Proceed to Checkout"}
        </button>
    );
}