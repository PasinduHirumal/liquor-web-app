import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import {
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    Paper
} from "@mui/material";
import toast from "react-hot-toast";

function DriverProfileInfo() {
    const { id } = useParams();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        address: ""
    });

    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const response = await axiosInstance.get(`/drivers/getDriverById/${id}`);
                const data = response.data;
                setDriver(data);
                setFormData({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    phone: data.phone || "",
                    address: data.address || ""
                });
            } catch (error) {
                toast.error("Failed to fetch driver data");
            } finally {
                setLoading(false);
            }
        };

        fetchDriver();
    }, [id]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            await axiosInstance.patch(`/drivers/update/${id}`, formData);
            toast.success("Driver updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update driver");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (!driver) {
        return <Typography color="error">Driver not found</Typography>;
    }

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto", mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Edit Driver Profile
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    fullWidth
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpdate}
                    disabled={updating}
                >
                    {updating ? "Updating..." : "Update Profile"}
                </Button>
            </Box>
        </Paper>
    );
}

export default DriverProfileInfo;
