import { db } from "../config/database.js";

const chatsTable = `
    CREATE TABLE IF NOT EXISTS chats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTERGER NOT NULL,
        title TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
`;

db.exec(chatsTable);

// CREATE 
function createChat(userId, title) {
    return db.prepare("INSERT INTO chats(user_id, title) VALUES (?, ?)").run(userId, title);
};

// READ
function readAllChats() {
    return db.prepare("SELECT * FROM chats ORDER BY created_at ASC").all();
};

function readChat(userId) {
    return db.prepare("SELECT * FROM chats WHERE user_id = ? ORDER BY created_at ASC").all(userId);
};

// UPDATE
function updateChat(title, userId, id) {
    return db.prepare("UPDATE chats SET title = ? WHERE user_id = ? AND id = ?").run(title, userId, id);
};

// DELETE
function deleteChat(id) {
    return db.prepare("DELETE FROM chats WHERE id = ?").run(id);
};

export { createChat, readAllChats, readChat, updateChat, deleteChat };