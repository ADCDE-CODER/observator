import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

export const generateToken = (userData) => {
    const { id, email } = userData; 
    
    if (!id || !email) {
        const error = new Error("ID and Email are required to generate a token.");
        error.status = 400;
        throw error;
    }

    return jwt.sign({id, email}, process.env.ACCESS_TOKEN_SECRET);
};

export function verifyToken(req, res, next) {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({message: "Access denied: No token"});
    }

    try {
        const decodedUserFromToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decodedUserFromToken;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({message: "Invalid or expired token"});
    }  
};