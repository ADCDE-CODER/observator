export default class UserService {
    constructor(db) {
        this.db = db;
        this.keys = ['email', 'password', 'username', 'first_name', 'last_name', 'street_address', 'postal_address', 'phone_number', 'date_of_birth'];
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = `
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                username TEXT NOT NULL UNIQUE,
                first_name TEXT,
                last_name TEXT,
                street_address TEXT,
                postal_address TEXT,
                phone_number INTEGER UNIQUE,
                date_of_birth INTEGER
            );
        `;
        this.db.exec(table);
    };

    create(userData) {
        const { email, password, username } = userData;
        
        if (!email || !password || !username) {
            const error = new Error("Email, password, and username are required to create a user.");
            error.status = 400;
            throw error;
        }
        
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
            this.db.prepare(`INSERT INTO user(${columns}) VALUES (${questionMarks})`).run(...validValues);
        } catch (error) {
            if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
                const err = new Error("Email or username already exists.");
                err.status = 400;
                throw err;
            }
            
            throw error;
        }
    };
    
    read(userData) {
        const { email, username, password } = userData;

        if ((!email && !username) || !password) {
            const error = new Error("Email or username, and password are required to read a user.");
            error.status = 400;
            throw error;
        }

        try {
            const indentifier = email || username;
            const user = this.db.prepare("SELECT id, email, username FROM user WHERE (email = ? OR username = ?) AND password = ?").get(indentifier, indentifier, password);
            
            if (!user) {
                throw new Error("Login failed.")
            }

            return user;
        } catch (error) {
            throw error;
        }
    };

    get(userId) {
        if (!userId) {
            throw new Error("User ID is required to get a user.")
        }

        try {
            const user = this.db.prepare("SELECT * FROM user WHERE id = ?").get(userId);

            if (!user) {
                throw new Error("User not found.");
            }

            return user;
        } catch (error) {
            throw error;
        }
    };
    
    update(userData, userId) {
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
            const user = this.db.prepare(`UPDATE user SET ${columns.splice(0, -1)} WHERE id = ?`).run(...validValues, userId);

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
            this.db.prepare("DELETE FROM user WHERE id = ?").run(userId);
        } catch (error) {
            throw error;
        }
    };
}