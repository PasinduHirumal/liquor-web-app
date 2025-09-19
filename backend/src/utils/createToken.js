import jwt from 'jsonwebtoken';

const generateToken = (payload, res) => {
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    const isDevelopment = process.env.NODE_ENV === 'development';

    res.cookie("jwt", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // MS
        // prevent XSS attacks cross-site scripting attacks
        httpOnly: true,  
        // CSRF attacks cross-site request forgery attacks
        // Allow cross-origin in production
        sameSite: isDevelopment ? "strict" : "none", 
        secure: !isDevelopment,
    });

    return token;
};

export default generateToken;