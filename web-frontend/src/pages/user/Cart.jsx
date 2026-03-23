import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import CheckoutButton from "../../common/CheckoutButton";
import LocationPickerModal from "../../common/LocationPickerModal";
import useUserAuthStore from "../../stores/userAuthStore";

const money = (value) => `Rs: ${Number(value || 0).toFixed(2)}`;

export default function Cart() {
    const { user } = useUserAuthStore();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState("");
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addressLoading, setAddressLoading] = useState(false);
    const [showLocationPicker, setShowLocationPicker] = useState(false);

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
        if (!user?.user_id) {
            return;
        }

        try {
            setAddressLoading(true);
            const res = await axiosInstance.get(`/addresses/getAddressesByUserId/${user.user_id}`);
            const userAddresses = res.data.data || [];
            setAddresses(userAddresses);

            // Set default address: first active default address or first active address
            if (userAddresses.length > 0) {
                const defaultAddress = userAddresses.find(addr => addr.isDefault && addr.isActive) || 
                                      userAddresses.find(addr => addr.isActive) || 
                                      userAddresses[0];
                setSelectedAddress(defaultAddress);
            }
        } catch (error) {
            console.error("Error fetching addresses:", error);
            toast.error("Failed to load addresses");
        } finally {
            setAddressLoading(false);
        }
    }, [user?.user_id]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    useEffect(() => {
        if (user?.user_id) {
            fetchAddresses();
        }
    }, [fetchAddresses, user?.user_id]);

    const changeQuantity = async (cartItemId, quantity) => {
        try {
            setActionId(cartItemId);
            await axiosInstance.patch(`/cart/change/quantity/${cartItemId}`, {
                quantity,
            });

            setItems((prev) =>
                prev.map((item) =>
                    item.id === cartItemId || item.cart_item_id === cartItemId
                        ? { ...item, quantity }
                        : item
                )
            );
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update quantity");
        } finally {
            setActionId("");
        }
    };

    const removeItem = async (cartItemId) => {
        try {
            setActionId(cartItemId);
            const res = await axiosInstance.delete(`/cart/remove/${cartItemId}`);

            setItems((prev) =>
                prev.filter(
                    (item) => item.id !== cartItemId && item.cart_item_id !== cartItemId
                )
            );

            toast.success(res.data?.message || "Item removed");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove item");
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

    const handleAddressCreated = (newAddress) => {
        // Add the new address to the list
        setAddresses(prev => [...prev, newAddress]);
        // Select the newly created address
        setSelectedAddress(newAddress);
        toast.success("Address created and selected successfully!");
    };

    const subtotal = useMemo(
        () =>
            items.reduce(
                (sum, item) => sum + Number(item.unit_price || 0) * Number(item.quantity || 0),
                0
            ),
        [items]
    );

    if (loading) {
        return (
            <div className="container py-5">
                <div className="text-center text-light">Loading cart...</div>
            </div>
        );
    }

    return (
        <>
            <div
                className="container-fluid py-4"
                style={{ minHeight: "100vh", color: "#fff" }}
            >
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                    <div>
                        <h2 className="mb-1">My Cart</h2>
                        <p className="mb-0 text-secondary">{items.length} item(s)</p>
                    </div>

                    <Link to="/products" className="btn btn-outline-light btn-sm">
                        Continue Shopping
                    </Link>
                </div>

                {items.length === 0 ? (
                    <div
                        className="card border-secondary shadow-sm"
                        style={{ backgroundColor: "#141722", color: "#fff" }}
                    >
                        <div className="card-body text-center py-5">
                            <h5 className="mb-2">Your cart is empty</h5>
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

                                        return (
                                            <div
                                                key={cartItemId}
                                                className={`p-3 ${index !== items.length - 1 ? "border-bottom" : ""}`}
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
                                                                disabled={actionId === cartItemId}
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
                                                                disabled={actionId === cartItemId}
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
                                                            disabled={actionId === cartItemId}
                                                        >
                                                            {actionId === cartItemId ? "..." : "×"}
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
                                className="card border-secondary shadow-sm"
                                style={{ backgroundColor: "#141722", color: "#fff" }}
                            >
                                <div className="card-body">
                                    <h5 className="mb-3">Order Summary</h5>

                                    {/* Address Selection Section */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <label className="form-label text-secondary mb-0">
                                                <strong>Delivery Address</strong>
                                            </label>
                                            <button
                                                className="btn btn-sm btn-outline-warning"
                                                onClick={() => setShowLocationPicker(true)}
                                            >
                                                📍 Pick Location
                                            </button>
                                        </div>

                                        {addressLoading ? (
                                            <div className="text-center py-2">
                                                <div className="spinner-border spinner-border-sm text-light" />
                                                <span className="ms-2">Loading addresses...</span>
                                            </div>
                                        ) : addresses.length === 0 ? (
                                            <div className="alert alert-warning py-2">
                                                <small>
                                                    No addresses found.{" "}
                                                    <button 
                                                        className="btn btn-link btn-sm p-0 text-decoration-none"
                                                        onClick={() => setShowLocationPicker(true)}
                                                    >
                                                        Add address via map
                                                    </button>
                                                    {" or "}
                                                    <Link to="/address" className="text-decoration-none">
                                                        manage addresses
                                                    </Link>
                                                </small>
                                            </div>
                                        ) : (
                                            <>
                                                <select
                                                    className="form-select bg-dark text-light border-secondary"
                                                    value={selectedAddress?.id || ""}
                                                    onChange={(e) => {
                                                        const address = addresses.find(addr => addr.id === e.target.value);
                                                        setSelectedAddress(address);
                                                    }}
                                                >
                                                    {addresses.map((address) => (
                                                        <option key={address.id} value={address.id}>
                                                            {address.streetAddress.substring(0, 50)}...
                                                            {address.isDefault && " (Default)"}
                                                            {!address.isActive && " (Inactive)"}
                                                        </option>
                                                    ))}
                                                </select>

                                                {selectedAddress && (
                                                    <div className="mt-2 p-2 rounded" style={{ backgroundColor: "#0b0d17" }}>
                                                        <small className="text-secondary">Selected address:</small>
                                                        <p className="mb-0 small">
                                                            {selectedAddress.streetAddress}<br />
                                                            {selectedAddress.city}, {selectedAddress.state}<br />
                                                            {selectedAddress.postalCode}, {selectedAddress.country}
                                                            {selectedAddress.latitude && selectedAddress.longitude && (
                                                                <span className="text-info d-block mt-1">
                                                                    📍 Coordinates: {selectedAddress.latitude.toFixed(6)}, {selectedAddress.longitude.toFixed(6)}
                                                                </span>
                                                            )}
                                                        </p>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <hr style={{ borderColor: "#1c1f2b" }} />

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-secondary">Items</span>
                                        <span>{items.length}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-secondary">Subtotal</span>
                                        <span>{money(subtotal)}</span>
                                    </div>

                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-secondary">Delivery / Tax</span>
                                        <span>Calculated at checkout</span>
                                    </div>

                                    <hr style={{ borderColor: "#1c1f2b" }} />

                                    <div className="d-flex justify-content-between mb-3">
                                        <strong>Total</strong>
                                        <strong>{money(subtotal)}</strong>
                                    </div>

                                    <CheckoutButton
                                        addressId={selectedAddress?.id}
                                        disabled={!selectedAddress || !selectedAddress.isActive || addresses.length === 0}
                                    />

                                    {selectedAddress && !selectedAddress.isActive && (
                                        <small className="text-danger d-block mt-2 text-center">
                                            Selected address is inactive. Please choose an active address.
                                        </small>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Location Picker Modal */}
            <LocationPickerModal
                show={showLocationPicker}
                onHide={() => setShowLocationPicker(false)}
                onAddressCreated={handleAddressCreated}
            />
        </>
    );
}