import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

const generateToken = (email) => {
    return jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET);
};


function authenticateToken(req, res, next) {
    try {
        const authHeaders = req.headers['authorization'];
        const token = authHeaders && authHeaders.split(" ")[1];

        if (token) {
            const decodedUserFromToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decodedUserFromToken;
            next();
        } else {
            return res.status(401).json({ error: "Access denied: No token" })
        }

    } catch (error) {
        console.error(error);
        res.status(403).json({ error: "Invalid or expired token" });
    }
};

export { generateToken, authenticateToken };