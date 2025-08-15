import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, message, Button, Space, Tooltip, Input } from "antd";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { axiosInstance } from "../../lib/axios";
import CreateSuperMarketModal from "../../components/admin/forms/CreateSuperMarketModal";
import EditSuperMarketModal from "../../components/admin/forms/EditSuperMarketModal";

function SuperMarket() {
    const [markets, setMarkets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedMarket, setSelectedMarket] = useState(null);

    // Search/filter state
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const fetchMarkets = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get("/superMarket/getAll");
            if (res.data?.success) {
                setMarkets(res.data.data);
                setFilteredData(res.data.data); // initialize filtered data
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

    const handleEditClick = (record) => {
        setSelectedMarket(record);
        setIsEditModalOpen(true);
    };

    // Search handler
    const handleSearch = (value) => {
        setSearchText(value);
        const filtered = markets.filter((item) =>
            item.superMarket_Name?.toLowerCase().includes(value.toLowerCase()) ||
            item.streetAddress?.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const uniqueCities = [...new Set(markets.map((m) => m.city).filter(Boolean))];
    const uniqueCountries = [...new Set(markets.map((m) => m.country).filter(Boolean))];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'superMarket_Name',
            key: 'name',
            width: 150,
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
            filters: uniqueCities.map(city => ({ text: city, value: city })),
            onFilter: (value, record) => record.city === value
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
            filters: uniqueCountries.map(country => ({ text: country, value: country })),
            onFilter: (value, record) => record.country === value
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 100,
            filters: [
                { text: 'Active', value: true },
                { text: 'Inactive', value: false }
            ],
            onFilter: (value, record) => record.isActive === value,
            render: (isActive) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Yes' : 'No'}
                </Tag>
            ),
        },
        { title: 'Orders Count', dataIndex: 'orders_count', key: 'orders_count', width: 120 },
        {
            title: 'Action',
            key: 'action',
            width: 80,
            fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button
                            icon={<EditOutlined />}
                            type="link"
                            onClick={() => handleEditClick(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="bg-white p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Supermarket Management</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Input
                        placeholder="Search by name or address"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: 250 }}
                        allowClear
                    />
                    <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
                        Create Supermarket
                    </Button>
                </div>
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
                    dataSource={filteredData}
                    rowKey="id"
                    bordered
                    scroll={{ x: 1300 }}
                    locale={{ emptyText: 'No supermarkets found' }}
                />
            )}

            <CreateSuperMarketModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={fetchMarkets}
            />

            <EditSuperMarketModal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                marketData={selectedMarket}
                onSuccess={fetchMarkets}
            />
        </div>
    );
}

export default SuperMarket;
