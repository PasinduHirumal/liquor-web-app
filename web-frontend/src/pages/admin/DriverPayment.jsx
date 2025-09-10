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
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "First Name",
            dataIndex: "firstName",
            key: "firstName",
        },
        {
            title: "Last Name",
            dataIndex: "lastName",
            key: "lastName",
        },
        {
            title: "NIC Number",
            dataIndex: "nic_number",
            key: "nic_number",
        },
        {
            title: "License Number",
            dataIndex: "license_number",
            key: "license_number",
        },
        {
            title: "Warehouse ID",
            dataIndex: "where_house_id",
            key: "where_house_id",
        },
        {
            title: "Total Earnings",
            dataIndex: "totalEarnings",
            key: "totalEarnings",
            render: (value) => `Rs: ${value || 0}`,
        },
        {
            title: "Total Withdraws",
            dataIndex: "totalWithdraws",
            key: "totalWithdraws",
            render: (value) => `Rs: ${value || 0}`,
        },
        {
            title: "Current Balance",
            dataIndex: "currentBalance",
            key: "currentBalance",
            render: (value) => `Rs: ${value || 0}`,
        },
    ];

    return (
        <div style={{ padding: 24 }} className="bg-white">
            <Title level={2}>Driver Payment Report</Title>
            {loading ? (
                <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
            ) : (
                <Table
                    columns={columns}
                    dataSource={drivers}
                    rowKey="id"
                    bordered
                    pagination={{ pageSize: 10 }}
                />
            )}
        </div>
    );
}

export default DriverPayment;
