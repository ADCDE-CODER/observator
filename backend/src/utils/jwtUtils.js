import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const generateToken = (payload) => {    
    if (!payload) {
        throw new Error("Payload object is required to generate a token.");
    }

    try {
        return jwt.sign(payload, env.accessToken);
    } catch (error) {
        console.error("JWT Signing Error:", error);
    }
};

export const verifyJwt = (token) => {
    if (!token) {
        throw new Error("Access denied: No token provided.");
    }

    try {
        return jwt.verify(token, env.accessToken);
    } catch (error) {
        console.error("JWT Verification Failed:", error);
    }
};