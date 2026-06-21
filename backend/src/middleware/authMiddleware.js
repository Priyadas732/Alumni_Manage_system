import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_change_me_later";

export const verifyToken = (req, res, next) => {
    // Get token from the header (usually in format: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({
            success: false,
            message: "No token provided, authorization denied"
        });
    }
    try{
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach user info(id and role) to the request object
        req.user = decoded;

        next(); // Pass comtrol to the next controller function
    } catch(error){
        return res.status(401).json({
            success: false,
            message:"Token is not valid or has expired"
        });
    }
};