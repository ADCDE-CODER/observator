import { createUser, readUsers, readUser, updateUser, deleteUser } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const signUpUserPost = (req, res) => {
    const { email, password } = req.body;
    
    try {
        const users = createUser(email, password);
        res.status(201).json({ success: true });
    } catch (error) {
        console.error("User creation failed: ", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

const signUpUsersGet = (req, res) => {
    try {
        const users = readUsers();
        res.status(200).json({ success: true, users});   
    } catch (error) {
        console.error("Failed to read users:", error.message);
        res.status(500).json({ success: false, error: error.message })
    }
};

const signInUserPost = (req, res) => {
    const { email, password} = req.body;
    
    try {
        const user = readUser(email, password);

        if (user) {
            const token = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).json({ success: true, token});   
        } else {
            res.status(200).json({ success: false, error: "Invalid credentials"});   
        }

    } catch (error) {
        console.error("Failed to get user:", error.message);
        res.status(500).json({ success: false, error: error.message })
    }
};

export { signUpUserPost, signUpUsersGet, signInUserPost };