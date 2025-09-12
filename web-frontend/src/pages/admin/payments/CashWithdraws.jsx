import React, { useEffect, useState } from "react";
import { Card, Table, Button, Modal, Input, message, Typography, Spin } from "antd";
import { axiosInstance } from "../../../lib/axios";
import { DollarOutlined, ReloadOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function CashWithdraws() {
    const [withdrawals, setWithdrawals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [description, setDescription] = useState("");

    // Fetch withdrawal history
    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/finance/withdraw_history");
            if (res.data.success) {
                setWithdrawals(res.data.data);
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.error("Fetch withdrawals error:", error);
            message.error("Failed to fetch withdrawals");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    // Handle cash withdraw
    const handleWithdraw = async () => {
        if (!withdrawAmount || Number(withdrawAmount) <= 0) {
            return message.warning("Enter a valid amount");
        }

        try {
            const res = await axiosInstance.post("/finance/withdraw_cash", {
                withdraw_amount: Number(withdrawAmount),
                description,
            });

            if (res.data.success) {
                message.success(res.data.message);
                setModalVisible(false);
                setWithdrawAmount("");
                setDescription("");
                fetchWithdrawals();
            } else {
                message.error(res.data.message);
            }
        } catch (error) {
            console.error("Withdraw error:", error);
            message.error("Cash withdrawal failed");
        }
    };

    // Table columns
    const columns = [
        {
            title: "Amount",
            dataIndex: "withdraw_amount",
            key: "amount",
            render: (text) => <Text>Rs. {text.toFixed(2)}</Text>,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "Admin",
            dataIndex: "admin_email",
            key: "admin",
        },
        {
            title: "Role",
            dataIndex: "admin_role",
            key: "role",
        },
        {
            title: "Date",
            dataIndex: "created_at",
            key: "date",
            render: (text) => <Text>{new Date(text).toLocaleString()}</Text>,
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
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
                    />
                )}
            </Card>

            {/* Withdraw Modal */}
            <Modal
                title="Withdraw Cash"
                open={modalVisible}
                onOk={handleWithdraw}
                onCancel={() => setModalVisible(false)}
                okText="Withdraw"
            >
                <div className="space-y-4">
                    <Input
                        placeholder="Amount"
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                    <Input.TextArea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default CashWithdraws;
