import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Spin, message } from "antd";
import { axiosInstance } from "../../lib/axios";

function SuperMarket() {
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMarkets = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/superMarket/getAll");
            if (res.data && res.data.success) {
                setMarkets(res.data.data);
            } else {
                setError("Failed to fetch supermarkets");
                message.error("Failed to fetch supermarkets");
            }
        } catch (err) {
            console.error("Fetch SuperMarkets Error:", err);
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
        {
            title: 'Name',
            dataIndex: 'superMarket_Name',
            key: 'name',
        },
        {
            title: 'Street Address',
            dataIndex: 'streetAddress',
            key: 'streetAddress',
        },
        {
            title: 'City',
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
        },
        {
            title: 'Postal Code',
            dataIndex: 'postalCode',
            key: 'postalCode',
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Yes' : 'No'}
                </Tag>
            ),
        },
        {
            title: 'Orders Count',
            dataIndex: 'orders_count',
            key: 'orders_count',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString(),
        },
    ];

    return (
        <div className="bg-white p-4">
            <h1 className="text-xl font-bold mb-4">Super Market Management</h1>

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
                    locale={{
                        emptyText: 'No supermarkets found'
                    }}
                />
            )}
        </div>
    );
}

export default SuperMarket;