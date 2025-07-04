import { createUser, readUser, updateUser, deleteUser } from "../models/userModel.js";

const createUserPost = (req, res) => {
    const { email, password } = req.body.user;
    
    try {
        const users = createUser(email, password);
        res.status(201).json({ success: true });
    } catch (error) {
        console.log("User creation failed: ", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

const readUserGet = (req, res) => {
    try {
        const users = readUser();
        res.status(200).json({ success: true, users});   
    } catch (error) {
        console.error("Failed to read users:", error.message);
        res.status(500).json({ success: false, error: error.message })
    }
};

export { createUserPost, readUserGet }