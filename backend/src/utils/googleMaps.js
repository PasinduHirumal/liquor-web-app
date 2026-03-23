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