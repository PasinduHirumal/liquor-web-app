import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";
import "../../../styles/DriverFinancialInfo.css";

function DriverFinancialInfo() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
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
        const numericFields = ["commissionRate", "totalEarnings", "currentBalance"];
        setFormData((prev) => ({
            ...prev,
            [name]: numericFields.includes(name) && value !== "" ? Number(value) : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await axiosInstance.patch(`/drivers/update-financial/${id}`, formData);
            toast.success("Financial information updated successfully");
            setTimeout(() => navigate(-1), 1000);
        } catch (err) {
            const res = err.response?.data;

            if (res?.errors && Array.isArray(res.errors)) {
                const fieldErrors = {};
                res.errors.forEach((error) => {
                    fieldErrors[error.field] = error.message;
                    toast.error(`${error.field}: ${error.message}`);
                });
            } else {
                toast.error(res?.message || "Update failed");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p className="text-center pt-4 bg-white">Loading...</p>;

    return (
        <div className="container py-5 ">
            <div className="driver-financial-container shadow-sm p-4 rounded bg-white">
                <h2 className="mb-4 text-center text-primary">Driver Financial Information</h2>

                <form onSubmit={handleSubmit} className="row g-4">
                    {[
                        { label: "Bank Account Number", name: "bankAccountNumber", type: "text" },
                        { label: "Bank Name", name: "bankName", type: "text" },
                        { label: "Bank Branch", name: "bankBranch", type: "text" },
                        { label: "Tax ID", name: "taxId", type: "text" },
                        { label: "Commission Rate (%)", name: "commissionRate", type: "number", step: "0.01" },
                        { label: "Total Earnings (LKR)", name: "totalEarnings", type: "number" },
                        { label: "Current Balance (LKR)", name: "currentBalance", type: "number" }
                    ].map(({ label, name, type, step }) => (
                        <div className="col-md-6" key={name}>
                            <label className="form-label">{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                className="form-control"
                                step={step}
                            />
                        </div>
                    ))}

                    <div className="col-md-6">
                        <label className="form-label">Preferred Payment Method</label>
                        <select
                            name="paymentMethod"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="">Select</option>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="cash">Cash</option>
                            <option value="mobile_wallet">Mobile Wallet</option>
                            <option value="digital_wallet">Digital Wallet</option>
                        </select>
                    </div>

                    <div className="form-footer mt-4 d-flex justify-content-end gap-2">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="btn btn-outline-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary driver-financial-submit-btn"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DriverFinancialInfo;
