import { db } from "../config/database.js";

const userTable = `
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        first_name TEXT,
        last_name TEXT,
        username TEXT,
        street_address TEXT,
        postal_address TEXT,
        phone_number INTEGER,
        date_of_birth INTEGER
    );
`;

db.exec(userTable);

// CREATE
function createUser(userData) {
    const { email, password } = userData;

    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    const keys = Object.keys(userData);

    // Filter out null and undefined values 
    const validKeys = keys.filter(key => userData[key] !== undefined && userData[key] !== null);

    const columns = validKeys.join(', ');
    const questionMarks = Array(validKeys.length).fill('?').join(', ');
	const values = validKeys.map(key => {
        return userData[key];
    });

    try {
        return db.prepare(`INSERT INTO user(${columns}) VALUES (${questionMarks})`).run(...values);
    } catch (error) {
        console.error("Database INSERT error:", error);
    }
};

// READ
function readAllUsers() {
    return db.prepare("SELECT * FROM user").all();
};

function readUser(email, password) {
    return db.prepare("SELECT id, email FROM user WHERE email = ? AND password = ?").get(email, password);
};

// UPDATE
function updateUser(email, password, id) {
    return db.prepare("UPDATE user SET email = ?, password = ?, WHERE id = ?").run(email, password, id);
};

// DELETE
function deleteUser(id) {
    return db.prepare("DELETE FROM user WHERE id = ?").run(id);
};

export { createUser, readAllUsers, readUser, updateUser, deleteUser };