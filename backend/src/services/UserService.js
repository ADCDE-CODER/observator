import bcrypt from "bcrypt"; 

export default class UserService {
    constructor(userModel) {
        this.userModel = userModel;
        this.keys = ['email', 'password', 'username', 'first_name', 'last_name', 'street_address', 'postal_address', 'phone_number', 'date_of_birth'];
        this.initializeDatabase();
    }

    create(userData) {
        const { email, password, username } = userData;
        
        if (!email || !password || !username) {
            const error = new Error("Email, password, and username are required to create a user.");
            error.status = 400;
            throw error;
        }

        const saltRounds = 12;
        userData.password = await bcrypt.hash(password, saltRounds);
        
        let validKeys = [];
        let validValues = [];
    
        // Ensure casing matches DB schema strictly (snake_case)
        this.keys.forEach(key => {
            const value = userData[key];
            if (!value) return;

            validKeys.push(key);
            validValues.push(value);
        });

        const columns = validKeys.join(', ');
        const questionMarks = Array(validKeys.length).fill('?').join(', ');

        try {
            this.userModel.create(columns, questionMarks, validValues)
        } catch (error) {
            if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
                const err = new Error("Email or username already exists.");
                err.status = 400;
                throw err;
            }
            
            throw error;
        }
    };
    
    authenticate(userData) {
        const { email, username, password } = userData;

        if ((!email && !username) || !password) {
            const error = new Error("Email or username, and password are required to read a user.");
            error.status = 400;
            throw error;
        }

        try {
            const indentifier = email || username;
            const user = this.userModel.findByIdentifier(indentifier);
            const vaildPassword = await bcrypt.compare(password, user.password);

            if (!user || !vaildPassword) {
                const error = new Error("Invalid email or password.")
                error.status = 400;
                throw error;
            }

            return user;
        } catch (error) {
            throw error;
        }
    };

    getProfile(userId) {
        if (!userId) {
            throw new Error("User ID is required to get a user.")
        }

        try {
            const user = this.userModel.findById(userId);

            if (!user) {
                throw new Error("User not found.");
            }

            return user;
        } catch (error) {
            throw error;
        }
    };
    
    updateProfile(userData, userId) {
        const { email, password, username } = userData;

        if ((!email && !username) || !password) {
            const error = new Error("Email or username, and password are required to update a user.");
            error.status = 400;
            throw error;
        }
        
        if (!userId) {
            throw new Error("User ID is required to update a user information.");
        }

        let columns = "";
        let validValues = [];
        
        // Ensure casing matches DB schema strictly (snake_case)
        this.keys.forEach(key => {
            const value = userData[key];
            if (!value) return;

            columns += `${key} = ?, `;
            validValues.push(value);
        });

        try {
            const user = this.userModel.update(columns, validValues, userId);

            if (!user) {
                throw new Error("Update failed.");
            }

            return user;
        } catch (error) {
            throw error;
        }
    };
    
    delete(userId) {
        if (!userId) {
            throw new Error("User ID is required to delete a user.")
        }

        try {
            this.userModel.delete(userId);
        } catch (error) {
            throw error;
        }
    };
}