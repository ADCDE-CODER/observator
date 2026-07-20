import { generateToken } from "../middleware/auth.js";

export default class UserController {
    constructor(UserServiceInstance) {
        this.UserService = UserServiceInstance;
    }

    create(req, res) {
        const userData = req.body;

        try {
            this.UserService.create(userData);
            res.status(201).json({message: "User created successfully"});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };
    
    read(req, res) {
        const { email, username, password } = req.body;
        
        try {
            const user = this.UserService.read({email, username, password});
            user.token = generateToken(user);
            res.status(200).json({message: "User read successfully", user}); 
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    get(req, res) {
        const { id } = req.body;

        try {
            const user = this.UserService.get(id);
            res.status(200).json({message: "Successfully retrieved user", user});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    update(req, res) {
        const userData = req.body;
        
        try {
            const user = this.UserService.update(userData);
            res.status(200).json({message: "User updated successfully", user});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };

    delete(req, res) {
        const { id } = req.body;
        
        try {
            this.UserService.delete(id);
            res.status(200).json({message: "User deleted successfully"});
        } catch (error) {
            console.error(error);
            res.status(error.status || 500).json({message: error.message})
        }
    };
}