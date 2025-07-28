import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
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
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Driver Documents</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {[
                    { label: "License Image", key: "licenseImage" },
                    { label: "NIC Image", key: "nicImage" },
                    { label: "Insurance Image", key: "insuranceImage" },
                    { label: "Registration Certificate", key: "vehicleRegistrationImage" },
                    { label: "Bank Statement Image", key: "bankStatementImage" },
                ].map(({ label, key }) => (
                    <div key={key} className="space-y-2">
                        <label className="block font-medium text-gray-700">{label}</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, key)}
                            className="border rounded px-3 py-2 w-full"
                            disabled={loading}
                        />
                        {preview[key] && (
                            <img
                                src={preview[key]}
                                alt={`${label} Preview`}
                                className="mt-2 h-40 rounded border object-contain"
                            />
                        )}
                    </div>
                ))}

                <div className="flex space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        disabled={loading}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update Documents"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DriverDocumentInfo;
