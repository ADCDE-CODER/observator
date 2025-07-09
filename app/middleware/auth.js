import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

function authenticateToken(req, res, next) {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(" ")[1];

    if (token) {
        try {
            const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = user;
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