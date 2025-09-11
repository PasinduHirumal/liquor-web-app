import React, { useEffect, useState } from "react";
import { Modal, Button, Table, Spin } from "antd";
import { axiosInstance } from "../../../lib/axios";

const DriverEarningHistoryModal = ({ visible, onClose, driver }) => {
    const [loading, setLoading] = useState(false);
    const [earnings, setEarnings] = useState([]);

    useEffect(() => {
        const fetchEarningHistory = async () => {
            if (!driver?.id) return;

            setLoading(true);
            try {
                const res = await axiosInstance.get(`/earning/driver/${driver.id}`);
                if (res.data.success) {
                    // Backend returns earning_amount
                    setEarnings(res.data.data);
                } else {
                    setEarnings([]);
                }
            } catch (error) {
                console.error("Failed to fetch earning history:", error);
                setEarnings([]);
            } finally {
                setLoading(false);
            }
        };

        if (visible) {
            fetchEarningHistory();
        }
    }, [visible, driver]);

    const columns = [
        {
            title: "Earning ID",
            dataIndex: "earning_id",
            key: "earning_id",
            width: 120,
        },
        {
            title: "Order ID",
            dataIndex: "order_id",
            key: "order_id",
            width: 150,
        },
        {
            title: "Delivery Fee",
            dataIndex: "delivery_fee",
            key: "delivery_fee",
            width: 120,
            render: (val) => `Rs ${val?.toFixed(2) ?? 0}`,
        },
        {
            title: "Commission Rate (%)",
            dataIndex: "commission_rate",
            key: "commission_rate",
            width: 150,
        },
        {
            title: "Earning Amount",
            dataIndex: "earning_amount",
            key: "earning_amount",
            width: 150,
            render: (val) => `Rs ${val?.toFixed(2) ?? 0}`,
        },
        {
            title: "Delivery Completed",
            dataIndex: "is_delivery_completed",
            key: "is_delivery_completed",
            width: 150,
            render: (val) => (val ? "Yes" : "No"),
        },
        {
            title: "Date",
            dataIndex: "created_at",
            key: "created_at",
            width: 200,
            render: (val) => new Date(val).toLocaleString(),
        },
    ];

    return (
        <Modal
            title={<span className="text-xl font-bold">Driver Earning History</span>}
            open={visible}
            onCancel={onClose}
            maskClosable={false}
            width={900}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>,
            ]}
        >
            {driver ? (
                <div>
                    {/* Driver details */}
                    <div className="flex flex-wrap gap-6 mb-5">
                        <div>
                            <span className="font-semibold">Name:</span> {driver.firstName} {driver.lastName}
                        </div>
                        <div>
                            <span className="font-semibold">Email:</span> {driver.email}
                        </div>
                        <div>
                            <span className="font-semibold">Total Earnings:</span> Rs {driver.totalEarnings?.toFixed(2) ?? 0}
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-3">Earning History</h3>

                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <Spin tip="Loading earning history..." />
                        </div>
                    ) : earnings.length > 0 ? (
                        <Table
                            columns={columns}
                            dataSource={earnings.map((e) => ({ ...e, key: e.earning_id }))}
                            pagination={{ pageSize: 5 }}
                            scroll={{ x: 900 }}
                            className="overflow-x-auto"
                        />
                    ) : (
                        <p className="mt-4 italic text-gray-500">No earning history found.</p>
                    )}
                </div>
            ) : (
                <p className="text-gray-500">No driver selected.</p>
            )}
        </Modal>
    );
};

export default DriverEarningHistoryModal;
