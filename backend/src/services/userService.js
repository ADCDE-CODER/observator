export class UserService {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const userTable = `
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                first_name TEXT,
                last_name TEXT,
                username TEXT UNIQUE,
                street_address TEXT,
                postal_address TEXT,
                phone_number INTEGER UNIQUE,
                date_of_birth INTEGER
            );
        `;
        this.db.exec(userTable);
    };

    create({ email, password } = {}) {    
        if (!email || !password) {
            throw new Error("Email and password are required to create a user.");
        }
    
        const keys = Object.keys(userData);
    
        // Filter out null and undefined values 
        const validKeys = keys.filter(key => userData[key] !== undefined && userData[key] !== null);
    
        try {
            const columns = validKeys.join(', ');
            const questionMarks = Array(validKeys.length).fill('?').join(', ');
            const values = validKeys.map(key => {
                return userData[key];
            });

            return db.prepare(`INSERT INTO user(${columns}) VALUES (${questionMarks})`).run(...values);
        } catch (error) {
            throw error;
        }
    };
    
    read({ email, username, password } = {}) {
        if ((!email && !username) || !password) {
            throw new Error("Email or username, and password are required to read a user.");
        }

        try {
            const indentifier = email || username;
            return db.prepare("SELECT id, email FROM user WHERE (email = ? OR username = ?) AND password = ?").get(indentifier, indentifier, password);
        } catch (error) {
            throw error;
        }
    };
    
    update({ email, password, id } = {}) {        
        if (!email || !password || !id) {
            throw new Error("Email, password, and ID are required to update a user.");
        }

        try {
            return db.prepare("UPDATE user SET email = ?, password = ?, WHERE id = ?").run(email, password, id);
        } catch (error) {
            throw error;
        }
    };
    
    delete(id) {
        if (!id) {
            throw new Error("ID is required to delete a user.")
        }

        try {
            return db.prepare("DELETE FROM user WHERE id = ?").run(id);
        } catch (error) {
            throw error;
        }
    };
}