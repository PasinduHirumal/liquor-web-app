import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../lib/axios";
import {
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress,
    Paper,
    Avatar,
    Grid
} from "@mui/material";
import toast from "react-hot-toast";

function DriverProfileInfo() {
    const { id } = useParams();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        nic_number: "",
        license_number: "",
        dateOfBirth: "",
        profileImage: "",
        address: "",
        city: "",
        emergencyContact: ""
    });

    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const response = await axiosInstance.get(`/drivers/getDriverById/${id}`);
                const data = response.data;

                setDriver(data);
                setFormData({
                    email: data.email || "",
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    phone: data.phone || "",
                    nic_number: data.nic_number || "",
                    license_number: data.license_number || "",
                    dateOfBirth: data.dateOfBirth || "",
                    profileImage: data.profileImage || "",
                    address: data.address || "",
                    city: data.city || "",
                    emergencyContact: data.emergencyContact || ""
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
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({
                ...prev,
                profileImage: reader.result // base64 string
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleUpdate = async () => {
        setUpdating(true);
        try {
            const updatePayload = { ...formData };

            await axiosInstance.patch(`/drivers/update/${id}`, updatePayload);
            toast.success("Driver profile updated successfully");
        } catch (error) {
            const msg = error?.response?.data?.message || "Failed to update driver";
            toast.error(msg);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <CircularProgress sx={{ mt: 4, mx: "auto", display: "block" }} />;

    if (!driver) return <Typography color="error">Driver not found</Typography>;

    return (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: "auto", mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Edit Driver Personal Information
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Avatar
                            src={formData.profileImage}
                            alt={formData.firstName}
                            sx={{ width: 64, height: 64 }}
                        />
                    </Grid>
                    <Grid item xs>
                        <Button variant="outlined" component="label" fullWidth>
                            Upload Profile Image
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </Button>
                    </Grid>
                </Grid>

                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                />
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
                    label="NIC Number"
                    name="nic_number"
                    value={formData.nic_number}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="License Number"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Date of Birth"
                    name="dateOfBirth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    fullWidth
                />
                <TextField
                    label="Emergency Contact"
                    name="emergencyContact"
                    value={formData.emergencyContact}
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
                <TextField
                    label="City"
                    name="city"
                    value={formData.city}
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
