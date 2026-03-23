import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import GoogleLocationPicker from "../../common/GoogleLocationPicker";

const money = (value) => `Rs: ${Number(value || 0).toFixed(2)}`;

export default function Cart() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [fetchingAddresses, setFetchingAddresses] = useState(false);
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [customLocation, setCustomLocation] = useState(null);
    const [isCreatingAddress, setIsCreatingAddress] = useState(false);

    const fetchCart = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/cart/my");
            setItems(Array.isArray(res.data?.data) ? res.data.data : []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load cart");
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAddresses = useCallback(async () => {
        try {
            setFetchingAddresses(true);
            const res = await axiosInstance.get("/address/my");
            setAddresses(Array.isArray(res.data?.data) ? res.data.data : []);
        } catch (error) {
            console.error("Failed to fetch addresses:", error);
            setAddresses([]);
        } finally {
            setFetchingAddresses(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
        fetchAddresses();
    }, [fetchCart, fetchAddresses]);

    const changeQuantity = async (cartItemId, quantity) => {
        try {
            setActionId(cartItemId);
            await axiosInstance.patch(`/cart/change/quantity/${cartItemId}`, {
                quantity,
            });

            setItems((prev) =>
                prev.map((item) => {
                    const itemId = item.id || item.cart_item_id;
                    return itemId === cartItemId
                        ? { ...item, quantity }
                        : item;
                })
            );
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update quantity");
            fetchCart();
        } finally {
            setActionId("");
        }
    };

    const removeItem = async (cartItemId) => {
        try {
            setActionId(cartItemId);
            await axiosInstance.delete(`/cart/remove/${cartItemId}`);

            setItems((prev) =>
                prev.filter((item) => {
                    const itemId = item.id || item.cart_item_id;
                    return itemId !== cartItemId;
                })
            );

            toast.success("Item removed from cart");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove item");
            fetchCart();
        } finally {
            setActionId("");
        }
    };

    const handleDecrease = (item) => {
        const cartItemId = item.id || item.cart_item_id;
        const nextQty = Number(item.quantity || 0) - 1;

        if (nextQty <= 0) {
            removeItem(cartItemId);
            return;
        }

        changeQuantity(cartItemId, nextQty);
    };

    const handleIncrease = (item) => {
        const cartItemId = item.id || item.cart_item_id;
        changeQuantity(cartItemId, Number(item.quantity || 0) + 1);
    };

    const createAddressFromLocation = async (locationData) => {
        try {
            setIsCreatingAddress(true);
            // Prompt for address details
            const addressName = prompt("Enter a name for this address (e.g., Home, Office):");
            if (!addressName) {
                toast.error("Address name is required");
                return false;
            }

            const additionalInfo = prompt("Additional details (apartment, floor, etc.):");

            const addressPayload = {
                name: addressName,
                street: locationData.address,
                city: locationData.address.split(",")[1]?.trim() || "Unknown",
                country: "Sri Lanka",
                latitude: locationData.lat,
                longitude: locationData.lng,
                additional_info: additionalInfo || "",
            };

            const response = await axiosInstance.post("/address", addressPayload);
            
            if (response.data?.success) {
                toast.success("Address saved successfully!");
                await fetchAddresses(); // Refresh addresses list
                setSelectedAddressId(response.data.data.id);
                setCustomLocation(null);
                setShowLocationPicker(false);
                return true;
            } else {
                toast.error("Failed to save address");
                return false;
            }
        } catch (error) {
            console.error("Error creating address:", error);
            toast.error(error.response?.data?.message || "Failed to save address");
            return false;
        } finally {
            setIsCreatingAddress(false);
        }
    };

    const handleLocationSelect = async (location) => {
        if (!location || !location.address) {
            toast.error("Please select a valid location");
            return;
        }

        const saved = await createAddressFromLocation(location);
        if (saved) {
            // Automatically proceed to checkout after address is created
            setTimeout(() => handleCheckout(), 500);
        }
    };

    const handleCheckout = async () => {
        if (!selectedAddressId) {
            setShowAddressModal(true);
            return;
        }

        try {
            setCheckoutLoading(true);
            const response = await axiosInstance.get(
                `/cart/checkout/order/address/${selectedAddressId}`
            );

            if (response.data?.success) {
                toast.success("Checkout successful!");
                navigate("/orders", {
                    state: {
                        checkoutData: response.data.data,
                        message: "Order placed successfully!"
                    }
                });
            } else {
                toast.error(response.data?.message || "Checkout failed");
            }
        } catch (error) {
            console.error("Checkout error:", error);

            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors).join(", ");
                toast.error(errorMessages);
            } else {
                toast.error("Failed to process checkout. Please try again.");
            }

            if (error.response?.status === 404 || error.response?.status === 400) {
                fetchCart();
            }
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handleAddressSelect = (addressId) => {
        setSelectedAddressId(addressId);
        setShowAddressModal(false);
        setTimeout(() => handleCheckout(), 100);
    };

    const subtotal = useMemo(
        () =>
            items.reduce(
                (sum, item) =>
                    sum + Number(item.unit_price || 0) * Number(item.quantity || 0),
                0
            ),
        [items]
    );

    const itemCount = items.length;

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center text-light">
                    <div className="spinner-border text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="container-fluid py-4"
            style={{ minHeight: "100vh", color: "#fff", backgroundColor: "#0a0c12" }}
        >
            <div className="container">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                    <div>
                        <h2 className="mb-1">My Cart</h2>
                        <p className="mb-0 text-secondary">
                            {itemCount} item{itemCount !== 1 ? "s" : ""}
                        </p>
                    </div>

                    <Link to="/products" className="btn btn-outline-light btn-sm">
                        ← Continue Shopping
                    </Link>
                </div>

                {itemCount === 0 ? (
                    <div
                        className="card border-secondary shadow-sm"
                        style={{ backgroundColor: "#141722", color: "#fff" }}
                    >
                        <div className="card-body text-center py-5">
                            <i className="bi bi-cart-x" style={{ fontSize: "4rem" }}></i>
                            <h5 className="mb-2 mt-3">Your cart is empty</h5>
                            <p className="text-secondary mb-3">
                                Add some products and they will appear here.
                            </p>
                            <Link to="/products" className="btn btn-warning">
                                Browse Products
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        <div className="col-12 col-lg-8">
                            <div
                                className="card border-secondary shadow-sm"
                                style={{ backgroundColor: "#141722", color: "#fff" }}
                            >
                                <div className="card-body p-0">
                                    {items.map((item, index) => {
                                        const cartItemId = item.id || item.cart_item_id;
                                        const quantity = Number(item.quantity || 0);
                                        const unitPrice = Number(item.unit_price || 0);
                                        const itemTotal = quantity * unitPrice;
                                        const isActionLoading = actionId === cartItemId;

                                        return (
                                            <div
                                                key={cartItemId}
                                                className={`p-3 ${index !== 0 ? "border-top" : ""}`}
                                                style={{ borderColor: "#1c1f2b" }}
                                            >
                                                <div className="row align-items-center g-3">
                                                    <div className="col-12 col-md-2">
                                                        <img
                                                            src={item.productImage || "/placeholder.png"}
                                                            alt={item.productName}
                                                            className="img-fluid rounded"
                                                            style={{
                                                                width: "100%",
                                                                maxHeight: "90px",
                                                                objectFit: "contain",
                                                                background: "#0b0d17",
                                                                border: "1px solid #1c1f2b",
                                                                padding: "6px",
                                                            }}
                                                            onError={(e) => {
                                                                e.target.src = "/placeholder.png";
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="col-12 col-md-4">
                                                        <h6 className="mb-1">{item.productName}</h6>
                                                        <small className="text-secondary">
                                                            Unit Price: {money(unitPrice)}
                                                        </small>
                                                    </div>

                                                    <div className="col-12 col-md-3">
                                                        <div className="d-inline-flex align-items-center border rounded overflow-hidden">
                                                            <button
                                                                className="btn btn-sm btn-outline-light rounded-0"
                                                                onClick={() => handleDecrease(item)}
                                                                disabled={isActionLoading}
                                                            >
                                                                -
                                                            </button>

                                                            <span
                                                                className="px-3 d-inline-flex align-items-center justify-content-center"
                                                                style={{ minWidth: "48px" }}
                                                            >
                                                                {quantity}
                                                            </span>

                                                            <button
                                                                className="btn btn-sm btn-outline-light rounded-0"
                                                                onClick={() => handleIncrease(item)}
                                                                disabled={isActionLoading}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="col-8 col-md-2 text-md-end">
                                                        <strong>{money(itemTotal)}</strong>
                                                    </div>

                                                    <div className="col-4 col-md-1 text-end">
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => removeItem(cartItemId)}
                                                            disabled={isActionLoading}
                                                        >
                                                            {isActionLoading ? "..." : "×"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-4">
                            <div
                                className="card border-secondary shadow-sm sticky-top"
                                style={{
                                    backgroundColor: "#141722",
                                    color: "#fff",
                                    top: "20px"
                                }}
                            >
                                <div className="card-body">
                                    <h5 className="mb-3">Order Summary</h5>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-secondary">Items</span>
                                        <span>{itemCount}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-secondary">Subtotal</span>
                                        <span>{money(subtotal)}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-secondary">Delivery Fee</span>
                                        <span>Calculated at checkout</span>
                                    </div>

                                    <hr style={{ borderColor: "#1c1f2b" }} />

                                    <div className="d-flex justify-content-between mb-4">
                                        <strong>Total</strong>
                                        <strong>{money(subtotal)}</strong>
                                    </div>

                                    {selectedAddressId && (
                                        <div className="alert alert-info alert-sm mb-3 p-2 small">
                                            <i className="bi bi-geo-alt-fill me-1"></i>
                                            Delivery address selected
                                            <button
                                                className="btn btn-link btn-sm p-0 ms-2"
                                                onClick={() => setShowAddressModal(true)}
                                                style={{ textDecoration: "none" }}
                                            >
                                                Change
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        className="btn btn-warning w-100"
                                        onClick={handleCheckout}
                                        disabled={checkoutLoading || itemCount === 0}
                                    >
                                        {checkoutLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            "Proceed to Checkout"
                                        )}
                                    </button>

                                    {!selectedAddressId && (
                                        <small className="text-secondary d-block text-center mt-2">
                                            Please select a delivery address to proceed
                                        </small>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Address Selection Modal */}
            {showAddressModal && (
                <div
                    className="modal show d-block py-5"
                    style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
                    tabIndex="-1"
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div
                            className="modal-content"
                            style={{ backgroundColor: "#141722", color: "#fff" }}
                        >
                            <div className="modal-header border-secondary">
                                <h5 className="modal-title">Select Delivery Address</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowAddressModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {!showLocationPicker ? (
                                    <>
                                        <div className="mb-3">
                                            <button
                                                className="btn btn-warning w-100"
                                                onClick={() => setShowLocationPicker(true)}
                                            >
                                                <i className="bi bi-geo-alt me-2"></i>
                                                Use Live Location Picker
                                            </button>
                                        </div>
                                        
                                        <hr className="border-secondary" />
                                        
                                        <h6 className="mb-3">Or select from saved addresses:</h6>
                                        
                                        {fetchingAddresses ? (
                                            <div className="text-center py-3">
                                                <div className="spinner-border spinner-border-sm text-warning"></div>
                                                <p className="mt-2">Loading addresses...</p>
                                            </div>
                                        ) : addresses.length === 0 ? (
                                            <div className="text-center py-3">
                                                <p className="mb-3">No saved addresses found</p>
                                            </div>
                                        ) : (
                                            <div className="list-group">
                                                {addresses.map((address) => (
                                                    <button
                                                        key={address.id}
                                                        className={`list-group-item list-group-item-action ${selectedAddressId === address.id ? "active" : ""
                                                            }`}
                                                        onClick={() => handleAddressSelect(address.id)}
                                                        style={{
                                                            backgroundColor: selectedAddressId === address.id ? "#ffc107" : "#1c1f2b",
                                                            color: selectedAddressId === address.id ? "#000" : "#fff",
                                                            borderColor: "#2c2f3b"
                                                        }}
                                                    >
                                                        <div className="d-flex w-100 justify-content-between">
                                                            <h6 className="mb-1">{address.name || "Delivery Address"}</h6>
                                                            {selectedAddressId === address.id && (
                                                                <i className="bi bi-check-circle-fill"></i>
                                                            )}
                                                        </div>
                                                        <p className="mb-1 small">
                                                            {address.street}, {address.city}
                                                        </p>
                                                        <small>
                                                            {address.postal_code && `${address.postal_code}, `}
                                                            {address.country}
                                                        </small>
                                                        {address.latitude && address.longitude && (
                                                            <small className="d-block text-secondary mt-1">
                                                                📍 Coordinates selected
                                                            </small>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="btn btn-outline-secondary mb-3"
                                            onClick={() => setShowLocationPicker(false)}
                                        >
                                            ← Back to Addresses
                                        </button>
                                        <GoogleLocationPicker
                                            onSelect={handleLocationSelect}
                                            onClose={() => setShowLocationPicker(false)}
                                        />
                                        {isCreatingAddress && (
                                            <div className="text-center mt-3">
                                                <div className="spinner-border spinner-border-sm text-warning"></div>
                                                <p className="mt-2">Saving address...</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="modal-footer border-secondary">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowAddressModal(false);
                                        setShowLocationPicker(false);
                                    }}
                                >
                                    Cancel
                                </button>
                                {!showLocationPicker && (
                                    <Link
                                        to="/address"
                                        className="btn btn-outline-warning"
                                    >
                                        + Manage Addresses
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}