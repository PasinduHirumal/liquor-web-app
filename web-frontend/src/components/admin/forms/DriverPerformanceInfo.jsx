import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios"
import toast from "react-hot-toast";

function DriverPerformanceInfo() {
    const { id } = useParams();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        rating: 0,
        totalRatings: 0,
        totalDeliveries: 0,
        completedDeliveries: 0,
        cancelledDeliveries: 0,
        averageDeliveryTime: 0,
        onTimeDeliveryRate: 0,
        ordersHistory: [],
    });
    const [ordersHistoryInput, setOrdersHistoryInput] = useState("");

    useEffect(() => {
        const fetchDriver = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`/drivers/getDriverById/${id}`);
                if (response.data.success) {
                    const data = response.data.data;
                    setFormData({
                        rating: data.rating ?? 0,
                        totalRatings: data.totalRatings ?? 0,
                        totalDeliveries: data.totalDeliveries ?? 0,
                        completedDeliveries: data.completedDeliveries ?? 0,
                        cancelledDeliveries: data.cancelledDeliveries ?? 0,
                        averageDeliveryTime: data.averageDeliveryTime ?? 0,
                        onTimeDeliveryRate: data.onTimeDeliveryRate ?? 0,
                        ordersHistory: data.ordersHistory ?? [],
                    });
                } else {
                    toast.error("Failed to fetch driver data");
                }
            } catch (error) {
                toast.error("Error fetching driver data");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDriver();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "ordersHistory"
                    ? prev.ordersHistory
                    : name === "rating" ||
                        name === "averageDeliveryTime" ||
                        name === "onTimeDeliveryRate"
                        ? Number(value)
                        : Number(value) >= 0
                            ? parseInt(value, 10)
                            : 0,
        }));
    };

    const handleOrdersHistoryChange = (e) => {
        setOrdersHistoryInput(e.target.value);
    };

    const handleOrdersHistoryBlur = () => {
        const trimmed = ordersHistoryInput.trim();
        if (trimmed.length === 0) {
            setFormData((prev) => ({ ...prev, ordersHistory: [] }));
            return;
        }
        const arr = trimmed.split(",").map((item) => item.trim()).filter(Boolean);
        setFormData((prev) => ({ ...prev, ordersHistory: arr }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (formData.rating < 0 || formData.rating > 5) {
                toast.error("Rating must be between 0 and 5");
                return;
            }
            if (formData.onTimeDeliveryRate < 0 || formData.onTimeDeliveryRate > 100) {
                toast.error("On-time delivery rate must be between 0 and 100");
                return;
            }

            const payload = {
                rating: formData.rating,
                totalRatings: formData.totalRatings,
                totalDeliveries: formData.totalDeliveries,
                completedDeliveries: formData.completedDeliveries,
                cancelledDeliveries: formData.cancelledDeliveries,
                averageDeliveryTime: formData.averageDeliveryTime,
                onTimeDeliveryRate: formData.onTimeDeliveryRate,
                ordersHistory: formData.ordersHistory,
            };

            const response = await axiosInstance.patch(
                `/drivers/update-performanceAndRating/${id}`,
                payload
            );

            if (response.data.success) {
                toast.success("Performance info updated successfully!");
                navigate(-1)
            } else {
                toast.error("Failed to update performance info");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating performance info");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="driver-performance-info-container" style={{ maxWidth: 600, margin: "0 auto" }}>
            <h1>Driver Performance & Rating Info</h1>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <label>
                    Rating (0-5):
                    <input
                        type="number"
                        name="rating"
                        value={formData.rating}
                        min={0}
                        max={5}
                        step={0.1}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Total Ratings:
                    <input
                        type="number"
                        name="totalRatings"
                        value={formData.totalRatings}
                        min={0}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Total Deliveries:
                    <input
                        type="number"
                        name="totalDeliveries"
                        value={formData.totalDeliveries}
                        min={0}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Completed Deliveries:
                    <input
                        type="number"
                        name="completedDeliveries"
                        value={formData.completedDeliveries}
                        min={0}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Cancelled Deliveries:
                    <input
                        type="number"
                        name="cancelledDeliveries"
                        value={formData.cancelledDeliveries}
                        min={0}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Average Delivery Time (minutes):
                    <input
                        type="number"
                        name="averageDeliveryTime"
                        value={formData.averageDeliveryTime}
                        min={0}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    On-Time Delivery Rate (%):
                    <input
                        type="number"
                        name="onTimeDeliveryRate"
                        value={formData.onTimeDeliveryRate}
                        min={0}
                        max={100}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Orders History (comma separated IDs):
                    <input
                        type="text"
                        name="ordersHistoryInput"
                        value={ordersHistoryInput}
                        onChange={handleOrdersHistoryChange}
                        onBlur={handleOrdersHistoryBlur}
                        placeholder="order1, order2, order3"
                    />
                </label>
                <button style={{ padding: "8px 16px" }} onClick={() => navigate(-1)}>
                    Cancel
                </button>
                <button type="submit" style={{ padding: "8px 16px" }}>
                    Save Performance Info
                </button>
            </form>
        </div>
    );
}

export default DriverPerformanceInfo;
