import { useState, useEffect, useCallback } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { FaEdit, FaCheckCircle, FaPlusCircle } from "react-icons/fa";
import AddressFormModal from "../../components/user/AddressFormModal";
import SetActiveButton from "../../components/user/SetActiveButton";

const Address = () => {
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
        try {
            setLoading(true);

            const res = await axiosInstance.get("/addresses/myAddresses");

            setAddresses(res.data.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load addresses");
        } finally {
            setLoading(false);
        }
    }, []);

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
        setSubmitLoading(true);

        try {
            const payload = {
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
            console.error(error.response?.data || error.message);

            const errors = error.response?.data?.errors;
            if (errors?.length) {
                toast.error(errors[0].message);
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
        <div className="container-fluid mt-4">
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
                            >
                                <FaPlusCircle className="me-2" />
                                Add Address
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="card-body">

                            {/* FILTER */}
                            <div className="d-flex justify-content-end mb-3">
                                <select
                                    className="form-select w-auto"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    <option value="all">Show All</option>
                                    <option value="active">Active Only</option>
                                    <option value="inactive">Inactive Only</option>
                                </select>
                            </div>

                            {/* LOADING */}
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" />
                                </div>
                            ) : filteredAddresses.length === 0 ? (
                                <div className="alert alert-info text-center">
                                    No addresses found. Click "Add Address" to create one.
                                </div>
                            ) : (
                                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                                    <div className="row g-3">
                                        {filteredAddresses.map((address) => (
                                            <div key={address.id} className="col-md-6">
                                                <div className={`card border-${address.isActive ? "success" : "secondary"} h-100`}>
                                                    <div className="card-body">

                                                        <h5>{address.city}, {address.state}</h5>

                                                        <p className="mb-1">
                                                            {address.streetAddress}
                                                        </p>

                                                        <p className="mb-1">
                                                            {address.postalCode}, {address.country}
                                                        </p>

                                                        {address.isActive && (
                                                            <span className="badge bg-success">
                                                                <FaCheckCircle className="me-1" />
                                                                Active
                                                            </span>
                                                        )}
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
                handleClose={() => setShowForm(false)}
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