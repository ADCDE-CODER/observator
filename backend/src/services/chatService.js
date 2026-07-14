import { db } from "../config/database.js";

const chatTable = `
    CREATE TABLE IF NOT EXISTS chat (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user(id)
    );
`;

db.exec(chatTable);

// CREATE 
function createChat(userId, title) {
    return db.prepare("INSERT INTO chat(user_id, title) VALUES (?, ?)").run(userId, title);
};

// READ
function readAllChats() {
    return db.prepare("SELECT * FROM chat ORDER BY created_at ASC").all();
};

function readChat(userId) {
    return db.prepare("SELECT * FROM chat WHERE user_id = ? ORDER BY created_at ASC").all(userId);
};

// UPDATE
function updateChat(title, userId, id) {
    return db.prepare("UPDATE chat SET title = ? WHERE user_id = ? AND id = ?").run(title, userId, id);
};

// DELETE
function deleteChat(userId, id) {
    return db.prepare("DELETE FROM chat WHERE user_id = ? AND id = ?").run(userId, id);
};

export { createChat, readAllChats, readChat, updateChat, deleteChat };