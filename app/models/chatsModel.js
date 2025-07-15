import { db } from "../config/database.js";

const chatsTable = `
    CREATE TABLE IF NOT EXISTS chats (
        id INTERGER PRIMARY KEY AUTOINCREMENT,
        user_id INTERGER NOT NULL,
        title TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
`;

db.exec(chatsTable);

// CREATE 
function createChat(userId, title) {
    db.prepare("INSERT INTO chats(user_id, title) VALUES (?, ?)").run(userId, title);
};

// READ
function readAllChats() {
    db.prepare("SELECT * FROM chats ORDER BY created_at ASC").all();
};

function readChat(userId) {
    db.prepare("SELECT * FROM chats WHERE = ? ORDER BY created_at ASC").all(userId);
};

// UPDATE
function updateChat(title, userId) {
    db.prepare("UPDATE chats SET title = ?, WHERE user_id = ?").run(title, userId);
};

// DELETE
function deleteChat(id) {
    db.prepare("DELETE FROM chats WHERE id = ?").run(id);
};

export { createChat, readAllChats, readChat, updateChat, deleteChat };