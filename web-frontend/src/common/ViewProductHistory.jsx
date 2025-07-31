import React, { useState, useEffect } from "react";
import {
    FaHistory,
    FaTimes,
    FaBoxOpen,
    FaCheckCircle,
    FaTimesCircle,
} from "react-icons/fa";
import { axiosInstance } from "../lib/axios";
import "../styles/ViewProductHistory.css";

const ViewProductHistory = ({ productId, productName }) => {
    const [showModal, setShowModal] = useState(false);
    const [stockHistory, setStockHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchStockHistory = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axiosInstance.get(
                `/stockHistory/getByProductId/${productId}`
            );
            if (data.success) {
                setStockHistory(data.data);
            } else {
                throw new Error(data.message || "Failed to fetch stock history");
            }
        } catch (err) {
            console.error("Fetch stock history error:", err);
            setError(err.message || "Failed to load stock history");
        } finally {
            setLoading(false);
        }
    };

    const openModal = async () => {
        setShowModal(true);
        await fetchStockHistory();
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "N/A";
        }
    };

    return (
        <>
            <button
                className="history-button d-flex align-items-center gap-2 px-3 py-2"
                onClick={openModal}
            >
                <FaHistory />
                View History
            </button>

            {showModal && (
                <div className="history-modal-overlay">
                    <div className="history-modal">
                        <div className="modal-header">
                            <h3>
                                <FaHistory className="me-2" />
                                Stock History for {productName}
                            </h3>
                            <button onClick={closeModal} className="close-button">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="modal-content">
                            {loading ? (
                                <div className="loading-indicator">
                                    <div className="spinner"></div>
                                    <p>Loading history...</p>
                                </div>
                            ) : error ? (
                                <div className="error-message">
                                    <FaTimesCircle className="text-danger" size={32} />
                                    <p>{error}</p>
                                </div>
                            ) : stockHistory.length > 0 ? (
                                <div className="history-table-container">
                                    <table className="history-table">
                                        <thead>
                                            <tr>
                                                <th>Type</th>
                                                <th>Quantity</th>
                                                <th>User</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stockHistory.map((history, index) => (
                                                <tr key={index}>
                                                    <td
                                                        className={`history-type ${history.type?.toLowerCase() === "add items"
                                                            ? "text-success"
                                                            : history.type?.toLowerCase() === "remove items"
                                                                ? "text-danger"
                                                                : ""
                                                            }`}
                                                    >
                                                        {history.type?.toLowerCase() === "add items"
                                                            ? "Added"
                                                            : history.type?.toLowerCase() === "remove items"
                                                                ? "Removed"
                                                                : history.type || "Unknown"}
                                                    </td>

                                                    <td
                                                        className={
                                                            history.type?.toLowerCase() === "add items"
                                                                ? "text-success"
                                                                : history.type?.toLowerCase() === "remove items"
                                                                    ? "text-danger"
                                                                    : ""
                                                        }
                                                    >
                                                        {history.type?.toLowerCase() === "add items"
                                                            ? `+${history.quantity}`
                                                            : history.type?.toLowerCase() === "remove items"
                                                                ? `-${history.quantity}`
                                                                : history.quantity || "Unknown"}
                                                    </td>

                                                    <td>{history.userId?.username || "System"}</td>
                                                    <td>{formatDate(history.createdAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="no-history">
                                    <FaBoxOpen size={32} />
                                    <p>No stock history available for this product</p>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button onClick={closeModal} className="close-modal-btn">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ViewProductHistory;