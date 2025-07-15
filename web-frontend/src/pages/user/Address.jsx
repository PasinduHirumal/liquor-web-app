import { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import AddressFormModal from "../../components/user/AddressFormModal";
import { FaEdit, FaCheckCircle, FaPlusCircle } from "react-icons/fa";

const Address = () => {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
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
        } catch (error) {
            console.error("Error fetching addresses:", error);
            toast.error("Failed to load addresses");
        } finally {
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
                await axiosInstance.patch(`/addresses/update/${editingId}`, formData);
                toast.success("Address updated successfully");
            } else {
                await axiosInstance.post("/addresses/createAddress", formData);
                toast.success("Address created successfully");
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({
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
        const { street, ...rest } = address;
        setFormData({ ...rest });
        setEditingId(address.id);
        setShowForm(true);
    };

    const handleSetDefault = async (addressId) => {
        try {
            await Promise.all(
                addresses.map(addr =>
                    axiosInstance.patch(`/addresses/update/${addr.id}`, { isActive: false })
                )
            );
            await axiosInstance.patch(`/addresses/update/${addressId}`, { isActive: true });
            toast.success("Default address updated");
            fetchAddresses();
        } catch (error) {
            console.error("Error setting default address:", error);
            toast.error("Failed to set default address");
        }
    };

    return (
        <div className="container mt-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">My Addresses</h4>
                            <button
                                className="btn btn-light text-primary d-flex align-items-center"
                                onClick={() => {
                                    setShowForm(true);
                                    setEditingId(null);
                                    setFormData({
                                        city: "",
                                        state: "",
                                        postalCode: "",
                                        country: "",
                                        isActive: false
                                    });
                                }}
                            >
                                <FaPlusCircle className="me-2" />
                                Add Address
                            </button>
                        </div>

                        <div className="card-body">
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status" />
                                </div>
                            ) : addresses.length === 0 ? (
                                <div className="alert alert-info text-center">
                                    You don't have any saved addresses. Add one using the button above.
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {addresses.map((address) => (
                                        <div key={address.id} className="col-md-6">
                                            <div className={`card border-${address.isActive ? "success" : "secondary"} h-100`}>
                                                <div className="card-body">
                                                    <h5 className="card-title">
                                                        {address.city}, {address.state}
                                                    </h5>
                                                    <p className="card-text mb-1">
                                                        {address.postalCode}, {address.country}
                                                    </p>
                                                    {address.isActive && (
                                                        <span className="badge bg-success">
                                                            <FaCheckCircle className="me-1" /> Default
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="card-footer bg-light d-flex justify-content-end gap-2">
                                                    {!address.isActive && (
                                                        <button
                                                            className="btn btn-outline-success btn-sm"
                                                            onClick={() => handleSetDefault(address.id)}
                                                        >
                                                            Set as Default
                                                        </button>
                                                    )}
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
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AddressFormModal
                show={showForm}
                handleClose={() => setShowForm(false)}
                handleSubmit={handleSubmit}
                handleInputChange={handleInputChange}
                formData={formData}
                editingId={editingId}
            />
        </div>
    );
};

export default Address;
