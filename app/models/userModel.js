import { db } from "../config/database.js";

const usersTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );
`;

db.exec(usersTable);

// CREATE
function createUser(email, password) {
    return db.prepare("INSERT INTO users(email, password) VALUES (?, ?)").run(email, password);
}

// READ
function readUsers() {
    return db.prepare("SELECT * FROM users").all();
}

function readUser(email, password) {
    return db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
}

// UPDATE
function updateUser(email, password, id) {
    return db.prepare("UPDATE users SET email = ?, password = ?, WHERE id = ?").run(email, password, id);
}

// DELETE
function deleteUser(id) {
    return db.prepare("DELETE FROM users WHERE id = ?").run(id);
}

export { createUser, readUsers, readUser, updateUser, deleteUser };