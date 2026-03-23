import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function LocationPickerPage() {
    const navigate = useNavigate();
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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddressData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleCreateAddress = async (e) => {
        e.preventDefault();

        if (!addressData.streetAddress?.trim() || !addressData.city?.trim() ||
            !addressData.state?.trim() || !addressData.postalCode?.trim() ||
            !addressData.country?.trim()) {
            toast.error("Please fill in all required fields (Street Address, City, State, Postal Code, Country)");
            return;
        }

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
                // Navigate back to cart with state indicating address was created
                navigate("/cart", {
                    state: {
                        addressCreated: true,
                        newAddress: response.data.data
                    }
                });
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

    const handleBack = () => {
        navigate("/cart");
    };

    return (
        <div className="container-fluid py-4 text-white" style={{ minHeight: "100vh", backgroundColor: "#0b0d17" }}>
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">Pick Delivery Location</h2>
                        <button className="btn btn-outline-light" onClick={handleBack}>
                            Back
                        </button>
                    </div>

                    <div className="card border-secondary shadow-sm text-white" style={{ backgroundColor: "#141722" }}>
                        <div className="card-body">
                            <div className="row g-4">
                                <div className="col-lg-7">
                                    <div className="mb-3">
                                        <button
                                            className="btn btn-warning"
                                            onClick={getCurrentLocation}
                                        >
                                            📍 Use My Current Location
                                        </button>
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
                                            <div className="spinner-border text-warning" />
                                            <p className="mt-2">Fetching address details...</p>
                                        </div>
                                    )}
                                </div>

                                <div className="col-lg-5">
                                    <h5 className="mb-3">Address Details</h5>

                                    {selectedLocation && (
                                        <div className="alert alert-info mb-3">
                                            <small>
                                                <strong>Selected Location:</strong><br />
                                                {selectedLocation.displayName}
                                            </small>
                                        </div>
                                    )}

                                    <form onSubmit={handleCreateAddress}>
                                        <div className="mb-3">
                                            <label className="form-label">Full Name</label>
                                            <input
                                                type="text"
                                                className="form-control bg-dark text-light border-secondary"
                                                name="fullName"
                                                value={addressData.fullName}
                                                onChange={handleInputChange}
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Phone Number</label>
                                            <input
                                                type="tel"
                                                className="form-control bg-dark text-light border-secondary"
                                                name="phoneNumber"
                                                value={addressData.phoneNumber}
                                                onChange={handleInputChange}
                                                placeholder="+947XXXXXXXX"
                                            />
                                            <small className="text-secondary">International format starting with +</small>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Street Address *</label>
                                            <input
                                                type="text"
                                                className="form-control bg-dark text-light border-secondary"
                                                name="streetAddress"
                                                value={addressData.streetAddress}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        <div className="row g-3 mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label">Building / Apartment</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-light border-secondary"
                                                    name="buildingName"
                                                    value={addressData.buildingName}
                                                    onChange={handleInputChange}
                                                    placeholder="Apartment, Suite"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Landmark</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-light border-secondary"
                                                    name="landmark"
                                                    value={addressData.landmark}
                                                    onChange={handleInputChange}
                                                    placeholder="Near school, temple"
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-3 mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label">City *</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-light border-secondary"
                                                    name="city"
                                                    value={addressData.city}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">State *</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-light border-secondary"
                                                    name="state"
                                                    value={addressData.state}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-3 mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label">Postal Code *</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-light border-secondary"
                                                    name="postalCode"
                                                    value={addressData.postalCode}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label">Country *</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark text-light border-secondary"
                                                    name="country"
                                                    value={addressData.country}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Delivery Notes</label>
                                            <textarea
                                                className="form-control bg-dark text-light border-secondary"
                                                rows="2"
                                                name="notes"
                                                value={addressData.notes}
                                                onChange={handleInputChange}
                                                placeholder="Additional delivery instructions..."
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="isDefault"
                                                    checked={addressData.isDefault}
                                                    onChange={handleInputChange}
                                                    id="isDefault"
                                                />
                                                <label className="form-check-label" htmlFor="isDefault">
                                                    Set as default address
                                                </label>
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2">
                                            <button
                                                type="submit"
                                                className="btn btn-warning flex-grow-1"
                                                disabled={creatingAddress || !selectedLocation}
                                            >
                                                {creatingAddress ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" />
                                                        Creating...
                                                    </>
                                                ) : (
                                                    "Save Address & Continue"
                                                )}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={handleBack}
                                            >
                                                Cancel
                                            </button>
                                        </div>

                                        {!selectedLocation && (
                                            <small className="text-muted d-block mt-3 text-center">
                                                Click on the map to select your delivery location
                                            </small>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}