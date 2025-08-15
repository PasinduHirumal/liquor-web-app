import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, message } from "antd";
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
            width: 150, // set width for scroll
        },
        {
            title: 'Street Address',
            dataIndex: 'streetAddress',
            key: 'streetAddress',
            width: 200,
        },
        {
            title: 'City',
            dataIndex: 'city',
            key: 'city',
            width: 120,
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
            width: 120,
        },
        {
            title: 'Postal Code',
            dataIndex: 'postalCode',
            key: 'postalCode',
            width: 120,
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
            width: 120,
        },
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
        {
            title: 'Orders Count',
            dataIndex: 'orders_count',
            key: 'orders_count',
            width: 120,
        }
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
                    scroll={{ x: 1200 }}
                    locale={{
                        emptyText: 'No supermarkets found'
                    }}
                />
            )}
        </div>
    );
}

export default SuperMarket;
