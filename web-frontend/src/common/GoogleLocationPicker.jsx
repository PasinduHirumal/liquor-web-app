import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";
import L from "leaflet";
import toast from "react-hot-toast";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const center = [7.2083, 79.8358]; // Negombo

export default function LocationPicker({ onSelect }) {
    const [marker, setMarker] = useState(null);
    const [loading, setLoading] = useState(false);

    const getAddress = async (lat, lng) => {
        setLoading(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await res.json();

            if (data.display_name) {
                onSelect({
                    lat,
                    lng,
                    address: data.display_name,
                });
                toast.success("Location selected!");
            } else {
                toast.error("Address not found");
            }
        } catch {
            toast.error("Failed to fetch address");
        }
        setLoading(false);
    };

    function MapClickHandler() {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setMarker([lat, lng]);
                getAddress(lat, lng);
            },
        });
        return null;
    }

    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                setMarker([lat, lng]);
                getAddress(lat, lng);
            },
            () => toast.error("Location permission denied")
        );
    };

    return (
        <div>
            <button onClick={getCurrentLocation} className="btn btn-warning mb-2">
                Use My Location
            </button>

            <MapContainer
                center={marker || center}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
            >
                <TileLayer
                    attribution='© OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClickHandler />

                {marker && (
                    <Marker
                        position={marker}
                        draggable
                        eventHandlers={{
                            dragend: (e) => {
                                const lat = e.target.getLatLng().lat;
                                const lng = e.target.getLatLng().lng;
                                setMarker([lat, lng]);
                                getAddress(lat, lng);
                            },
                        }}
                    />
                )}
            </MapContainer>

            {loading && <p>Fetching address...</p>}
        </div>
    );
}
