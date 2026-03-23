const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function getDistanceMatrix(origins, destination) {
    const originsStr = origins
        .map(o => `${o.lat},${o.lng}`)
        .join('|');

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json` +
        `?origins=${encodeURIComponent(originsStr)}` +
        `&destinations=${encodeURIComponent(destination)}` +
        `&mode=driving` +
        `&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
        throw new Error(`Google Maps API error: ${data.status}`);
    }

    return data;
}


// Get total route distance and duration using waypoints
// Route: Warehouse → Supermarket(s) → Customer Address → Warehouse
export async function getRouteDistance(warehouse, supermarketLocations, address) {
    const warehouseCoord  = `${warehouse.location.lat},${warehouse.location.lng}`;
    const customerCoord   = `${address.latitude},${address.longitude}`;

    // Waypoints: all supermarkets between warehouse and customer
    const waypoints = supermarketLocations
        .map(sm => `${sm.location.lat},${sm.location.lng}`)
        .join('|');

    // Final leg: customer → back to warehouse
    const url = `https://maps.googleapis.com/maps/api/directions/json` +
        `?origin=${encodeURIComponent(warehouseCoord)}` +
        `&destination=${encodeURIComponent(warehouseCoord)}` +       // returns to warehouse
        `&waypoints=${encodeURIComponent(waypoints + '|' + customerCoord)}` +
        `&mode=driving` +
        `&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
        throw new Error(`Google Maps Directions API error: ${data.status}`);
    }

    // Sum all legs for total distance and duration
    const legs = data.routes[0].legs;

    const totalDistanceMeters = legs.reduce((sum, leg) => sum + leg.distance.value, 0);
    const totalDurationSeconds = legs.reduce((sum, leg) => sum + leg.duration.value, 0);

    return {
        totalDistanceMeters,
        totalDistanceKm: parseFloat((totalDistanceMeters / 1000).toFixed(2)),
        totalDurationSeconds,
        totalDurationText: formatDuration(totalDurationSeconds),
        legs: legs.map(leg => ({
            from: leg.start_address,
            to: leg.end_address,
            distanceText: leg.distance.text,
            durationText: leg.duration.text,
        })),
    };
}

// Helper: format seconds → "1 hour 20 mins"
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const mins  = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ${mins} min${mins !== 1 ? 's' : ''}`;
    return `${mins} min${mins !== 1 ? 's' : ''}`;
}
