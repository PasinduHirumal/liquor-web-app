import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

const DriverAccountStatus = ({ driverId, onClose, onUpdateSuccess }) => {
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        role: "driver",
        isAvailable: false,
        isActive: false,
        isOnline: false,
        isDocumentVerified: false,
        isAccountVerified: false,
        backgroundCheckStatus: "pending",
    });

    // Fetch Account & Status data on mount
    useEffect(() => {
        const fetchAccountStatus = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axiosInstance.get(`/drivers/getDriverById/${driverId}`);
                const data = response.data.data;

                setFormData({
                    role: data.role || "driver",
                    isAvailable: data.isAvailable ?? false,
                    isActive: data.isActive ?? false,
                    isOnline: data.isOnline ?? false,
                    isDocumentVerified: data.isDocumentVerified ?? false,
                    isAccountVerified: data.isAccountVerified ?? false,
                    backgroundCheckStatus: data.backgroundCheckStatus || "pending",
                });
            } catch (err) {
                setError(
                    err?.response?.data?.message || "Failed to load account and status information"
                );
            } finally {
                setLoading(false);
            }
        };

        if (driverId) {
            fetchAccountStatus();
        }
    }, [driverId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === "checkbox" ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: finalValue,
        }));
    };

    const handleUpdate = async () => {
        setUpdating(true);
        setError(null);

        try {
            const payload = {
                isActive: formData.isActive,
                isAvailable: formData.isAvailable,
                isAccountVerified: formData.isAccountVerified,
                isDocumentVerified: formData.isDocumentVerified,
                backgroundCheckStatus: formData.backgroundCheckStatus,
            };

            const response = await axiosInstance.patch(
                `/drivers/update-qualifications/${driverId}`,
                payload
            );

            const updatedDriver = response?.data?.data;

            toast.success("Account & Status updated successfully");

            if (onUpdateSuccess) {
                onUpdateSuccess({
                    isActive: updatedDriver?.isActive ?? formData.isActive,
                    isAvailable: updatedDriver?.isAvailable ?? formData.isAvailable,
                    isOnline: formData.isOnline,
                    isDocumentVerified:
                        updatedDriver?.isDocumentVerified ?? formData.isDocumentVerified,
                    isAccountVerified:
                        updatedDriver?.isAccountVerified ?? formData.isAccountVerified,
                    backgroundCheckStatus:
                        updatedDriver?.backgroundCheckStatus ?? formData.backgroundCheckStatus,
                });
            }

            if (onClose) {
                onClose();
            }
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.errors?.[0]?.message ||
                "Failed to update Account & Status";
            setError(msg);
            toast.error(msg);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center my-6">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 text-red-700 p-3 rounded-md my-3 text-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="p-4">
            <h5 className="mb-4 font-semibold text-lg">Account & Status</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role */}
                <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        disabled
                        className="w-full border rounded-md px-3 py-2 text-sm bg-gray-100 cursor-not-allowed"
                    >
                        <option value="driver">Driver</option>
                    </select>
                </div>

                {/* Background Check */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Background Check Status
                    </label>
                    <select
                        name="backgroundCheckStatus"
                        value={formData.backgroundCheckStatus}
                        onChange={handleChange}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                    >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isAccountVerified"
                        checked={formData.isAccountVerified}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                    />
                    <label className="text-sm">Account Verified</label>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isAvailable"
                        checked={formData.isAvailable}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                    />
                    <label className="text-sm">Is Available</label>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                    />
                    <label className="text-sm">Is Active</label>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isOnline"
                        checked={formData.isOnline}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                    />
                    <label className="text-sm">Is Online</label>
                </div>

                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isDocumentVerified"
                        checked={formData.isDocumentVerified}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                    />
                    <label className="text-sm">Document Verified</label>
                </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end mt-6">
                <button
                    onClick={handleUpdate}
                    disabled={updating}
                    className={`px-4 py-2 rounded text-white text-sm font-medium transition ${updating
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {updating ? "Updating..." : "Update Account & Status"}
                </button>
            </div>
        </div>
    );
};

export default DriverAccountStatus;