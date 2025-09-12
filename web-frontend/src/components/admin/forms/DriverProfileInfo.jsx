import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import { ArrowLeft } from "react-bootstrap-icons";
import toast from "react-hot-toast";

const DriverProfileInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [driver, setDriver] = useState(null);
    const [warehouses, setWarehouses] = useState([]);

    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        nic_number: "",
        license_number: "",
        dateOfBirth: "",
        profileImage: "",
        address: "",
        city: "",
        emergencyContact: "",
        where_house_id: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch driver data
                const driverResponse = await axiosInstance.get(`/drivers/getDriverById/${id}`);
                const driverData = driverResponse.data.data;

                // Fetch warehouses list
                const warehousesResponse = await axiosInstance.get('/system/details');
                const warehousesData = warehousesResponse.data.data.map(wh => ({
                    ...wh,
                    id: wh.id
                }));

                setWarehouses(warehousesData);

                setDriver(driverData);
                setFormData({
                    email: driverData.email || "",
                    firstName: driverData.firstName || "",
                    lastName: driverData.lastName || "",
                    phone: driverData.phone || "",
                    nic_number: driverData.nic_number || "",
                    license_number: driverData.license_number || "",
                    dateOfBirth: driverData.dateOfBirth || "",
                    profileImage: driverData.profileImage || "",
                    address: driverData.address || "",
                    city: driverData.city || "",
                    emergencyContact: driverData.emergencyContact || "",
                    where_house_id: driverData.where_house_id?.id || ""
                });
            } catch (error) {
                toast.error("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({ ...prev, profileImage: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            await axiosInstance.patch(`/drivers/update/${id}`, formData);
            toast.success("Driver profile updated successfully");
            navigate(-1);
        } catch (error) {
            const response = error?.response?.data;

            if (response?.errors && Array.isArray(response.errors)) {
                response.errors.forEach((err) => {
                    toast.error(`${err.field}: ${err.message}`);
                });
            } else {
                toast.error(response?.message || "Failed to update driver");
            }
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!driver) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Driver not found
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-700 hover:text-gray-900 mr-4 border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                    <ArrowLeft className="mr-1" /> Back
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Driver Profile Management</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Left - Avatar and Basic Info */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="text-center">
                            <img
                                src={formData.profileImage}
                                alt="Driver profile"
                                className="rounded-full w-36 h-36 object-cover mx-auto mb-4"
                            />
                            <label className="block w-full bg-white border border-blue-500 text-blue-500 rounded py-2 px-4 text-center cursor-pointer hover:bg-blue-50 mb-4">
                                Upload New Image
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </label>
                            <h5 className="font-bold text-lg mb-2">{formData.firstName} {formData.lastName}</h5>
                            <hr className="my-4" />
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                                <input
                                    type="text"
                                    name="license_number"
                                    value={formData.license_number}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Warehouse</label>
                                <select
                                    name="where_house_id"
                                    value={formData.where_house_id}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Warehouse</option>
                                    {warehouses.map((warehouse) => (
                                        <option key={warehouse.id} value={warehouse.id}>
                                            {warehouse.where_house_name} ({warehouse.where_house_code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right - Full Form */}
                <div className="md:col-span-3">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h5 className="text-lg font-bold mb-4">Personal Information</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number</label>
                                <input
                                    type="text"
                                    name="nic_number"
                                    value={formData.nic_number}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <h5 className="text-lg font-bold mb-4 mt-6">Address Information</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <h5 className="text-lg font-bold mb-4 mt-6">Emergency Contact</h5>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                            <input
                                type="text"
                                name="emergencyContact"
                                value={formData.emergencyContact}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleUpdate}
                                disabled={updating}
                                className={`px-4 py-2 rounded text-white ${updating ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                            >
                                {updating ? "Updating..." : "Update Profile"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverProfileInfo;