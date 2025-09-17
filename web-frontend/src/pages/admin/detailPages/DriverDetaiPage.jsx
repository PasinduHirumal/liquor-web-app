import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import {
    Avatar,
    Card,
    Tag,
    Spin,
    Button,
    Divider,
    Typography,
    Modal,
    Tooltip,
    Grid,
    Row,
    Col,
    Statistic,
    Descriptions,
    Space,
    Image
} from 'antd';
import {
    EnvironmentOutlined,
    CarOutlined,
    BankOutlined,
    StarOutlined,
    FileTextOutlined,
    EditOutlined,
    SafetyCertificateOutlined,
    PhoneOutlined,
    MailOutlined,
    IdcardOutlined,
    HistoryOutlined
} from '@ant-design/icons';
import { axiosInstance } from '../../../lib/axios';
import DriverAccountStatus from '../../../components/admin/forms/DriverAccountStatus';
import DriverHistory from '../../../components/admin/DriverHistory';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const DriverDetailPage = () => {
    const { id } = useParams();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const screens = useBreakpoint();

    const [showModal, setShowModal] = useState(false);
    const handleOpen = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleEditProfile = () => {
        navigate(`/driver-list/${id}/edit-profile`);
    };

    const handleEditVehicles = () => {
        navigate(`/driver-list/${id}/edit-vehicles`);
    };

    const handleEditLocation = () => {
        navigate(`/driver-list/${id}/edit-location`);
    };

    const handleEditPerformance = () => {
        navigate(`/driver-list/${id}/edit-performance`);
    };

    const handleEditFinancial = () => {
        navigate(`/driver-list/${id}/edit-financial`);
    };

    const handleEditDocuments = () => {
        navigate(`/driver-list/${id}/edit-documents`);
    };

    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const response = await axiosInstance.get(`/drivers/getDriverById/${id}`);
                setDriver(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch driver details');
                setLoading(false);
            }
        };

        fetchDriver();
    }, [id]);

    const handleUpdateSuccess = (updatedData) => {
        setDriver(prev => ({
            ...prev,
            isActive: updatedData.isActive,
            isDocumentVerified: updatedData.isDocumentVerified,
            isAvailable: updatedData.isAvailable,
            isOnline: updatedData.isOnline,
            backgroundCheckStatus: updatedData.backgroundCheckStatus
        }));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <Text type="danger">{error}</Text>
            </div>
        );
    }

    if (!driver) {
        return (
            <div className="p-4">
                <Text>Driver not found</Text>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="bg-white p-6 rounded-2xl shadow-md mb-8 sticky top-0 z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Title level={2} className="mb-0 !text-gray-800">Driver Profile</Title>
                        <Space size="small">
                            <Tag color={driver.isActive ? "green" : "red"} className="px-3 py-1 text-sm rounded-full">
                                {driver.isActive ? "Active" : "Inactive"}
                            </Tag>
                            {driver.isDocumentVerified && (
                                <Tag color="blue" icon={<SafetyCertificateOutlined />} className="px-3 py-1 text-sm rounded-full">
                                    Verified
                                </Tag>
                            )}
                        </Space>
                    </div>

                    <Tooltip title="Edit Account & Status">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleOpen}
                            className="!rounded-full !px-5 !py-2"
                        >
                            Edit Status
                        </Button>
                    </Tooltip>
                </div>
            </div>

            <Row gutter={[24, 24]}>
                {/* Left Column */}
                <Col xs={24} lg={8}>
                    <Card
                        className="rounded-2xl shadow-sm hover:shadow-md transition-all"
                        title={
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-700">Personal Information</span>
                                <Tooltip title="Edit Personal Details">
                                    <Button type="text" icon={<EditOutlined />} onClick={handleEditProfile} />
                                </Tooltip>
                            </div>
                        }
                    >
                        <div className="flex flex-col items-center mb-6">
                            <Avatar src={driver.profileImage} size={120} className="mb-4 border border-gray-200 shadow" />
                            <Title level={4} className="mb-1">{driver.firstName} {driver.lastName}</Title>
                            <div className="text-center text-gray-500 mb-4">
                                <div className="font-medium text-gray-800">Warehouse</div>
                                {driver.where_house_id?.name || "No Warehouse Assigned"}
                            </div>
                        </div>

                        <Divider orientation="center">Contact Information</Divider>
                        <Descriptions column={1} bordered={false} size="small" className="mb-4">
                            <Descriptions.Item label="Email">{driver.email || "N/A"}</Descriptions.Item>
                            <Descriptions.Item label="Phone">{driver.phone || "N/A"}</Descriptions.Item>
                            <Descriptions.Item label="Address">{driver.address || "N/A"}</Descriptions.Item>
                            <Descriptions.Item label="City">{driver.city || "N/A"}</Descriptions.Item>
                            <Descriptions.Item label="Emergency Contact">{driver.emergencyContact || "N/A"}</Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="center">Identification</Divider>
                        <Descriptions column={1} bordered={false} size="small">
                            <Descriptions.Item label="NIC">{driver.nic_number || "N/A"}</Descriptions.Item>
                            <Descriptions.Item label="License">{driver.license_number || "N/A"}</Descriptions.Item>
                            <Descriptions.Item label="DOB">{driver.dateOfBirth ? new Date(driver.dateOfBirth).toLocaleDateString() : "N/A"}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                {/* Right Column - Details Section */}
                <Col xs={24} lg={16}>
                    <Row gutter={[16, 16]}>
                        {/* Vehicle Information */}
                        <Col span={24}>
                            <Card
                                title={
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <CarOutlined className="mr-2" />
                                            <span>Vehicle Information</span>
                                        </div>
                                        <Tooltip title="Edit Vehicle Information">
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={handleEditVehicles}
                                            />
                                        </Tooltip>
                                    </div>
                                }
                            >
                                <Row gutter={[16, 16]}>
                                    <Col xs={12} sm={8}>
                                        <Statistic title="Type" value={driver.vehicleType || 'N/A'} />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic title="Model" value={driver.vehicleModel || 'N/A'} />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic title="Number" value={driver.vehicleNumber || 'N/A'} />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic title="Color" value={driver.vehicleColor || 'N/A'} />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic title="Year" value={driver.vehicleYear || 'N/A'} />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic title="Registration" value={driver.vehicleRegistration || 'N/A'} />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic
                                            title="Insurance"
                                            value={driver.vehicleInsurance ? 'Valid' : 'N/A'}
                                            valueStyle={{ color: driver.vehicleInsurance ? '#3f8600' : '#cf1322' }}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        {/* Location & Status */}
                        <Col span={24}>
                            <Card
                                title={
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <EnvironmentOutlined className="mr-2" />
                                            <span>Location & Status</span>
                                        </div>
                                        <Tooltip title="Edit Location & Status">
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={handleEditLocation}
                                            />
                                        </Tooltip>
                                    </div>
                                }
                            >
                                {driver.currentLocation ? (
                                    <>
                                        <Row gutter={[16, 16]}>
                                            <Col span={24}>
                                                <Descriptions column={1}>
                                                    <Descriptions.Item label="Current Location">
                                                        Lat: {driver.currentLocation.lat?.toFixed(4)}, Lng: {driver.currentLocation.lng?.toFixed(4)}
                                                    </Descriptions.Item>
                                                    {driver.currentLocation.address && (
                                                        <Descriptions.Item label="Address">
                                                            {driver.currentLocation.address}
                                                        </Descriptions.Item>
                                                    )}
                                                    <Descriptions.Item label="Delivery Zones">
                                                        {Array.isArray(driver.deliveryZones) && driver.deliveryZones.length > 0
                                                            ? driver.deliveryZones.join(', ')
                                                            : 'N/A'}
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Delivery Types">
                                                        {Array.isArray(driver.preferredDeliveryTypes) && driver.preferredDeliveryTypes.length > 0
                                                            ? driver.preferredDeliveryTypes.join(', ')
                                                            : 'N/A'}
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </Col>
                                            <Col xs={12} sm={8}>
                                                <div className="mb-2 font-medium">Status</div>
                                                <Space direction="vertical">
                                                    <Tag color={driver.isOnline ? "green" : "default"}>
                                                        {driver.isOnline ? 'Online' : 'Offline'}
                                                    </Tag>
                                                    <Tag color={driver.isAvailable ? "green" : "orange"}>
                                                        {driver.isAvailable ? 'Available' : 'Busy'}
                                                    </Tag>
                                                </Space>
                                            </Col>
                                            <Col xs={12} sm={8}>
                                                <Statistic
                                                    title="Max Delivery Radius"
                                                    value={driver.maxDeliveryRadius || 'N/A'}
                                                    suffix="km"
                                                />
                                            </Col>
                                        </Row>
                                    </>
                                ) : (
                                    <Text>Location data not available</Text>
                                )}
                            </Card>
                        </Col>

                        {/* Performance & Ratings */}
                        <Col span={24}>
                            <Card
                                title={
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <StarOutlined className="mr-2" />
                                            <span>Performance & Ratings</span>
                                        </div>
                                        <Tooltip title="Edit Performance Details">
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={handleEditPerformance}
                                            />
                                        </Tooltip>
                                    </div>
                                }
                            >
                                <Row gutter={[16, 16]}>
                                    <Col xs={24}>
                                        <Descriptions>
                                            <Descriptions.Item label="Orders History">
                                                {Array.isArray(driver.ordersHistory) && driver.ordersHistory.length > 0
                                                    ? driver.ordersHistory.join(', ')
                                                    : 'N/A'}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Statistic
                                            title="Rating"
                                            prefix={<StarOutlined className="text-yellow-400" />}
                                            value={driver.rating?.toFixed(1) || '0.0'}
                                            suffix={`(${driver.totalRatings || 0})`}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Statistic title="Total Deliveries" value={driver.totalDeliveries || 0} />
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Statistic title="Completed Deliveries" value={driver.completedDeliveries || 0} />
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Statistic title="Cancelled Deliveries" value={driver.cancelledDeliveries || 0} />
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Statistic
                                            title="On Time Rate"
                                            value={driver.onTimeDeliveryRate || 0}
                                            suffix="%"
                                            valueStyle={{ color: driver.onTimeDeliveryRate > 90 ? '#3f8600' : '#cf1322' }}
                                        />
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Statistic title="Avg. Delivery Time" value={driver.averageDeliveryTime || 'N/A'} />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        {/* Financial Information */}
                        <Col span={24}>
                            <Card
                                title={
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <BankOutlined className="mr-2" />
                                            <span>Financial Information</span>
                                        </div>
                                        <Tooltip title="Edit Financial Information">
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={handleEditFinancial}
                                            />
                                        </Tooltip>
                                    </div>
                                }
                            >
                                <Row gutter={[16, 16]}>
                                    <Col xs={12} sm={8}>
                                        <Statistic title="Bank" value={driver.bankName || 'N/A'} />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic title="Bank Branch" value={driver.bankBranch || 'N/A'} />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic
                                            title="Account"
                                            value={driver.bankAccountNumber ? `••••${driver.bankAccountNumber.slice(-4)}` : 'N/A'}
                                        />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic title="Tax ID" value={driver.taxId || 'N/A'} />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic title="Commission Rate" value={driver.commissionRate || 'N/A'} suffix="%" />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic title="Payment Method" value={driver.paymentMethod || 'N/A'} />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic
                                            title="Total Earnings"
                                            value={driver.totalEarnings?.toFixed(2) || '0.00'}
                                            prefix="Rs:"
                                        />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic
                                            title="Current Balance"
                                            value={driver.currentBalance?.toFixed(2) || '0.00'}
                                            prefix="Rs:"
                                        />
                                    </Col>
                                    <Col xs={12} sm={8}>
                                        <Statistic
                                            title="Total Withdraws"
                                            value={driver.totalWithdraws?.toFixed(2) || '0.00'}
                                            prefix="Rs:"
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        {/* Documents */}
                        <Col span={24}>
                            <Card
                                title={
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <FileTextOutlined className="mr-2" />
                                            <span>Documents</span>
                                        </div>
                                        <Tooltip title="Edit Documents">
                                            <Button
                                                type="text"
                                                icon={<EditOutlined />}
                                                onClick={handleEditDocuments}
                                            />
                                        </Tooltip>
                                    </div>
                                }
                            >
                                {driver.documents ? (
                                    <Row gutter={[16, 16]}>
                                        <Col xs={12} sm={8}>
                                            <div className="font-medium mb-2">License</div>
                                            {driver.documents.licenseImage ? (
                                                <Image
                                                    width={100}
                                                    src={driver.documents.licenseImage}
                                                    alt="License"
                                                    preview={{
                                                        mask: 'View Document',
                                                    }}
                                                />
                                            ) : (
                                                <Text>N/A</Text>
                                            )}
                                        </Col>
                                        <Col xs={12} sm={8}>
                                            <div className="font-medium mb-2">NIC</div>
                                            {driver.documents.nicImage ? (
                                                <Image
                                                    width={100}
                                                    src={driver.documents.nicImage}
                                                    alt="NIC"
                                                    preview={{
                                                        mask: 'View Document',
                                                    }}
                                                />
                                            ) : (
                                                <Text>N/A</Text>
                                            )}
                                        </Col>
                                        <Col xs={12} sm={8}>
                                            <div className="font-medium mb-2">Vehicle Registration</div>
                                            {driver.documents.vehicleRegistrationImage ? (
                                                <Image
                                                    width={100}
                                                    src={driver.documents.vehicleRegistrationImage}
                                                    alt="Vehicle Registration"
                                                    preview={{
                                                        mask: 'View Document',
                                                    }}
                                                />
                                            ) : (
                                                <Text>N/A</Text>
                                            )}
                                        </Col>
                                        <Col xs={12} sm={8}>
                                            <div className="font-medium mb-2">Insurance</div>
                                            {driver.documents.insuranceImage ? (
                                                <Image
                                                    width={100}
                                                    src={driver.documents.insuranceImage}
                                                    alt="Insurance"
                                                    preview={{
                                                        mask: 'View Document',
                                                    }}
                                                />
                                            ) : (
                                                <Text>N/A</Text>
                                            )}
                                        </Col>
                                        <Col xs={12} sm={8}>
                                            <div className="font-medium mb-2">Bank Statement</div>
                                            {driver.documents.bankStatementImage ? (
                                                <Image
                                                    width={100}
                                                    src={driver.documents.bankStatementImage}
                                                    alt="Bank Statement"
                                                    preview={{
                                                        mask: 'View Document',
                                                    }}
                                                />
                                            ) : (
                                                <Text>N/A</Text>
                                            )}
                                        </Col>
                                    </Row>
                                ) : (
                                    <Text>No documents uploaded</Text>
                                )}
                            </Card>
                        </Col>

                        {/* Driver History Section */}
                        <Col span={24}>
                            <Card
                                title={
                                    <div className="flex items-center">
                                        <HistoryOutlined className="mr-2" />
                                        <span>Driver History</span>
                                    </div>
                                }
                            >
                                <DriverHistory driverId={driver.id} />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            {/* Modal to show DriverAccountStatus */}
            <Modal
                title="Edit Account & Status"
                open={showModal}
                onCancel={handleClose}
                footer={null}
                width={700}
                centered
                className='mt-3 pt-5'
            >
                <DriverAccountStatus
                    driverId={driver.id}
                    onClose={handleClose}
                    onUpdateSuccess={handleUpdateSuccess}
                />
            </Modal>
        </div>
    );
};

export default DriverDetailPage;