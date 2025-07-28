import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import "../../../styles/DriverDocumentInfo.css"
import toast from "react-hot-toast";

function DriverDocumentInfo() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        licenseImage: null,
        nicImage: null,
        insuranceImage: null,
        vehicleRegistrationImage: null,
        bankStatementImage: null,
    });

    const [preview, setPreview] = useState({
        licenseImage: "",
        nicImage: "",
        insuranceImage: "",
        vehicleRegistrationImage: "",
        bankStatementImage: "",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDriverDocuments = async () => {
            try {
                const res = await axiosInstance.get(`/drivers/getDriverById/${id}`);
                const documents = res.data?.data?.documents || {};

                setPreview({
                    licenseImage: documents.licenseImage || "",
                    nicImage: documents.nicImage || "",
                    insuranceImage: documents.insuranceImage || "",
                    vehicleRegistrationImage: documents.vehicleRegistrationImage || "",
                    bankStatementImage: documents.bankStatementImage || "",
                });
            } catch (err) {
                console.error("Failed to fetch driver documents:", err);
                toast.error("Failed to fetch existing documents.");
            }
        };

        fetchDriverDocuments();
    }, [id]);

    const handleFileChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [fieldName]: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(prev => ({ ...prev, [fieldName]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (key) => {
        setFormData(prev => ({ ...prev, [key]: null }));
        setPreview(prev => ({ ...prev, [key]: "" }));
    };

    const toBase64 = file =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = err => reject(err);
        });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const documentsPayload = {};

            for (const key of Object.keys(formData)) {
                if (formData[key]) {
                    documentsPayload[key] = await toBase64(formData[key]);
                } else if (preview[key]) {
                    documentsPayload[key] = preview[key];
                }
            }

            if (Object.keys(documentsPayload).length === 0) {
                toast.error("Please select or confirm at least one document to update.");
                setLoading(false);
                return;
            }

            await axiosInstance.patch(`/drivers/update-document/${id}`, {
                documents: documentsPayload
            });

            toast.success("Documents updated successfully!");
            navigate(-1);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update documents.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="document-form-container">
            <div className="document-form-header">
                <h2 className="document-form-title">Update Driver Documents</h2>
                <p className="document-form-subtitle">Upload or update the required documents for this driver</p>
            </div>

            <form onSubmit={handleSubmit} className="document-form">
                {[
                    { label: "Driver's License", key: "licenseImage" },
                    { label: "National ID Card", key: "nicImage" },
                    { label: "Vehicle Insurance", key: "insuranceImage" },
                    { label: "Registration Certificate", key: "vehicleRegistrationImage" },
                    { label: "Bank Statement", key: "bankStatementImage" },
                ].map(({ label, key }) => (
                    <div key={key} className="document-form-group">
                        <label className="document-form-label">
                            {label}
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => handleFileChange(e, key)}
                                className="document-form-input"
                                disabled={loading}
                            />
                            <span className="document-form-file-cta">Choose file</span>
                        </label>

                        {preview[key] && (
                            <div className="document-preview-container">
                                <div className="document-preview">
                                    <img
                                        src={preview[key]}
                                        alt={`${label} Preview`}
                                        className="document-preview-image"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(key)}
                                        className="document-preview-remove"
                                        title="Remove Image"
                                        disabled={loading}
                                    >
                                        &times;
                                    </button>
                                </div>
                                <p className="document-preview-text">Current {label.toLowerCase()}</p>
                            </div>
                        )}
                    </div>
                ))}

                <div className="document-form-actions">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        disabled={loading}
                        className="document-form-button document-form-button--secondary"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="document-form-button document-form-button--primary"
                    >
                        {loading ? (
                            <>
                                <span className="document-form-button-spinner"></span>
                                Updating...
                            </>
                        ) : (
                            "Update Documents"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DriverDocumentInfo;