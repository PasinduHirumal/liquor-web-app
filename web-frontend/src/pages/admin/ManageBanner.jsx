import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import CreateBannerModal from "../../components/admin/forms/CreateBannerModal";
import DeleteBannerButton from "../../components/admin/buttons/DeleteBannerButton";

function ManageBanner() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/banners/getAll");
            setBanners(response.data.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch banners");
            setLoading(false);
            console.error("Error fetching banners:", err);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    return (
        <div className="bg-white py-4 px-md-5 px-3">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2>Manage Banners</h2>
                <button
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer"
                    }}
                    onClick={() => setShowModal(true)}
                >
                    Create Banner
                </button>
            </div>

            {loading && <p>Loading banners...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {!loading && !error && (
                <>
                    {banners.length === 0 ? (
                        <p>No banners found</p>
                    ) : (
                        <div style={{ marginTop: 20 }}>
                            <h3>Banner List ({banners.length})</h3>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                                    gap: 20
                                }}
                            >
                                {banners.map((banner) => (
                                    <div
                                        key={banner.banner_id}
                                        style={{
                                            border: "1px solid #ddd",
                                            borderRadius: 8,
                                            padding: 16,
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <div>
                                            <img
                                                src={banner.image}
                                                alt={banner.title}
                                                style={{
                                                    width: "100%",
                                                    height: "auto",
                                                    borderRadius: 4,
                                                    marginBottom: 12
                                                }}
                                            />
                                            <h4>{banner.title}</h4>
                                            <p>{banner.description}</p>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
                                                <span style={{
                                                    color: banner.isActive ? "green" : "red",
                                                    fontWeight: "bold"
                                                }}>
                                                    {banner.isActive ? "Active" : "Inactive"}
                                                </span>
                                                <span style={{
                                                    color: banner.isLiquor ? "blue" : "gray",
                                                    fontWeight: "bold"
                                                }}>
                                                    {banner.isLiquor ? "Liquor" : "Regular"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Use the DeleteBannerButton component */}
                                        <DeleteBannerButton
                                            bannerId={banner.banner_id}
                                            onDeleted={fetchBanners}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {showModal && (
                <CreateBannerModal
                    onClose={() => setShowModal(false)}
                    onCreated={fetchBanners}
                />
            )}
        </div>
    );
}

export default ManageBanner;
