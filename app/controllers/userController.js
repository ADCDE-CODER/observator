import { createUser, readUsers, readUser, updateUser, deleteUser } from "../models/userModel.js";

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

const readUsersGet = (req, res) => {
    try {
        const users = readUsers();
        res.status(200).json({ success: true, users});   
    } catch (error) {
        console.error("Failed to read users:", error.message);
        res.status(500).json({ success: false, error: error.message })
    }
};

const readUserPost = (req, res) => {
    const { email, password} = req.body.user;
    
    try {
        const user = readUser(email, password);

        if (user) {
            res.status(200).json({ success: true});   
        } else {
            res.status(200).json({ success: false});   
        }

    } catch (error) {
        console.error("Failed to get user:", error.message);
        res.status(500).json({ success: false, error: error.message })
    }
};

export { createUserPost, readUsersGet, readUserPost }