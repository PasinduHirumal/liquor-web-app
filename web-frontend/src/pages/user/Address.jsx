import { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import AddressFormModal from "../../components/user/AddressFormModal";
import { FaEdit, FaCheckCircle, FaPlusCircle } from "react-icons/fa";

const Address = () => {
    const [addresses, setAddresses] = useState([]);
    const [filteredAddresses, setFilteredAddresses] = useState([]);
    const [filter, setFilter] = useState("all"); // all | active | inactive
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
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

    useEffect(() => {
        applyFilter();
    }, [filter, addresses]);

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

    const applyFilter = () => {
        let filtered = [];
        if (filter === "active") {
            filtered = addresses.filter((addr) => addr.isActive === true);
        } else if (filter === "inactive") {
            filtered = addresses.filter((addr) => addr.isActive === false);
        } else {
            filtered = addresses;
        }
        setFilteredAddresses(filtered);
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
        setSubmitLoading(true);
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
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleEdit = (address) => {
        const { street, ...rest } = address;
        setFormData({ ...rest });
        setEditingId(address.id);
        setShowForm(true);
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

                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status" />
                                </div>
                            ) : filteredAddresses.length === 0 ? (
                                <div className="alert alert-info text-center">
                                    No addresses found for this filter.
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {filteredAddresses.map((address) => (
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
                submitLoading={submitLoading}
            />
        </div>
    );
};

export default Address;
