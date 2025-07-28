import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";

function DriverFinancialInfo() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        bankAccountNumber: "",
        bankName: "",
        bankBranch: "",
        taxId: "",
        commissionRate: "",
        totalEarnings: "",
        currentBalance: "",
        paymentMethod: ""
    });

    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const res = await axiosInstance.get(`/drivers/getDriverById/${id}`);
                const d = res.data.data;

                setFormData({
                    bankAccountNumber: d.bankAccountNumber || "",
                    bankName: d.bankName || "",
                    bankBranch: d.bankBranch || "",
                    taxId: d.taxId || "",
                    commissionRate: d.commissionRate || "",
                    totalEarnings: d.totalEarnings || "",
                    currentBalance: d.currentBalance || "",
                    paymentMethod: d.paymentMethod || ""
                });

                setLoading(false);
            } catch (err) {
                toast.error("Failed to load financial data");
                setLoading(false);
            }
        };

        fetchDriver();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Parse numeric fields
        const numericFields = ["commissionRate", "totalEarnings", "currentBalance"];
        setFormData((prev) => ({
            ...prev,
            [name]: numericFields.includes(name) && value !== "" ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        try {
            await axiosInstance.patch(`/drivers/update-financial/${id}`, formData);
            toast.success("Financial information updated successfully");
            navigate(-1);
        } catch (err) {
            const serverErrors = err.response?.data?.errors;
            if (serverErrors) {
                setErrors(serverErrors);
                toast.error("Validation failed");
            } else {
                toast.error(err.response?.data?.message || "Update failed");
            }
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Driver Financial Information</h2>

            {errors.length > 0 && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    <ul className="list-disc ml-5">
                        {errors.map((err, idx) => (
                            <li key={idx}>
                                <strong>{err.field}:</strong> {err.message}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block font-medium text-gray-700 mb-1">Bank Account Number</label>
                    <input
                        type="text"
                        name="bankAccountNumber"
                        value={formData.bankAccountNumber}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Bank Name</label>
                    <input
                        type="text"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Bank Branch</label>
                    <input
                        type="text"
                        name="bankBranch"
                        value={formData.bankBranch}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Tax ID</label>
                    <input
                        type="text"
                        name="taxId"
                        value={formData.taxId}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                    <input
                        type="number"
                        name="commissionRate"
                        value={formData.commissionRate}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                        step="0.01"
                        min="0"
                        max="100"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Total Earnings (LKR)</label>
                    <input
                        type="number"
                        name="totalEarnings"
                        value={formData.totalEarnings}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Current Balance (LKR)</label>
                    <input
                        type="number"
                        name="currentBalance"
                        value={formData.currentBalance}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium text-gray-700 mb-1">Preferred Payment Method</label>
                    <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded"
                    >
                        <option value="">Select</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="cash">Cash</option>
                        <option value="mobile_wallet">Mobile Wallet</option>
                        <option value="digital_wallet">Digital Wallet</option>
                    </select>
                </div>

                <div className="md:col-span-2 text-right">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DriverFinancialInfo;
