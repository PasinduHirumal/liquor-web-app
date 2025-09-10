import React, { useEffect, useState } from "react";
import { Table, Typography, Spin } from "antd";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const { Title } = Typography;

function DriverPayment() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);

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

        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 200,
        },
        {
            title: "NIC Number",
            dataIndex: "nic_number",
            key: "nic_number",
            width: 160,
        },
        {
            title: "License Number",
            dataIndex: "license_number",
            key: "license_number",
            width: 160,
        },
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
                    scroll={{ x: 1500 }} // 👈 horizontal scroll enabled
                />
            )}
        </div>
    );
}

export default DriverPayment;
