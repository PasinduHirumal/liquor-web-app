import { useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import useUserAuthStore from "../stores/userAuthStore";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const defaultCenter = [7.2083, 79.8358]; // Negombo, Sri Lanka

export default function LocationPickerModal({ show, onHide, onAddressCreated }) {
    const { user } = useUserAuthStore();
    const [marker, setMarker] = useState(null);
    const [loading, setLoading] = useState(false);
    const [creatingAddress, setCreatingAddress] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [addressData, setAddressData] = useState({
        fullName: "",
        phoneNumber: "",
        streetAddress: "",
        buildingName: "",
        landmark: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        notes: "",
        isDefault: false,
        isActive: true,
        latitude: null,
        longitude: null
    });

    const getAddressFromCoordinates = async (lat, lng) => {
        setLoading(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
            );
            const data = await res.json();

            if (data.display_name) {
                // Extract address components
                const address = data.address || {};
                
                setAddressData(prev => ({
                    ...prev,
                    streetAddress: address.road || address.pedestrian || address.footway || data.display_name.split(',')[0] || "",
                    city: address.city || address.town || address.village || address.state_district || "",
                    state: address.state || address.province || address.region || "",
                    postalCode: address.postcode || "",
                    country: address.country || "",
                    latitude: lat,
                    longitude: lng
                }));

                setSelectedLocation({
                    lat,
                    lng,
                    displayName: data.display_name
                });
                
                toast.success("Location selected! Please review and save the address.");
            } else {
                toast.error("Address not found for this location");
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            toast.error("Failed to fetch address details");
        } finally {
            setLoading(false);
        }
    };

    function MapClickHandler() {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setMarker([lat, lng]);
                getAddressFromCoordinates(lat, lng);
            },
        });
        return null;
    }

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setMarker([lat, lng]);
                getAddressFromCoordinates(lat, lng);
            },
            (error) => {
                console.error("Geolocation error:", error);
                switch(error.code) {
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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddressData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleCreateAddress = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!addressData.streetAddress?.trim() || !addressData.city?.trim() || 
            !addressData.state?.trim() || !addressData.postalCode?.trim() || 
            !addressData.country?.trim()) {
            toast.error("Please fill in all required fields (Street Address, City, State, Postal Code, Country)");
            return;
        }

        // Validate phone number if provided
        if (addressData.phoneNumber && !/^\+\d{1,3}\d{4,14}$/.test(addressData.phoneNumber)) {
            toast.error("Phone number must be in international format starting with + (e.g., +947XXXXXXXX)");
            return;
        }

        setCreatingAddress(true);

        try {
            const payload = {
                fullName: addressData.fullName?.trim() || "",
                phoneNumber: addressData.phoneNumber?.trim() || null,
                streetAddress: addressData.streetAddress.trim(),
                buildingName: addressData.buildingName?.trim() || "",
                landmark: addressData.landmark?.trim() || "",
                city: addressData.city.trim(),
                state: addressData.state.trim(),
                postalCode: addressData.postalCode.trim(),
                country: addressData.country.trim(),
                notes: addressData.notes?.trim() || "",
                isDefault: addressData.isDefault || false,
                isActive: true,
                latitude: addressData.latitude,
                longitude: addressData.longitude
            };

            const response = await axiosInstance.post("/addresses/createAddress", payload);
            
            if (response.data.success) {
                toast.success("Address created successfully!");
                if (onAddressCreated) {
                    onAddressCreated(response.data.data);
                }
                onHide();
                resetForm();
            } else {
                toast.error(response.data.message || "Failed to create address");
            }
        } catch (error) {
            console.error("Error creating address:", error);
            if (error.response?.data?.errors) {
                error.response.data.errors.forEach(err => toast.error(err.message));
            } else {
                toast.error(error.response?.data?.message || "Failed to create address");
            }
        } finally {
            setCreatingAddress(false);
        }
    };

    const resetForm = () => {
        setMarker(null);
        setSelectedLocation(null);
        setAddressData({
            fullName: "",
            phoneNumber: "",
            streetAddress: "",
            buildingName: "",
            landmark: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            notes: "",
            isDefault: false,
            isActive: true,
            latitude: null,
            longitude: null
        });
    };

    const handleClose = () => {
        resetForm();
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>Select Location on Map</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Row>
                    <Col lg={7}>
                        <div className="mb-3">
                            <Button 
                                variant="warning" 
                                onClick={getCurrentLocation}
                                className="mb-2"
                            >
                                📍 Use My Current Location
                            </Button>
                        </div>

                        <MapContainer
                            center={marker || defaultCenter}
                            zoom={13}
                            style={{ height: "500px", width: "100%", borderRadius: "8px" }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapClickHandler />
                            {marker && (
                                <Marker 
                                    position={marker} 
                                    draggable
                                    eventHandlers={{
                                        dragend: (e) => {
                                            const { lat, lng } = e.target.getLatLng();
                                            setMarker([lat, lng]);
                                            getAddressFromCoordinates(lat, lng);
                                        }
                                    }}
                                />
                            )}
                        </MapContainer>

                        {loading && (
                            <div className="text-center mt-3">
                                <Spinner animation="border" size="sm" />
                                <span className="ms-2">Fetching address details...</span>
                            </div>
                        )}
                    </Col>

                    <Col lg={5}>
                        <h6 className="mb-3">Address Details</h6>
                        
                        {selectedLocation && (
                            <div className="alert alert-info mb-3">
                                <small>
                                    <strong>Selected Location:</strong><br />
                                    {selectedLocation.displayName}
                                </small>
                            </div>
                        )}

                        <Form onSubmit={handleCreateAddress}>
                            <Form.Group className="mb-2">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="fullName"
                                    value={addressData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                />
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="phoneNumber"
                                    value={addressData.phoneNumber}
                                    onChange={handleInputChange}
                                    placeholder="+947XXXXXXXX"
                                />
                                <Form.Text className="text-muted">
                                    International format starting with +
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Street Address *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="streetAddress"
                                    value={addressData.streetAddress}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Building / Apartment</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="buildingName"
                                            value={addressData.buildingName}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Landmark</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="landmark"
                                            value={addressData.landmark}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>City *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="city"
                                            value={addressData.city}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>State *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="state"
                                            value={addressData.state}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Postal Code *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="postalCode"
                                            value={addressData.postalCode}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Country *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="country"
                                            value={addressData.country}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-2">
                                <Form.Label>Delivery Notes</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="notes"
                                    value={addressData.notes}
                                    onChange={handleInputChange}
                                    placeholder="Additional delivery instructions..."
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    name="isDefault"
                                    checked={addressData.isDefault}
                                    onChange={handleInputChange}
                                    label="Set as default address"
                                />
                            </Form.Group>

                            <div className="d-flex gap-2">
                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    className="flex-grow-1"
                                    disabled={creatingAddress || !selectedLocation}
                                >
                                    {creatingAddress ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Save Address"
                                    )}
                                </Button>
                                <Button variant="secondary" onClick={handleClose}>
                                    Cancel
                                </Button>
                            </div>

                            {!selectedLocation && (
                                <small className="text-muted d-block mt-2">
                                    Click on the map to select your delivery location
                                </small>
                            )}
                        </Form>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
}