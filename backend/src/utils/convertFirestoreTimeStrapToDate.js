// Helper function to convert Firestore timestamp to Date
const getDateFromTimestamp = (timestamp) => {
    if (typeof timestamp === 'string') {
        // Already an ISO string
        return new Date(timestamp);
    } else if (timestamp && typeof timestamp === 'object' && timestamp._seconds) {
        // Firestore timestamp object
        return new Date(timestamp._seconds * 1000 + (timestamp._nanoseconds || 0) / 1000000);
    } else {
        // Fallback
        return new Date(timestamp);
    }
};

export default getDateFromTimestamp;