import { verifyJwt } from "../utils/jwtUtils.js";

export function authenticate(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];

    try {
        req.user = verifyJwt(token);
        next();
    } catch (error) {
        next(error);
    }  
};