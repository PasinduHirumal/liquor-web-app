import { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import AddressFormModal from "../../components/user/AddressFormModal"; // ← Import here

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
        setFormData({ ...address });
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
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h2 className="mb-0">My Addresses</h2>
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    setShowForm(true);
                                    setEditingId(null);
                                    setFormData({
                                        street: "",
                                        city: "",
                                        state: "",
                                        postalCode: "",
                                        country: "",
                                        isActive: false
                                    });
                                }}
                            >
                                Add New Address
                            </button>
                        </div>

                        <div className="card-body">
                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner-border" role="status" />
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

            {/* Modal */}
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
