import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios"
import '../../../styles/DriverPerformanceInfo.css'
import toast from "react-hot-toast";

function DriverPerformanceInfo() {
    const { id } = useParams();
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
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
        setSubmitting(true);

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
                navigate(-1);
            } else {
                toast.error("Failed to update performance info");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating performance info");
        } finally {
            setSubmitting(false);
        }
    };


    if (loading) return <p className="mt-5 text-center">Loading...</p>;

    return (
        <div className="container driver-performance-info mt-5">
            <h2 className="mb-4 text-center text-primary">Driver Performance & Rating Info</h2>
            <form onSubmit={handleSubmit} className="driver-performance-form bg-light p-4 rounded shadow-sm">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Rating (0-5)</label>
                        <input
                            type="number"
                            name="rating"
                            value={formData.rating}
                            min={0}
                            max={5}
                            step={0.1}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Total Ratings</label>
                        <input
                            type="number"
                            name="totalRatings"
                            value={formData.totalRatings}
                            min={0}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Total Deliveries</label>
                        <input
                            type="number"
                            name="totalDeliveries"
                            value={formData.totalDeliveries}
                            min={0}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Completed Deliveries</label>
                        <input
                            type="number"
                            name="completedDeliveries"
                            value={formData.completedDeliveries}
                            min={0}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Cancelled Deliveries</label>
                        <input
                            type="number"
                            name="cancelledDeliveries"
                            value={formData.cancelledDeliveries}
                            min={0}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Average Delivery Time (min)</label>
                        <input
                            type="number"
                            name="averageDeliveryTime"
                            value={formData.averageDeliveryTime}
                            min={0}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">On-Time Delivery Rate (%)</label>
                        <input
                            type="number"
                            name="onTimeDeliveryRate"
                            value={formData.onTimeDeliveryRate}
                            min={0}
                            max={100}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>

                    <div className="col-md-12">
                        <label className="form-label">Orders History (comma-separated)</label>
                        <input
                            type="text"
                            name="ordersHistoryInput"
                            value={ordersHistoryInput}
                            onChange={handleOrdersHistoryChange}
                            onBlur={handleOrdersHistoryBlur}
                            placeholder="order1, order2, order3"
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-4 gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn btn-secondary"
                        disabled={submitting}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={submitting}
                    >
                        {submitting ? "Saving..." : "Save Performance Info"}
                    </button>
                </div>
            </form>
        </div>
    );

}

export default DriverPerformanceInfo;
