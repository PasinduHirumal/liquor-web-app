import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Switch, Button, message, Space, Row, Col, Spin } from "antd";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue - More robust solution
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const defaultCenter = [7.2083, 79.8358]; // Negombo, Sri Lanka

function EditSuperMarketModal({ open, onClose, marketData, onSuccess }) {
    const [form] = Form.useForm();
    const [updating, setUpdating] = useState(false);
    const [marker, setMarker] = useState(null);
    const [fetchingAddress, setFetchingAddress] = useState(false);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {
        if (marketData && open) {
            // Set marker if coordinates exist
            const location = marketData.location || {};
            if (location.lat && location.lng) {
                setMarker([location.lat, location.lng]);
            } else {
                setMarker(null);
            }

            form.setFieldsValue({
                superMarket_Name: marketData.superMarket_Name || "",
                streetAddress: marketData.streetAddress || "",
                city: marketData.city || "",
                state: marketData.state || "",
                postalCode: marketData.postalCode || "",
                country: marketData.country || "",
                isActive: marketData.isActive !== undefined ? marketData.isActive : true,
                lat: location.lat ?? null,
                lng: location.lng ?? null,
            });

            // Reset map ready state and set ready after delay
            setMapReady(false);
            setTimeout(() => {
                setMapReady(true);
            }, 100);
        }
    }, [marketData, form, open]);

    // Map click handler component
    function MapClickHandler() {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setMarker([lat, lng]);
                updateLocationFields(lat, lng);
            },
        });
        return null;
    }

    // Function to get address from coordinates
    const getAddressFromCoordinates = async (lat, lng) => {
        setFetchingAddress(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const data = await res.json();

            if (data.display_name) {
                const address = data.address || {};
                const streetAddress = address.road || address.pedestrian || address.footway || data.display_name.split(',')[0] || "";
                const city = address.city || address.town || address.village || "";
                const state = address.state || address.province || "";
                const postalCode = address.postcode || "";
                const country = address.country || "";

                // Update form fields
                const updates = {
                    lat: lat,
                    lng: lng
                };

                if (streetAddress) updates.streetAddress = streetAddress;
                if (city) updates.city = city;
                if (state) updates.state = state;
                if (postalCode) updates.postalCode = postalCode;
                if (country) updates.country = country;

                form.setFieldsValue(updates);

                toast.success("Location updated with address details!");
            } else {
                // Still set coordinates even if address not found
                form.setFieldsValue({
                    lat: lat,
                    lng: lng
                });
                toast.warning("Coordinates updated. Please enter address manually.");
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            toast.error("Failed to fetch address details. Please enter address manually.");
            // Still set coordinates
            form.setFieldsValue({
                lat: lat,
                lng: lng
            });
        } finally {
            setFetchingAddress(false);
        }
    };

    const updateLocationFields = (lat, lng) => {
        getAddressFromCoordinates(lat, lng);
    };

    // Get current location using browser geolocation
    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        toast.loading("Getting your location...", { id: "getLocation" });

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setMarker([lat, lng]);
                updateLocationFields(lat, lng);
                toast.success("Location detected!", { id: "getLocation" });
            },
            (error) => {
                console.error("Geolocation error:", error);
                toast.error("Failed to get current location", { id: "getLocation" });
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error("Location permission denied. Please enable location access.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        toast.error("Location information unavailable");
                        break;
                    case error.TIMEOUT:
                        toast.error("Location request timed out");
                        break;
                    default:
                        toast.error("Failed to get current location");
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const handleUpdate = async (values) => {
        try {
            setUpdating(true);

            // Validate coordinates if provided
            if (values.lat && (values.lat < -90 || values.lat > 90)) {
                toast.error("Latitude must be between -90 and 90");
                return;
            }

            if (values.lng && (values.lng < -180 || values.lng > 180)) {
                toast.error("Longitude must be between -180 and 180");
                return;
            }

            // Merge latitude and longitude into location object
            const payload = {
                superMarket_Name: values.superMarket_Name,
                streetAddress: values.streetAddress,
                city: values.city,
                state: values.state,
                postalCode: values.postalCode,
                country: values.country,
                isActive: values.isActive,
                location: {}
            };

            // Only add location if coordinates exist
            if (values.lat !== undefined && values.lat !== null && values.lat !== "") {
                payload.location.lat = parseFloat(values.lat);
            }
            if (values.lng !== undefined && values.lng !== null && values.lng !== "") {
                payload.location.lng = parseFloat(values.lng);
            }

            // Remove location object if empty
            if (Object.keys(payload.location).length === 0) {
                delete payload.location;
            }

            const res = await axiosInstance.patch(`/superMarket/update/${marketData.id}`, payload);

            if (res.data?.success) {
                toast.success("Supermarket updated successfully");
                form.resetFields();
                setMarker(null);
                onClose();
                onSuccess();
            } else {
                const errorMsg = res.data?.message || "Failed to update supermarket";
                toast.error(errorMsg);
            }
        } catch (err) {
            console.error("Update error:", err);

            if (err.response?.data?.errors) {
                err.response.data.errors.forEach(e => {
                    toast.error(`${e.field}: ${e.message}`);
                });
            } else {
                const errorMsg = err.response?.data?.message || "Server Error";
                toast.error(errorMsg);
            }
        } finally {
            setUpdating(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setMarker(null);
        onClose();
    };

    return (
        <Modal
            title="Edit Supermarket"
            open={open}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
            maskClosable={false}
            width={900}
            bodyStyle={{ maxHeight: '70vh', overflowY: 'auto', padding: '24px' }}
            afterClose={() => {
                setMapReady(false);
                setMarker(null);
            }}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={handleUpdate}
                scrollToFirstError
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Name"
                            name="superMarket_Name"
                            rules={[{ required: true, message: 'Please enter supermarket name' }]}
                        >
                            <Input placeholder="Enter supermarket name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Country"
                            name="country"
                            rules={[{ required: true, message: 'Please enter country' }]}
                        >
                            <Input placeholder="Enter country" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Street Address"
                    name="streetAddress"
                    rules={[{ required: true, message: 'Please enter street address' }]}
                >
                    <Input.TextArea
                        placeholder="Enter full street address"
                        rows={2}
                        autoSize={{ minRows: 2, maxRows: 3 }}
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="City"
                            name="city"
                            rules={[{ required: true, message: 'Please enter city' }]}
                        >
                            <Input placeholder="Enter city" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="State"
                            name="state"
                            rules={[{ required: true, message: 'Please enter state' }]}
                        >
                            <Input placeholder="Enter state" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Postal Code"
                            name="postalCode"
                            rules={[{ required: true, message: 'Please enter postal code' }]}
                        >
                            <Input placeholder="Enter postal code" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Location Picker Section */}
                <Row gutter={16}>
                    <Col span={24}>
                        <div style={{ marginBottom: 16 }}>
                            <Button
                                onClick={getCurrentLocation}
                                icon={<span>📍</span>}
                            >
                                Use My Current Location
                            </Button>
                        </div>

                        <Form.Item label="Pick Location on Map">
                            <div
                                style={{
                                    height: '400px',
                                    width: '100%',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    backgroundColor: '#f0f2f5'
                                }}
                            >
                                {!mapReady ? (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: '#f0f2f5',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            flexDirection: 'column',
                                            gap: '12px',
                                            zIndex: 1000
                                        }}
                                    >
                                        <Spin size="large" />
                                        <span style={{ color: '#666', fontSize: '14px' }}>
                                            Loading map...
                                        </span>
                                    </div>
                                ) : (
                                    <MapContainer
                                        center={marker || defaultCenter}
                                        zoom={13}
                                        style={{ height: "100%", width: "100%" }}
                                        zoomControl={true}
                                        scrollWheelZoom={true}
                                        doubleClickZoom={true}
                                        whenReady={() => {
                                            console.log("Map is ready");
                                        }}
                                    >
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <MapClickHandler />
                                        {marker && (
                                            <Marker
                                                position={marker}
                                                draggable={true}
                                                eventHandlers={{
                                                    dragend: (e) => {
                                                        const { lat, lng } = e.target.getLatLng();
                                                        setMarker([lat, lng]);
                                                        updateLocationFields(lat, lng);
                                                    }
                                                }}
                                            />
                                        )}
                                    </MapContainer>
                                )}
                            </div>

                            {fetchingAddress && (
                                <div style={{ textAlign: 'center', marginTop: 8 }}>
                                    <Spin size="small" />
                                    <span style={{ marginLeft: 8 }}>Fetching address details...</span>
                                </div>
                            )}

                            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                                <small>💡 Tip: Click on the map to select location, or drag the marker to adjust</small>
                            </div>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Latitude / Longitude */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Latitude"
                            name="lat"
                            rules={[
                                {
                                    type: 'number',
                                    min: -90,
                                    max: 90,
                                    message: 'Latitude must be between -90 and 90'
                                }
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="Latitude (-90 to 90)"
                                precision={6}
                                step={0.000001}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Longitude"
                            name="lng"
                            rules={[
                                {
                                    type: 'number',
                                    min: -180,
                                    max: 180,
                                    message: 'Longitude must be between -180 and 180'
                                }
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="Longitude (-180 to 180)"
                                precision={6}
                                step={0.000001}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Status"
                    name="isActive"
                    valuePropName="checked"
                >
                    <Switch
                        checkedChildren="Active"
                        unCheckedChildren="Inactive"
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Space>
                        <Button onClick={handleCancel} disabled={updating}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" loading={updating}>
                            Update Supermarket
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default EditSuperMarketModal;