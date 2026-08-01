import bcrypt from "bcrypt";

export const generateHash = async (password, saltRounds) => {
    if (!password) {
        throw new Error("Password is required.");
    }

    if (!saltRounds || saltRounds < 1) {
        throw new Error("Invalid or missing salt rounds parameter. Must be a positive integer.");
    }

    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        console.error("Bcrypt hashing failed:", error);
    }
};

export const verifyPassword = async (plaintextPassword, hashPassword) => {
    if (!plaintextPassword) {
        throw new Error("Plaintext password is required.");
    }

    if (!hashPassword) {
        throw new Error("Stored hash password must be provided for verification.");
    }

    try {
        return await bcrypt.compare(plaintextPassword, hashPassword);
    } catch (error) {
        console.error("Bcrypt comparison failed:", error);
    }
};