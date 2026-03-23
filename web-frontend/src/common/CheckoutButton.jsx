import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

export default function CheckoutButton({ addressId, disabled }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!addressId) {
            toast.error("Please select or create an address before checkout");
            return;
        }

        if (disabled) {
            toast.error("Please select an active address before checkout");
            return;
        }

        try {
            setLoading(true);

            const res = await axiosInstance.get(`/cart/checkout/order/address/${addressId}`);

            if (res.data.success) {
                toast.success("Proceeding to checkout!");
                
                // Navigate to checkout summary with order data
                navigate("/checkout/summary", {
                    state: {
                        orderData: res.data.data,
                        addressId: addressId,
                        checkoutPreview: true
                    }
                });
            } else {
                toast.error(res.data.message || "Checkout failed");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            
            // Handle specific error cases
            if (error.response?.status === 404) {
                toast.error("Cart is empty or address not found");
            } else if (error.response?.status === 400) {
                toast.error(error.response?.data?.message || "Invalid checkout request");
            } else {
                toast.error(error.response?.data?.message || "Checkout failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className="btn btn-warning w-100"
            onClick={handleCheckout}
            disabled={loading || disabled}
            style={{ opacity: loading || disabled ? 0.7 : 1 }}
        >
            {loading ? (
                <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Processing...
                </>
            ) : (
                "Proceed to Checkout"
            )}
        </button>
    );
}