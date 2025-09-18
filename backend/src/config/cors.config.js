
// Configure CORS for both web and mobile
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        // Define allowed origins
        const allowedOrigins = [
            process.env.DEVELOPMENT_WEB_URL,
            //"http://localhost:3000",
            //"http://localhost:4000", // If you have multiple frontend ports
            process.env.PRODUCTION_WEB_URL, // Production web URL
            // Add more web origins as needed
        ].filter(Boolean);

        // Check if the origin is in the allowed list
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // For mobile apps, you might want to allow all origins or specific patterns
        // Mobile apps typically don't send an origin header
        callback(null, true);
    },
    credentials: true, // Enable credentials (cookies, authorization headers)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'x-auth-token', // If you use custom auth headers
    ],
    exposedHeaders: ['set-cookie'], // Expose cookies to client
    maxAge: 86400, // Cache preflight response for 24 hours
};

export default corsOptions;