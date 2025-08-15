import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, message, Button } from "antd";
import { axiosInstance } from "../../lib/axios";
import CreateSuperMarketModal from "../../components/admin/forms/CreateSuperMarketModal";

function SuperMarket() {
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchMarkets = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/superMarket/getAll");
            if (res.data?.success) {
                setMarkets(res.data.data);
            } else {
                setError("Failed to fetch supermarkets");
                message.error("Failed to fetch supermarkets");
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Server Error";
            setError(errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMarkets();
    }, []);

    const columns = [
        { title: 'Name', dataIndex: 'superMarket_Name', key: 'name', width: 150 },
        { title: 'Street Address', dataIndex: 'streetAddress', key: 'streetAddress', width: 200 },
        { title: 'City', dataIndex: 'city', key: 'city', width: 120 },
        { title: 'State', dataIndex: 'state', key: 'state', width: 120 },
        { title: 'Postal Code', dataIndex: 'postalCode', key: 'postalCode', width: 120 },
        { title: 'Country', dataIndex: 'country', key: 'country', width: 120 },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 100,
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Yes' : 'No'}
                </Tag>
            ),
        },
        { title: 'Orders Count', dataIndex: 'orders_count', key: 'orders_count', width: 120 }
    ];

    return (
        <div className="bg-white p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Super Market Management</h2>
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    Create Supermarket
                </Button>
            </div>

            {loading ? (
                <div className="text-center">
                    <Spin size="large" />
                </div>
            ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={markets}
                    rowKey="id"
                    bordered
                    scroll={{ x: 1200 }}
                    locale={{ emptyText: 'No supermarkets found' }}
                />
            )}

            <CreateSuperMarketModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchMarkets}
            />
        </div>
    );
}

export default SuperMarket;
