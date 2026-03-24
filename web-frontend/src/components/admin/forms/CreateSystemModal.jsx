import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Button, Row, Col } from 'antd';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from "leaflet";
import { axiosInstance } from '../../../lib/axios';
import toast from 'react-hot-toast';
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue - MORE ROBUST SOLUTION
const DefaultIcon = L.icon({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const defaultCenter = [7.2083, 79.8358]; // Negombo, Sri Lanka

const CreateSystemModal = ({ show, onHide, onCreateSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [marker, setMarker] = useState(null);
    const [fetchingAddress, setFetchingAddress] = useState(false);
    const [mapKey, setMapKey] = useState(0); // Force map re-render

    // Reset map when modal opens
    useEffect(() => {
        if (show) {
            setMapKey(prev => prev + 1);
            form.setFieldsValue({
                delivery_charge_for_1KM: 0.01,
                service_charge: 0,
                tax_charge: 0,
                isActive: true,
                isLiquorActive: true,
                where_house_location: {
                    lat: null,
                    lng: null
                }
            });
            setMarker(null);
        }
    }, [show, form]);

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
                const formattedAddress = [
                    address.road || address.pedestrian || address.footway,
                    address.city || address.town || address.village,
                    address.state || address.province,
                    address.postcode,
                    address.country
                ].filter(Boolean).join(', ');

                // Update form fields
                form.setFieldsValue({
                    address: formattedAddress || data.display_name.split(',')[0],
                    where_house_location: {
                        lat: lat,
                        lng: lng
                    }
                });

                toast.success("Location selected!");
            } else {
                // Still set coordinates even if address not found
                form.setFieldsValue({
                    where_house_location: {
                        lat: lat,
                        lng: lng
                    }
                });
                toast.warning("Coordinates selected. Please enter address manually.");
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            toast.error("Failed to fetch address details. Please enter address manually.");
            // Still set coordinates
            form.setFieldsValue({
                where_house_location: {
                    lat: lat,
                    lng: lng
                }
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

    const handleSubmit = async (values) => {
        // Validate coordinates
        if (!values.where_house_location?.lat || !values.where_house_location?.lng) {
            toast.error("Please select a location on the map!");
            return;
        }

        // Validate latitude and longitude ranges
        if (values.where_house_location.lat < -90 || values.where_house_location.lat > 90) {
            toast.error("Latitude must be between -90 and 90");
            return;
        }

        if (values.where_house_location.lng < -180 || values.where_house_location.lng > 180) {
            toast.error("Longitude must be between -180 and 180");
            return;
        }

        try {
            setLoading(true);
            const response = await axiosInstance.post('/system/create', values);
            toast.success("Warehouse created successfully");
            form.resetFields();
            setMarker(null);
            onCreateSuccess(response.data.data);
            onHide(); // Close modal after success
        } catch (error) {
            if (error.response?.data?.errors?.length > 0) {
                error.response.data.errors.forEach(err => {
                    toast.error(`${err.message}`);
                });
            } else {
                toast.error(error.response?.data?.message || 'Failed to create warehouse');
            }
        } finally {
            setLoading(false);
        }
    };

    // Reset form and marker when modal closes
    const handleCancel = () => {
        form.resetFields();
        setMarker(null);
        onHide();
    };

    return (
        <Modal
            title="Create Warehouse"
            open={show}
            onCancel={handleCancel}
            maskClosable={false}
            afterClose={() => {
                form.resetFields();
                setMarker(null);
            }}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Cancel
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={() => form.submit()}
                >
                    Create
                </Button>,
            ]}
            width={900}
            bodyStyle={{ maxHeight: '70vh', overflowY: 'auto', padding: '24px' }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                {/* Warehouse Name and Delivery Charge */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="where_house_name"
                            label="Warehouse Name"
                            rules={[{ required: true, message: 'Please enter warehouse name!' }]}
                        >
                            <Input placeholder="Warehouse 1" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="delivery_charge_for_1KM"
                            label="Delivery Charge (per 1KM)"
                            rules={[{ required: true, message: 'Please input delivery charge!' }]}
                        >
                            <InputNumber 
                                min={0.01} 
                                step={0.01} 
                                style={{ width: '100%' }}
                                precision={2}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Location Picker Section */}
                <Row gutter={16}>
                    <Col span={24}>
                        <div style={{ marginBottom: 16 }}>
                            <Button 
                                onClick={getCurrentLocation}
                                style={{ marginBottom: 12 }}
                                icon={<span>📍</span>}
                            >
                                Use My Current Location
                            </Button>
                        </div>
                        
                        <Form.Item label="Pick Location on Map">
                            <div 
                                key={mapKey}
                                style={{ 
                                    height: '400px', 
                                    width: '100%', 
                                    borderRadius: '8px', 
                                    overflow: 'hidden',
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                <MapContainer
                                    key={mapKey}
                                    center={marker || defaultCenter}
                                    zoom={13}
                                    style={{ height: "100%", width: "100%" }}
                                    zoomControl={true}
                                    scrollWheelZoom={true}
                                    doubleClickZoom={true}
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
                            </div>
                            {fetchingAddress && (
                                <div style={{ textAlign: 'center', marginTop: 8 }}>
                                    <span>Fetching address details...</span>
                                </div>
                            )}
                            <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                                <small>💡 Tip: Click on the map to select location, or drag the marker to adjust</small>
                            </div>
                        </Form.Item>
                    </Col>
                </Row>

                {/* Address Field */}
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[
                                { required: true, message: 'Please enter address!' },
                                { min: 2, max: 350, message: 'Address must be between 2 and 350 characters' }
                            ]}
                        >
                            <Input.TextArea 
                                placeholder="123 Main St, City, Country" 
                                rows={3}
                                autoComplete="off"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Latitude / Longitude */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name={['where_house_location', 'lat']}
                            label="Latitude"
                            rules={[
                                { required: true, message: 'Latitude is required!' },
                                { 
                                    type: 'number', 
                                    min: -90, 
                                    max: 90, 
                                    message: 'Latitude must be between -90 and 90' 
                                }
                            ]}
                        >
                            <InputNumber 
                                placeholder="Latitude" 
                                style={{ width: '100%' }}
                                precision={6}
                                step={0.000001}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={['where_house_location', 'lng']}
                            label="Longitude"
                            rules={[
                                { required: true, message: 'Longitude is required!' },
                                { 
                                    type: 'number', 
                                    min: -180, 
                                    max: 180, 
                                    message: 'Longitude must be between -180 and 180' 
                                }
                            ]}
                        >
                            <InputNumber 
                                placeholder="Longitude" 
                                style={{ width: '100%' }}
                                precision={6}
                                step={0.000001}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Service Charge and Tax */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="service_charge"
                            label="Service Charge (%)"
                            rules={[
                                { required: true, message: 'Please input service charge!' },
                                {
                                    type: 'number',
                                    min: 0,
                                    max: 100,
                                    message: 'Service charge must be between 0% and 100%',
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                max={100}
                                step={0.1}
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}%`}
                                parser={(value) => value.replace('%', '')}
                                precision={1}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="tax_charge"
                            label="Tax Charge (%)"
                            rules={[
                                { required: true, message: 'Please input tax charge!' },
                                {
                                    type: 'number',
                                    min: 0,
                                    max: 100,
                                    message: 'Tax charge must be between 0% and 100%',
                                },
                            ]}
                        >
                            <InputNumber
                                min={0}
                                max={100}
                                step={0.1}
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}%`}
                                parser={(value) => value.replace('%', '')}
                                precision={1}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Status Switches */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="isActive"
                            label="System Status"
                            valuePropName="checked"
                        >
                            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="isLiquorActive"
                            label="Liquor Status"
                            valuePropName="checked"
                        >
                            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default CreateSystemModal;