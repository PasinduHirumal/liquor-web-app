import { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const Address = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        isActive: false
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get("/addresses/myAddresses");
            setAddresses(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching addresses:", error);
            toast.error("Failed to load addresses");
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Update existing address
                await axiosInstance.patch(`/addresses/update/${editingId}`, formData);
                toast.success("Address updated successfully");
            } else {
                // Create new address
                await axiosInstance.post("/addresses/createAddress", formData);
                toast.success("Address created successfully");
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({
                street: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
                isActive: false
            });
            fetchAddresses();
        } catch (error) {
            console.error("Error saving address:", error);
            toast.error(error.response?.data?.message || "Failed to save address");
        }
    };

    const handleEdit = (address) => {
        setFormData({
            street: address.street,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            isActive: address.isActive
        });
        setEditingId(address.id);
        setShowForm(true);
    };

    const handleSetDefault = async (addressId) => {
        try {
            // First set all addresses to inactive
            await Promise.all(
                addresses.map(addr =>
                    axiosInstance.patch(`/addresses/update/${addr.id}`, { isActive: false })
                )
            );

            // Then set the selected address to active
            await axiosInstance.patch(`/addresses/update/${addressId}`, { isActive: true });

            toast.success("Default address updated");
            fetchAddresses();
        } catch (error) {
            console.error("Error setting default address:", error);
            toast.error("Failed to set default address");
        }
    };

    const handleDelete = async (addressId) => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            try {
                // Note: Your backend doesn't have a delete endpoint in the provided code
                // You would need to implement this in your backend
                await axiosInstance.delete(`/addresses/${addressId}`);
                toast.success("Address deleted successfully");
                fetchAddresses();
            } catch (error) {
                console.error("Error deleting address:", error);
                toast.error("Failed to delete address");
            }
        }
    };

    return (
        <div className="container mt-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h2 className="mb-0">My Addresses</h2>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setShowForm(!showForm);
                                    if (showForm) {
                                        setEditingId(null);
                                        setFormData({
                                            street: "",
                                            city: "",
                                            state: "",
                                            postalCode: "",
                                            country: "",
                                            isActive: false
                                        });
                                    }
                                }}
                            >
                                {showForm ? "Cancel" : "Add New Address"}
                            </button>
                        </div>

                        <div className="card-body">
                            {showForm && (
                                <form onSubmit={handleSubmit} className="mb-4">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Street</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="street"
                                                value={formData.street}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">City</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">State/Province</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Postal Code</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Country</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-12">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    name="isActive"
                                                    checked={formData.isActive}
                                                    onChange={handleInputChange}
                                                    id="isActive"
                                                />
                                                <label className="form-check-label" htmlFor="isActive">
                                                    Set as default shipping address
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-primary">
                                                {editingId ? "Update Address" : "Save Address"}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : addresses.length === 0 ? (
                                <div className="alert alert-info">
                                    You don't have any saved addresses. Add one above.
                                </div>
                            ) : (
                                <div className="list-group">
                                    {addresses.map((address) => (
                                        <div
                                            key={address.id}
                                            className={`list-group-item ${address.isActive ? 'active' : ''}`}
                                        >
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h5>
                                                        {address.street}, {address.city}, {address.state} {address.postalCode}, {address.country}
                                                    </h5>
                                                    {address.isActive && (
                                                        <span className="badge bg-success">Default</span>
                                                    )}
                                                </div>
                                                <div className="btn-group">
                                                    {!address.isActive && (
                                                        <button
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={() => handleSetDefault(address.id)}
                                                        >
                                                            Set as Default
                                                        </button>
                                                    )}
                                                    <button
                                                        className="btn btn-sm btn-outline-primary"
                                                        onClick={() => handleEdit(address)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(address.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Address;