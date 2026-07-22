import { generateToken } from "../middleware/auth.js";

export default class UserController {
    constructor(UserServiceInstance) {
        this.UserService = UserServiceInstance;
    }

    async signup(req, res) {
        const userData = req.body;

        try {
            await this.UserService.create(userData);
            res.status(201).json({message: "User created successfully"});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };
    
    async signin(req, res) {
        const userData = req.body;
        
        try {
            const user = await this.UserService.authenticate(userData);
            user.token = generateToken(user);
            res.status(200).json({message: "User read successfully", user}); 
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    getProfile(req, res) {
        const userId = req.user.id;

        try {
            const user = this.UserService.getProfile(userId);
            res.status(200).json({message: "Successfully retrieved user", user});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    updateProfile(req, res) {
        const userData = req.body;
        const userId = req.user.id;
        
        try {
            const user = this.UserService.updateProfile(userData, userId);
            res.status(200).json({message: "User updated successfully", user});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    deleteAccount(req, res) {
        const userId = req.user.id;
        
        try {
            this.UserService.delete(userId);
            res.status(200).json({message: "User deleted successfully"});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };
}