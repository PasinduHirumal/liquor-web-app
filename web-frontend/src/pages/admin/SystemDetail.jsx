import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";

const SystemDetail = () => {
    const [companyDetail, setCompanyDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCompanyDetail = async () => {
            try {
                const res = await axiosInstance.get("/system/details");
                setCompanyDetail(res.data.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch system details");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyDetail();
    }, []);

    if (loading) return <p>Loading system details...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: "24px" }}>
            <h1>System Details</h1>
            <div
                style={{
                    border: "1px solid #ccc",
                    padding: "20px",
                    borderRadius: "10px",
                    maxWidth: "600px",
                    background: "#f9f9f9"
                }}
            >
                <p>
                    <strong>Warehouse Location:</strong><br />
                    Latitude: {companyDetail?.where_house_location?.lat ?? "N/A"}<br />
                    Longitude: {companyDetail?.where_house_location?.lng ?? "N/A"}
                </p>
                <p>
                    <strong>Delivery Charge per 1KM:</strong>{" "}
                    {companyDetail?.delivery_charge_for_1KM ?? "N/A"}
                </p>
                <p>
                    <strong>Service Charge:</strong>{" "}
                    {companyDetail?.service_charge ?? "N/A"}
                </p>
                <p>
                    <strong>Created At:</strong>{" "}
                    {companyDetail?.created_at
                        ? new Date(companyDetail.created_at).toLocaleString()
                        : "N/A"}
                </p>
                <p>
                    <strong>Updated At:</strong>{" "}
                    {companyDetail?.updated_at
                        ? new Date(companyDetail.updated_at).toLocaleString()
                        : "N/A"}
                </p>
            </div>
        </div>
    );
};

export default SystemDetail;
