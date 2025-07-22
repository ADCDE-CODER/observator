import { createUser, readAllUsers, readUser, updateUser, deleteUser } from "../models/userModel.js";
import { generateToken } from "../middleware/auth.js";

const signUpUserPost = (req, res) => {
    const {email, password} = req.body;

    if (email && password) {      
        try {
            const usersCreated = createUser(email, password);
            res.status(201).json({success: true, message: "Your account is created!"});
        } catch (error) {
            const errorMessage = `User creation failed: ${error.message}`;
            console.error(errorMessage);
            res.status(500).json({success: false, error: errorMessage});
        }
    } else {
        res.status(400).json({success: false, error: "Email and password are required"});
    }
};

const signUpUsersGet = (req, res) => {
    try {
        const users = readAllUsers();

        if (users) {
            res.status(200).json({success: true, users: users, message: "Successful to get all users"});   
        } else {
            res.status(400).json({success: false, error: "Failed to read all users"});
        }

    } catch (error) {
        const errorMessage = `Failed to read users: ${error.message}`;
        console.error(errorMessage);
        res.status(500).json({success: false, error: errorMessage});
    }
};

const signInUserPost = (req, res) => {
    const {email, password} = req.body;
    
    if (email && password) {
        try {
            const user = readUser(email, password);

            if (user) {
                try {
                    const token = generateToken(email);
                    
                    if (token) {
                        res.status(200).json({success: true, user: user, token: token, message: "Signed in successfully"});   
                    } else {
                        res.status(400).json({success: false, error: "Failed to generate token"});
                    }   
                } catch (error) {
                    const errorMessage = `Token generation failed: ${error.message}`;
                    console.error(errorMessage);
                    res.status(500).json({success: false, error: errorMessage});
                }
            } else {
                res.status(401).json({success: false, error: "Invalid credentials"});   
            }
        } catch (error) {
            const errorMessage = `Failed to sign in: ${error.message}`;
            console.error(errorMessage);
            res.status(500).json({success: false, error: errorMessage});
        }
    } else {
        res.status(400).json({success: false, error: "Email and password are required"});
    }
};

export { signUpUserPost, signUpUsersGet, signInUserPost };