import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../../../lib/axios';
import { Box, Typography, Card, CardContent, Divider, Grid, Avatar, Chip, CircularProgress } from '@mui/material';
import { LocationOn, DirectionsCar, AccountBalance, Star, Work, Description } from '@mui/icons-material';

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
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!driver) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography>Driver not found</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Driver Details
            </Typography>

            <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                <Avatar
                                    src={driver.profileImage}
                                    sx={{ width: 120, height: 120, mb: 2 }}
                                />
                                <Typography variant="h5">
                                    {driver.firstName} {driver.lastName}
                                </Typography>
                                <Typography color="textSecondary">
                                    {driver.email}
                                </Typography>
                                <Box mt={1}>
                                    <Chip
                                        label={driver.isActive ? 'Active' : 'Inactive'}
                                        color={driver.isActive ? 'success' : 'error'}
                                        size="small"
                                    />
                                    {driver.isDocumentVerified && (
                                        <Chip
                                            label="Verified"
                                            color="success"
                                            size="small"
                                            sx={{ ml: 1 }}
                                        />
                                    )}
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle1" gutterBottom>
                                Personal Information
                            </Typography>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Phone:
                                    </Typography>
                                    <Typography>{driver.phone}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        NIC:
                                    </Typography>
                                    <Typography>{driver.nic_number || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        License:
                                    </Typography>
                                    <Typography>{driver.license_number || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Date of Birth:
                                    </Typography>
                                    <Typography>
                                        {driver.dateOfBirth ? new Date(driver.dateOfBirth).toLocaleDateString() : 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="textSecondary">
                                        Address:
                                    </Typography>
                                    <Typography>
                                        {driver.address || 'N/A'}, {driver.city || ''}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body2" color="textSecondary">
                                        Emergency Contact:
                                    </Typography>
                                    <Typography>{driver.emergencyContact || 'N/A'}</Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Vehicle Information */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Box display="flex" alignItems="center" mb={2}>
                                <DirectionsCar color="primary" sx={{ mr: 1 }} />
                                <Typography variant="subtitle1">
                                    Vehicle Information
                                </Typography>
                            </Box>

                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Type:
                                    </Typography>
                                    <Typography>{driver.vehicleType || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Model:
                                    </Typography>
                                    <Typography>{driver.vehicleModel || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Number:
                                    </Typography>
                                    <Typography>{driver.vehicleNumber || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Color:
                                    </Typography>
                                    <Typography>{driver.vehicleColor || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Year:
                                    </Typography>
                                    <Typography>{driver.vehicleYear || 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Insurance:
                                    </Typography>
                                    <Typography>
                                        {driver.vehicleInsurance ? 'Yes' : 'No'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Registration:
                                    </Typography>
                                    <Typography>
                                        {driver.vehicleRegistration ? 'Valid' : 'N/A'}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            {/* Location & Delivery */}
                            <Box display="flex" alignItems="center" mb={2}>
                                <LocationOn color="primary" sx={{ mr: 1 }} />
                                <Typography variant="subtitle1">
                                    Location & Delivery
                                </Typography>
                            </Box>

                            {driver.currentLocation ? (
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="textSecondary">
                                            Current Location:
                                        </Typography>
                                        <Typography>
                                            Lat: {driver.currentLocation.lat?.toFixed(4)}, 
                                            Lng: {driver.currentLocation.lng?.toFixed(4)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="textSecondary">
                                            Status:
                                        </Typography>
                                        <Box display="flex" alignItems="center">
                                            <Chip
                                                label={driver.isOnline ? 'Online' : 'Offline'}
                                                color={driver.isOnline ? 'success' : 'default'}
                                                size="small"
                                            />
                                            <Chip
                                                label={driver.isAvailable ? 'Available' : 'Busy'}
                                                color={driver.isAvailable ? 'success' : 'warning'}
                                                size="small"
                                                sx={{ ml: 1 }}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="textSecondary">
                                            Max Delivery Radius:
                                        </Typography>
                                        <Typography>{driver.maxDeliveryRadius || 'N/A'} km</Typography>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Typography>Location data not available</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Performance & Financial */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            {/* Performance & Ratings */}
                            <Box display="flex" alignItems="center" mb={2}>
                                <Star color="primary" sx={{ mr: 1 }} />
                                <Typography variant="subtitle1">
                                    Performance & Ratings
                                </Typography>
                            </Box>

                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Rating:
                                    </Typography>
                                    <Box display="flex" alignItems="center">
                                        <Star color="warning" sx={{ mr: 0.5 }} />
                                        <Typography>
                                            {driver.rating?.toFixed(1) || '0.0'} ({driver.totalRatings || 0})
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Deliveries:
                                    </Typography>
                                    <Typography>
                                        {driver.completedDeliveries || 0} completed
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Cancelled:
                                    </Typography>
                                    <Typography>
                                        {driver.cancelledDeliveries || 0}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        On Time Rate:
                                    </Typography>
                                    <Typography>
                                        {driver.onTimeDeliveryRate ? `${driver.onTimeDeliveryRate}%` : 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Avg. Time:
                                    </Typography>
                                    <Typography>
                                        {driver.averageDeliveryTime || 'N/A'}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            {/* Financial Information */}
                            <Box display="flex" alignItems="center" mb={2}>
                                <AccountBalance color="primary" sx={{ mr: 1 }} />
                                <Typography variant="subtitle1">
                                    Financial Information
                                </Typography>
                            </Box>

                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Bank:
                                    </Typography>
                                    <Typography>
                                        {driver.bankName || 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Account:
                                    </Typography>
                                    <Typography>
                                        {driver.bankAccountNumber ? `••••${driver.bankAccountNumber.slice(-4)}` : 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Commission:
                                    </Typography>
                                    <Typography>
                                        {driver.commissionRate ? `${driver.commissionRate}%` : 'N/A'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Total Earnings:
                                    </Typography>
                                    <Typography>
                                        ${driver.totalEarnings?.toFixed(2) || '0.00'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body2" color="textSecondary">
                                        Current Balance:
                                    </Typography>
                                    <Typography>
                                        ${driver.currentBalance?.toFixed(2) || '0.00'}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            {/* Documents */}
                            <Box display="flex" alignItems="center" mb={2}>
                                <Description color="primary" sx={{ mr: 1 }} />
                                <Typography variant="subtitle1">
                                    Documents
                                </Typography>
                            </Box>

                            {driver.documents ? (
                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="textSecondary">
                                            License:
                                        </Typography>
                                        {driver.documents.licenseImage ? (
                                            <a href={driver.documents.licenseImage} target="_blank" rel="noopener noreferrer">
                                                View
                                            </a>
                                        ) : (
                                            <Typography>N/A</Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="textSecondary">
                                            NIC:
                                        </Typography>
                                        {driver.documents.nicImage ? (
                                            <a href={driver.documents.nicImage} target="_blank" rel="noopener noreferrer">
                                                View
                                            </a>
                                        ) : (
                                            <Typography>N/A</Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="textSecondary">
                                            Vehicle Registration:
                                        </Typography>
                                        {driver.documents.vehicleRegistrationImage ? (
                                            <a href={driver.documents.vehicleRegistrationImage} target="_blank" rel="noopener noreferrer">
                                                View
                                            </a>
                                        ) : (
                                            <Typography>N/A</Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="body2" color="textSecondary">
                                            Insurance:
                                        </Typography>
                                        {driver.documents.insuranceImage ? (
                                            <a href={driver.documents.insuranceImage} target="_blank" rel="noopener noreferrer">
                                                View
                                            </a>
                                        ) : (
                                            <Typography>N/A</Typography>
                                        )}
                                    </Grid>
                                </Grid>
                            ) : (
                                <Typography>No documents uploaded</Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default DriverDetailPage;