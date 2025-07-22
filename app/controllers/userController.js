import { createUser, readAllUsers, readUser, updateUser, deleteUser } from "../models/userModel.js";
import { generateToken } from "../middleware/auth.js";

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
        const users = readAllUsers();
        res.status(200).json({ success: true, users});   
    } catch (error) {
        console.error("Failed to read users:", error.message);
        res.status(500).json({ success: false, error: error.message })
    }
};

const signInUserPost = (req, res) => {
    try {
        const { email, password} = req.body;
        const user = readUser(email, password);

        if (user) {
            const token = generateToken(email);
            res.status(200).json({ success: true, user, token});   
        } else {
            res.status(401).json({ success: false, error: "Invalid credentials"});   
        }

    } catch (error) {
        console.error("Failed to sign in:", error.message);
        res.status(500).json({ success: false, error: error.message })
    }
};

export { signUpUserPost, signUpUsersGet, signInUserPost };