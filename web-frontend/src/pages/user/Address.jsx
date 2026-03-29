import { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { FaEdit, FaCheckCircle, FaPlusCircle, FaMapMarkerAlt } from "react-icons/fa";
import AddressFormModal from "../../components/user/AddressFormModal";
import SetActiveButton from "../../components/user/SetActiveButton";
import ClearAddressesButton from "../../components/user/ClearAddressesButton";
import useUserAuthStore from "../../stores/userAuthStore";

const Address = () => {
    const { user } = useUserAuthStore();
    const [addresses, setAddresses] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        fullName: "",
        phoneNumber: "",
        streetAddress: "",
        buildingName: "",
        landmark: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        notes: "",
        isDefault: false,
        isActive: true,
        latitude: null,
        longitude: null
    });

    /* ---------------- FETCH ---------------- */
    const fetchAddresses = useCallback(async () => {
        if (!user?.user_id) {
            console.log("No user ID available");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await axiosInstance.get(`/addresses/getAddressesByUserId/${user.user_id}`);
            setAddresses(res.data.data || []);
        } catch (error) {
            console.error("Error fetching addresses:", error);
            toast.error(error.response?.data?.message || "Failed to load addresses");
        } finally {
            setLoading(false);
        }
    }, [user?.user_id]);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    /* ---------------- FILTER ---------------- */
    const filteredAddresses = addresses.filter((addr) => {
        if (filter === "active") return addr.isActive;
        if (filter === "inactive") return !addr.isActive;
        return true;
    });

    /* ---------------- INPUT ---------------- */
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    /* ---------------- LOCATION HANDLERS ---------------- */
    const handleLatitudeChange = (e) => {
        const value = e.target.value;
        if (value === "") {
            setFormData(prev => ({ ...prev, latitude: null }));
            return;
        }
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= -90 && numValue <= 90) {
            setFormData(prev => ({ ...prev, latitude: numValue }));
        } else if (value !== "") {
            toast.error("Latitude must be between -90 and 90");
        }
    };

    const handleLongitudeChange = (e) => {
        const value = e.target.value;
        if (value === "") {
            setFormData(prev => ({ ...prev, longitude: null }));
            return;
        }
        const numValue = parseFloat(value);
        if (!isNaN(numValue) && numValue >= -180 && numValue <= 180) {
            setFormData(prev => ({ ...prev, longitude: numValue }));
        } else if (value !== "") {
            toast.error("Longitude must be between -180 and 180");
        }
    };

    /* ---------------- SUBMIT ---------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields (match backend requirements)
        if (!formData.city?.trim() || !formData.state?.trim() ||
            !formData.postalCode?.trim() || !formData.country?.trim() ||
            !formData.streetAddress?.trim()) {
            toast.error("Please fill in all required fields: City, State, Postal Code, Country, and Street Address");
            return;
        }

        // Validate phone number format if provided (matches backend pattern)
        if (formData.phoneNumber && !/^\+\d{1,3}\d{4,14}$/.test(formData.phoneNumber)) {
            toast.error("Phone number must be in international format starting with + (e.g., +947XXXXXXXX)");
            return;
        }

        // Validate latitude if provided
        if (formData.latitude !== null && formData.latitude !== "") {
            if (formData.latitude < -90 || formData.latitude > 90) {
                toast.error("Latitude must be between -90 and 90");
                return;
            }
        }

        // Validate longitude if provided
        if (formData.longitude !== null && formData.longitude !== "") {
            if (formData.longitude < -180 || formData.longitude > 180) {
                toast.error("Longitude must be between -180 and 180");
                return;
            }
        }

        setSubmitLoading(true);

        try {
            // Prepare payload matching backend expectations
            const payload = {
                fullName: formData.fullName?.trim() || "",
                phoneNumber: formData.phoneNumber?.trim() || null,
                streetAddress: formData.streetAddress.trim(),
                buildingName: formData.buildingName?.trim() || "",
                landmark: formData.landmark?.trim() || "",
                city: formData.city.trim(),
                state: formData.state.trim(),
                postalCode: formData.postalCode.trim(),
                country: formData.country.trim(),
                notes: formData.notes?.trim() || "",
                isDefault: formData.isDefault || false,
                isActive: formData.isActive !== undefined ? formData.isActive : true,
                latitude: formData.latitude !== null && formData.latitude !== "" ? parseFloat(formData.latitude) : null,
                longitude: formData.longitude !== null && formData.longitude !== "" ? parseFloat(formData.longitude) : null
            };

            if (editingId) {
                // For update, don't send userId - backend gets it from token
                await axiosInstance.patch(`/addresses/update/${editingId}`, payload);
                toast.success("Address updated successfully");
            } else {
                // For create, backend gets userId from authenticated token
                await axiosInstance.post("/addresses/createAddress", payload);
                toast.success("Address created successfully");
            }

            setShowForm(false);
            setEditingId(null);
            resetForm();
            fetchAddresses();

        } catch (error) {
            console.error("Error saving address:", error.response?.data || error.message);

            // Handle validation errors from backend
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                errors.forEach(err => toast.error(err.message));
            } else {
                toast.error(error.response?.data?.message || "Failed to save address");
            }

        } finally {
            setSubmitLoading(false);
        }
    };

    /* ---------------- EDIT ---------------- */
    const handleEdit = (address) => {
        setFormData({
            fullName: address.fullName || "",
            phoneNumber: address.phoneNumber || "",
            streetAddress: address.streetAddress || "",
            buildingName: address.buildingName || "",
            landmark: address.landmark || "",
            city: address.city || "",
            state: address.state || "",
            postalCode: address.postalCode || "",
            country: address.country || "",
            notes: address.notes || "",
            isDefault: address.isDefault || false,
            isActive: address.isActive !== undefined ? address.isActive : true,
            latitude: address.latitude || null,
            longitude: address.longitude || null
        });
        setEditingId(address.id);
        setShowForm(true);
    };

    /* ---------------- RESET ---------------- */
    const resetForm = () => {
        setFormData({
            fullName: "",
            phoneNumber: "",
            streetAddress: "",
            buildingName: "",
            landmark: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            notes: "",
            isDefault: false,
            isActive: true,
            latitude: null,
            longitude: null
        });
    };

    /* ---------------- UI ---------------- */
    return (
        <div className="container-fluid mt-4 min-h-screen">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow">

                        {/* HEADER */}
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">My Addresses</h4>
                            <div className="d-flex gap-2">
                                {addresses.length > 0 && (
                                    <ClearAddressesButton
                                        onSuccess={fetchAddresses}
                                        variant="outline-light"
                                    />
                                )}
                                <button
                                    className="btn btn-light text-primary d-flex align-items-center"
                                    onClick={() => {
                                        resetForm();
                                        setEditingId(null);
                                        setShowForm(true);
                                    }}
                                    disabled={!user?.user_id}
                                >
                                    <FaPlusCircle className="me-2" />
                                    Add Address
                                </button>
                            </div>
                        </div>

                        {/* BODY */}
                        <div className="card-body">

                            {/* FILTER */}
                            {addresses.length > 0 && (
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <select
                                        className="form-select w-auto"
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                    >
                                        <option value="all">Show All ({addresses.length})</option>
                                        <option value="active">
                                            Active Only ({addresses.filter(a => a.isActive).length})
                                        </option>
                                        <option value="inactive">
                                            Inactive Only ({addresses.filter(a => !a.isActive).length})
                                        </option>
                                    </select>
                                </div>
                            )}

                            {/* LOADING */}
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" />
                                    <p className="mt-2 text-muted">Loading addresses...</p>
                                </div>
                            ) : filteredAddresses.length === 0 ? (
                                <div className="alert alert-info text-center">
                                    <p className="mb-2">No addresses found.</p>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => {
                                            resetForm();
                                            setEditingId(null);
                                            setShowForm(true);
                                        }}
                                    >
                                        <FaPlusCircle className="me-1" />
                                        Add Your First Address
                                    </button>
                                </div>
                            ) : (
                                <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                                    <div className="row g-3">
                                        {filteredAddresses.map((address) => (
                                            <div key={address.id} className="col-md-6">
                                                <div className={`card border-${address.isActive ? "success" : "secondary"} h-100`}>
                                                    <div className="card-body">
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <h5 className="mb-0">
                                                                {address.fullName && (
                                                                    <span className="me-2">{address.fullName}</span>
                                                                )}
                                                                {address.city}, {address.state}
                                                            </h5>
                                                            <div>
                                                                {address.isDefault && (
                                                                    <span className="badge bg-info me-1">
                                                                        Default
                                                                    </span>
                                                                )}
                                                                {address.isActive && (
                                                                    <span className="badge bg-success">
                                                                        <FaCheckCircle className="me-1" />
                                                                        Active
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <p className="mb-1 text-muted">
                                                            <strong>Street:</strong> {address.streetAddress}
                                                            {address.buildingName && `, ${address.buildingName}`}
                                                            {address.landmark && ` (${address.landmark})`}
                                                        </p>

                                                        <p className="mb-1 text-muted">
                                                            <strong>Postal Code:</strong> {address.postalCode}
                                                        </p>

                                                        <p className="mb-1 text-muted">
                                                            <strong>Country:</strong> {address.country}
                                                        </p>

                                                        {address.phoneNumber && (
                                                            <p className="mb-1 text-muted">
                                                                <strong>Phone:</strong> {address.phoneNumber}
                                                            </p>
                                                        )}

                                                        {address.notes && (
                                                            <p className="mb-1 text-muted">
                                                                <strong>Notes:</strong> {address.notes}
                                                            </p>
                                                        )}

                                                        {(address.latitude || address.longitude) && (
                                                            <p className="mb-1 text-muted">
                                                                <strong>Coordinates:</strong>
                                                                {address.latitude && ` ${address.latitude.toFixed(6)}°`}
                                                                {address.latitude && address.longitude && ","}
                                                                {address.longitude && ` ${address.longitude.toFixed(6)}°`}
                                                                {!address.latitude && address.longitude && ` ${address.longitude.toFixed(6)}°`}
                                                            </p>
                                                        )}

                                                        <small className="text-muted d-block mt-2">
                                                            Created: {new Date(address.created_at).toLocaleDateString()}
                                                        </small>
                                                    </div>

                                                    <div className="card-footer d-flex justify-content-end gap-2">
                                                        <SetActiveButton
                                                            addressId={address.id}
                                                            isActive={address.isActive}
                                                            onSuccess={fetchAddresses}
                                                        />

                                                        <button
                                                            className="btn btn-outline-primary btn-sm"
                                                            onClick={() => handleEdit(address)}
                                                        >
                                                            <FaEdit className="me-1" />
                                                            Edit
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            <AddressFormModal
                show={showForm}
                handleClose={() => {
                    setShowForm(false);
                    setEditingId(null);
                    resetForm();
                }}
                handleSubmit={handleSubmit}
                handleInputChange={handleInputChange}
                handleLatitudeChange={handleLatitudeChange}
                handleLongitudeChange={handleLongitudeChange}
                formData={formData}
                editingId={editingId}
                submitLoading={submitLoading}
            />
        </div>
    );
};

export default Address;