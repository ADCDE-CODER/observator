import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

const generateToken = (email) => {
    return jwt.sign({email: email}, process.env.ACCESS_TOKEN_SECRET);
};

function verifyToken(req, res, next) {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(" ")[1];
    
    if (token) {
        try {
            const decodedUserFromToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decodedUserFromToken;
            next();
        } catch (error) {
            const errorMessage = `Invalid or expired token: ${error.message}`;
            console.error(errorMessage);
            res.status(403).json({success: false, error: errorMessage});
        }  
    } else {
        return res.status(401).json({success: false, error: "Access denied: No token"});
    }
};

export { generateToken, verifyToken };