import React, { useEffect, useState } from "react";
import {
    Table,
    Typography,
    Spin,
    Button,
    Tooltip,
} from "antd";
import { HistoryOutlined, DollarOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import DriverHistoryModal from "../../components/admin/DriverHistoryModal.jsx";
import DriverPaymentModal from "../../components/admin/DriverPaymentModal.jsx";

const { Title } = Typography;

function DriverPayment() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [historyModalVisible, setHistoryModalVisible] = useState(false);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get("/drivers/allDrivers");
                if (response.data.success) {
                    setDrivers(response.data.data || []);
                } else {
                    toast.error("Failed to fetch drivers");
                }
            } catch (error) {
                console.error("Error fetching drivers:", error);
                toast.error("Error fetching drivers");
            } finally {
                setLoading(false);
            }
        };

        fetchDrivers();
    }, []);

    const handleHistory = (driver) => {
        setSelectedDriver(driver);
        setHistoryModalVisible(true);
    };

    const handlePayment = (driver) => {
        setSelectedDriver(driver);
        setPaymentModalVisible(true);
    };

    const handleCloseHistoryModal = () => {
        setHistoryModalVisible(false);
        setSelectedDriver(null);
    };

    const handleClosePaymentModal = () => {
        setPaymentModalVisible(false);
        setSelectedDriver(null);
    };

    const columns = [
        {
            title: "Full Name",
            key: "fullName",
            width: 220,
            render: (_, record) => (
                <div>
                    <div className="font-bold">{`${record.firstName || ""} ${record.lastName || ""}`}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{record.id?.toLowerCase()}</div>
                </div>
            ),
        },
        { title: "Email", dataIndex: "email", key: "email", width: 200 },
        { title: "NIC Number", dataIndex: "nic_number", key: "nic_number", width: 160 },
        { title: "License Number", dataIndex: "license_number", key: "license_number", width: 160 },
        {
            title: "Warehouse ID",
            key: "where_house_id",
            width: 180,
            render: (_, record) => `${record.where_house_id?.name || ""}`,
        },
        {
            title: "Total Earnings",
            dataIndex: "totalEarnings",
            key: "totalEarnings",
            width: 150,
            render: (value) => `Rs: ${value || 0}`,
        },
        {
            title: "Total Withdraws",
            dataIndex: "totalWithdraws",
            key: "totalWithdraws",
            width: 150,
            render: (value) => `Rs: ${value || 0}`,
        },
        {
            title: "Current Balance",
            dataIndex: "currentBalance",
            key: "currentBalance",
            width: 150,
            render: (value) => `Rs: ${value || 0}`,
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            render: (_, record) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <Tooltip title="View History">
                        <Button
                            type="primary"
                            icon={<HistoryOutlined />}
                            onClick={() => handleHistory(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Make Payment">
                        <Button
                            type="default"
                            icon={<DollarOutlined />}
                            onClick={() => handlePayment(record)}
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div style={{ padding: 24 }} className="bg-white">
            <Title level={2}>Driver Payments</Title>
            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
            ) : (
                <Table
                    columns={columns}
                    dataSource={drivers}
                    rowKey="id"
                    bordered
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 1600 }}
                />
            )}

            {/* Driver History Modal */}
            <DriverHistoryModal
                visible={historyModalVisible}
                onClose={handleCloseHistoryModal}
                driver={selectedDriver}
            />

            {/* Payment Modal (moved to new component) */}
            <DriverPaymentModal
                visible={paymentModalVisible}
                onClose={handleClosePaymentModal}
                driver={selectedDriver}
            />
        </div>
    );
}

export default DriverPayment;
