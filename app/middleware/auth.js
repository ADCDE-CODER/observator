import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

const generateToken = (email) => {
    return jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET);
};


function authenticateToken(req, res, next) {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(" ")[1];

    if (token) {
        try {
            const decodedUserFromToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decodedUserFromToken;
            next();
        } catch (error) {
            console.error(error);
            res.status(403).json({ error: "Invalid or expired token" });
        }
    } else {
        return res.status(401).json({ error: "Access denied: No token" })
    }
};

export { authenticateToken };