import React, { useEffect, useState } from "react";
import { Card, Table, Button, Typography, Spin } from "antd";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../lib/axios";
import { DollarOutlined } from "@ant-design/icons";
import CashWithdrawModel from "../../../components/admin/payment/CashWithdrawModel";

const { Title, Text } = Typography;

function CashWithdraws() {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/finance/withdraw_history");
            if (res.data.success) {
                setWithdrawals(res.data.data);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error("Fetch withdrawals error:", error);
            toast.error("Failed to fetch withdrawals");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const columns = [
        {
            title: "Admin",
            key: "admin",
            width: 180,
            render: (record) => (
                <div>
                    <Text strong>{record.admin_email}</Text>
                    <br />
                    <Text type="secondary">ID: {record.admin_id}</Text>
                </div>
            ),
        },
        {
            title: "Role",
            dataIndex: "admin_role",
            key: "role",
            width: 100,
        },
        {
            title: "Amount",
            dataIndex: "withdraw_amount",
            key: "amount",
            width: 100,
            render: (text) => <Text>Rs. {text.toFixed(2)}</Text>,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 270,
        },
        {
            title: "Date",
            dataIndex: "created_at",
            key: "date",
            width: 150,
            render: (text) => <Text>{new Date(text).toLocaleString()}</Text>,
        },
    ];

    return (
        <div style={{ padding: "0 24px 24px 24px" }} className="bg-white">
            <div className="flex justify-between items-center mb-6">
                <Title level={3}>Cash Withdraws</Title>
                <Button
                    type="primary"
                    icon={<DollarOutlined />}
                    onClick={() => setModalVisible(true)}
                >
                    Withdraw Cash
                </Button>
            </div>

            <Card className="shadow-sm rounded-lg">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spin size="large" />
                    </div>
                ) : (
                    <Table
                        dataSource={withdrawals}
                        columns={columns}
                        rowKey={(record) => record.id}
                        pagination={{ pageSize: 5 }}
                        scroll={{ x: 1000 }}
                    />
                )}
            </Card>

            <CashWithdrawModel
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSuccess={fetchWithdrawals}
            />
        </div>
    );
}

export default CashWithdraws;
