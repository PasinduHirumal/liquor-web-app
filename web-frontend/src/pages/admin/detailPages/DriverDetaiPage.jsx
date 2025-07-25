import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../../../lib/axios';
import { Typography, Divider, Avatar, Chip, CircularProgress, IconButton, Tooltip, } from '@mui/material';
import { LocationOn, DirectionsCar, AccountBalance, Star, Description, Edit } from '@mui/icons-material';
import '../../../styles/DriverDetailPage.css';

const DriverDetailPage = () => {
    const { id } = useParams();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) {
        return (
            <div className="driver-detail-loading">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="driver-detail-error">
                <Typography color="error">{error}</Typography>
            </div>
        );
    }

    if (!driver) {
        return (
            <div className="driver-detail-not-found">
                <Typography>Driver not found</Typography>
            </div>
        );
    }

    return (
        <div className="driver-detail-container">
            <div className="driver-detail-header">
                <Typography variant="h4" className="driver-detail-title">
                    Driver Profile
                </Typography>
                <div className="driver-detail-status">
                    <Chip
                        label={driver.isActive ? 'Active' : 'Inactive'}
                        color={driver.isActive ? 'success' : 'error'}
                        size="medium"
                    />
                    {driver.isDocumentVerified && (
                        <Chip
                            label="Verified"
                            color="success"
                            size="medium"
                        />
                    )}
                </div>
            </div>

            <div className="driver-detail-content">
                {/* Left Column - Profile Section */}
                <div className="driver-detail-profile">
                    <div className="driver-detail-profile-card" style={{ position: "relative" }}>
                        {/* Edit Button */}
                        <Tooltip title="Edit Personal Detail">
                            <IconButton
                                style={{ position: "absolute", top: 8, right: 8 }}
                                aria-label="edit profile"
                            >
                                <Edit />
                            </IconButton>
                        </Tooltip>

                        <Avatar
                            src={driver.profileImage}
                            className="driver-detail-avatar"
                        />
                        <Typography variant="h6" className="driver-detail-section-title border-0">
                            {driver.firstName} {driver.lastName}
                        </Typography>

                        <div className="driver-detail-contact">
                            <Typography variant="h6" className="driver-detail-section-title">
                                Contact Information
                            </Typography>
                            <div className="driver-detail-info-item">
                                <span className="driver-detail-info-label">Email:</span>
                                <span className="driver-detail-info-value">{driver.email || "N/A"}</span>
                            </div>
                            <div className="driver-detail-info-item">
                                <span className="driver-detail-info-label">Phone:</span>
                                <span className="driver-detail-info-value">{driver.phone || "N/A"}</span>
                            </div>
                            <div className="driver-detail-info-item">
                                <span className="driver-detail-info-label">Address:</span>
                                <span className="driver-detail-info-value">
                                    {driver.address || "N/A"}, {driver.city || ""}
                                </span>
                            </div>
                            <div className="driver-detail-info-item">
                                <span className="driver-detail-info-label">Emergency Contact:</span>
                                <span className="driver-detail-info-value">{driver.emergencyContact || "N/A"}</span>
                            </div>
                        </div>

                        <Divider className="driver-detail-divider" />

                        <div className="driver-detail-identification">
                            <Typography variant="h6" className="driver-detail-section-title">
                                Identification
                            </Typography>
                            <div className="driver-detail-info-item">
                                <span className="driver-detail-info-label">NIC Number:</span>
                                <span className="driver-detail-info-value">{driver.nic_number || "N/A"}</span>
                            </div>
                            <div className="driver-detail-info-item">
                                <span className="driver-detail-info-label">License Number:</span>
                                <span className="driver-detail-info-value">{driver.license_number || "N/A"}</span>
                            </div>
                            <div className="driver-detail-info-item">
                                <span className="driver-detail-info-label">Date of Birth:</span>
                                <span className="driver-detail-info-value">
                                    {driver.dateOfBirth
                                        ? new Date(driver.dateOfBirth).toLocaleDateString()
                                        : "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Details Section */}
                <div className="driver-detail-sections">
                    {/* Vehicle Information */}
                    <div className="driver-detail-section-card">
                        <div className="driver-detail-section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <DirectionsCar className="driver-detail-section-icon" />
                                <Typography variant="h6">Vehicle Information</Typography>
                            </div>
                            <Tooltip title="Edit Vehicle Information">
                                <IconButton aria-label="edit vehicle info">
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className="driver-detail-section-grid">
                            <div className="driver-detail-grid-item">
                                <span className="driver-detail-info-label">Type</span>
                                <span className="driver-detail-info-value">{driver.vehicleType || 'N/A'}</span>
                            </div>
                            <div className="driver-detail-grid-item">
                                <span className="driver-detail-info-label">Model</span>
                                <span className="driver-detail-info-value">{driver.vehicleModel || 'N/A'}</span>
                            </div>
                            <div className="driver-detail-grid-item">
                                <span className="driver-detail-info-label">Number</span>
                                <span className="driver-detail-info-value">{driver.vehicleNumber || 'N/A'}</span>
                            </div>
                            <div className="driver-detail-grid-item">
                                <span className="driver-detail-info-label">Color</span>
                                <span className="driver-detail-info-value">{driver.vehicleColor || 'N/A'}</span>
                            </div>
                            <div className="driver-detail-grid-item">
                                <span className="driver-detail-info-label">Year</span>
                                <span className="driver-detail-info-value">{driver.vehicleYear || 'N/A'}</span>
                            </div>
                            <div className="driver-detail-grid-item">
                                <span className="driver-detail-info-label">Insurance</span>
                                <span className="driver-detail-info-value">
                                    {driver.vehicleInsurance ? 'Valid' : 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Location & Status */}
                    <div className="driver-detail-section-card">
                        <div className="driver-detail-section-header" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <LocationOn className="driver-detail-section-icon" />
                                <Typography variant="h6">Location & Status</Typography>
                            </div>
                            <Tooltip title="Edit Location & Status">
                                <IconButton aria-label="edit location">
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className="driver-detail-section-grid">
                            {driver.currentLocation ? (
                                <>
                                    <div className="driver-detail-grid-item wide">
                                        <span className="driver-detail-info-label">Current Location</span>
                                        <span className="driver-detail-info-value">
                                            Lat: {driver.currentLocation.lat?.toFixed(4)}, Lng: {driver.currentLocation.lng?.toFixed(4)}
                                        </span>
                                    </div>
                                    <div className="driver-detail-grid-item">
                                        <span className="driver-detail-info-label">Status</span>
                                        <div className="driver-detail-status-chips">
                                            <Chip
                                                label={driver.isOnline ? 'Online' : 'Offline'}
                                                color={driver.isOnline ? 'success' : 'default'}
                                                size="small"
                                            />
                                            <Chip
                                                label={driver.isAvailable ? 'Available' : 'Busy'}
                                                color={driver.isAvailable ? 'success' : 'warning'}
                                                size="small"
                                            />
                                        </div>
                                    </div>
                                    <div className="driver-detail-grid-item">
                                        <span className="driver-detail-info-label">Max Delivery Radius</span>
                                        <span className="driver-detail-info-value">
                                            {driver.maxDeliveryRadius || 'N/A'} km
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="driver-detail-grid-item wide">
                                    <span className="driver-detail-info-value">Location data not available</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Performance & Ratings */}
                    <div className="driver-detail-section-card">
                        <div className="driver-detail-section-header" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Star className="driver-detail-section-icon" />
                                <Typography variant="h6">Performance & Ratings</Typography>
                            </div>
                            <Tooltip title="Edit Performance Details">
                                <IconButton aria-label="edit performance">
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className="driver-detail-section-grid">
                            <div className="driver-detail-grid-item">
                                <span className="driver-detail-info-label">Rating</span>
                                <div className="driver-detail-rating">
                                    <Star className="driver-detail-star-icon" />
                                    <span className="driver-detail-info-value">
                                        {driver.rating?.toFixed(1) || '0.0'} ({driver.totalRatings || 0})
                                    </span>
                                </div>
                            </div>
                            <div className="driver-detail-grid-item">
                                <span className="driver-detail-info-label">Deliveries</span>
                                <span className="driver-detail-info-value">
                                    {driver.completedDeliveries || 0} completed
                                </span>
                            </div>
                            <div className="driver-detail-grid-item">
                                <span className="driver-detail-info-label">Cancelled</span>
                                <span className="driver-detail-info-value">
                                    {driver.cancelledDeliveries || 0}
                                </span>
                            </div>
                            <div className="driver-detail-grid-item">
                                <span className="driver-detail-info-label">On Time Rate</span>
                                <span className="driver-detail-info-value">
                                    {driver.onTimeDeliveryRate ? `${driver.onTimeDeliveryRate}%` : 'N/A'}
                                </span>
                            </div>
                            <div className="driver-detail-grid-item">
                                <span className="driver-detail-info-label">Avg. Time</span>
                                <span className="driver-detail-info-value">
                                    {driver.averageDeliveryTime || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Financial Information */}
                    <div className="driver-detail-section-card">
                        <div className="driver-detail-section-header" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AccountBalance className="driver-detail-section-icon" />
                                <Typography variant="h6">Financial Information</Typography>
                            </div>
                            <Tooltip title="Edit Financial Informations">
                                <IconButton aria-label="edit financial information">
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className="driver-detail-section-grid">
                            <div className="driver-detail-grid-item">
                                <span className="driver-detail-info-label">Bank</span>
                                <span className="driver-detail-info-value">
                                    {driver.bankName || 'N/A'}
                                </span>
                            </div>
                            <div className="driver-detail-grid-item">
                                <span className="driver-detail-info-label">Account</span>
                                <span className="driver-detail-info-value">
                                    {driver.bankAccountNumber ? `••••${driver.bankAccountNumber.slice(-4)}` : 'N/A'}
                                </span>
                            </div>
                            <div className="driver-detail-grid-item">
                                <span className="driver-detail-info-label">Commission</span>
                                <span className="driver-detail-info-value">
                                    {driver.commissionRate ? `${driver.commissionRate}%` : 'N/A'}
                                </span>
                            </div>
                            <div className="driver-detail-grid-item">
                                <span className="driver-detail-info-label">Total Earnings</span>
                                <span className="driver-detail-info-value">
                                    ${driver.totalEarnings?.toFixed(2) || '0.00'}
                                </span>
                            </div>
                            <div className="driver-detail-grid-item">
                                <span className="driver-detail-info-label">Current Balance</span>
                                <span className="driver-detail-info-value">
                                    ${driver.currentBalance?.toFixed(2) || '0.00'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Documents */}
                    <div className="driver-detail-section-card">
                        <div className="driver-detail-section-header" style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Description className="driver-detail-section-icon" />
                                <Typography variant="h6">Documents</Typography>
                            </div>
                            <Tooltip title="Edit Documents">
                                <IconButton aria-label="edit documents">
                                    <Edit />
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className="driver-detail-section-grid">
                            {driver.documents ? (
                                <>
                                    <div className="driver-detail-grid-item">
                                        <span className="driver-detail-info-label">License</span>
                                        {driver.documents.licenseImage ? (
                                            <a
                                                href={driver.documents.licenseImage}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="driver-detail-document-link"
                                            >
                                                View Document
                                            </a>
                                        ) : (
                                            <span className="driver-detail-info-value">N/A</span>
                                        )}
                                    </div>
                                    <div className="driver-detail-grid-item">
                                        <span className="driver-detail-info-label">NIC</span>
                                        {driver.documents.nicImage ? (
                                            <a
                                                href={driver.documents.nicImage}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="driver-detail-document-link"
                                            >
                                                View Document
                                            </a>
                                        ) : (
                                            <span className="driver-detail-info-value">N/A</span>
                                        )}
                                    </div>
                                    <div className="driver-detail-grid-item">
                                        <span className="driver-detail-info-label">Vehicle Registration</span>
                                        {driver.documents.vehicleRegistrationImage ? (
                                            <a
                                                href={driver.documents.vehicleRegistrationImage}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="driver-detail-document-link"
                                            >
                                                View Document
                                            </a>
                                        ) : (
                                            <span className="driver-detail-info-value">N/A</span>
                                        )}
                                    </div>
                                    <div className="driver-detail-grid-item">
                                        <span className="driver-detail-info-label">Insurance</span>
                                        {driver.documents.insuranceImage ? (
                                            <a
                                                href={driver.documents.insuranceImage}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="driver-detail-document-link"
                                            >
                                                View Document
                                            </a>
                                        ) : (
                                            <span className="driver-detail-info-value">N/A</span>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="driver-detail-grid-item wide">
                                    <span className="driver-detail-info-value">No documents uploaded</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDetailPage;