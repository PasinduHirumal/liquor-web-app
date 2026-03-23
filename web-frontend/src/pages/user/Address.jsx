import { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { FaEdit, FaCheckCircle, FaPlusCircle } from "react-icons/fa";
import AddressFormModal from "../../components/user/AddressFormModal";
import SetActiveButton from "../../components/user/SetActiveButton";
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
        city: "",
        state: "",
        postalCode: "",
        country: "",
        streetAddress: "",
        isActive: true
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

    /* ---------------- SUBMIT ---------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.city.trim() || !formData.state.trim() ||
            !formData.postalCode.trim() || !formData.country.trim() ||
            !formData.streetAddress.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        setSubmitLoading(true);

        try {
            const payload = {
                userId: user?.user_id, // Add userId for create operation
                city: formData.city.trim(),
                state: formData.state.trim(),
                postalCode: formData.postalCode.trim(),
                country: formData.country.trim(),
                streetAddress: formData.streetAddress.trim(),
                isActive: formData.isActive
            };

            if (editingId) {
                await axiosInstance.patch(`/addresses/update/${editingId}`, payload);
                toast.success("Address updated successfully");
            } else {
                await axiosInstance.post("/addresses/createAddress", payload);
                toast.success("Address created successfully");
            }

            setShowForm(false);
            setEditingId(null);
            resetForm();
            fetchAddresses();

        } catch (error) {
            console.error("Error saving address:", error.response?.data || error.message);

            const errors = error.response?.data?.errors;
            if (errors?.length) {
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
            city: address.city || "",
            state: address.state || "",
            postalCode: address.postalCode || "",
            country: address.country || "",
            streetAddress: address.streetAddress || "",
            isActive: !!address.isActive
        });
        setEditingId(address.id);
        setShowForm(true);
    };

    /* ---------------- RESET ---------------- */
    const resetForm = () => {
        setFormData({
            city: "",
            state: "",
            postalCode: "",
            country: "",
            streetAddress: "",
            isActive: true
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

                        {/* BODY */}
                        <div className="card-body">

                            {/* FILTER */}
                            {addresses.length > 0 && (
                                <div className="d-flex justify-content-end mb-3">
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
                            ) : !user?.user_id ? (
                                <div className="alert alert-warning text-center">
                                    Please log in to view your addresses.
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
                                                                {address.city}, {address.state}
                                                            </h5>
                                                            {address.isActive && (
                                                                <span className="badge bg-success">
                                                                    <FaCheckCircle className="me-1" />
                                                                    Active
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="mb-1 text-muted">
                                                            <strong>Street:</strong> {address.streetAddress}
                                                        </p>

                                                        <p className="mb-1 text-muted">
                                                            <strong>Postal Code:</strong> {address.postalCode}
                                                        </p>

                                                        <p className="mb-0 text-muted">
                                                            <strong>Country:</strong> {address.country}
                                                        </p>

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
                formData={formData}
                editingId={editingId}
                submitLoading={submitLoading}
            />
        </div>
    );
};

export default Address;