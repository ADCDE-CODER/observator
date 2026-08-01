import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateToken = (payload) => {    
    if (!payload) {
        const error = new Error("Payload is required to generate a token.");
        error.status = 400;
        throw error;
    }

    return jwt.sign(payload, env.accessToken);
};

export const verifyJwt = (token) => {
    if (!token) {
        const error = new Error("Access denied: No token");
        error.status = 403;
        throw error;
    }
    
    return jwt.verify(token, env.accessToken);
};