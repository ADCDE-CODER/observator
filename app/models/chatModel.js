import { db } from "../config/database.js";

const chatTable = ` 
    CREATE TABLE IF NOT EXISTS chat (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        sender TEXT NOT NULL, -- 'AI' or 'User'
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );
`;

db.exec(chatTable);

// CREATE
function createChatMessage(userId, sender, message) {
    return db.prepare("INSERT INTO chat(user_id, sender, message) VALUES (?, ?, ?)".run(userId, sender, message));
};

// READ
function readChatMessage(userId) {
    return db.prepare("SELECT sender, message, timestamp FROM chat WHERE user_id = ? ORDER BY timestamp ASC").all(userId);
};

// UPDATE
function updateChatMessage(sender, message, userId) {
    db.prepare("UPDATE chat SET sender = ?, message = ?, WHERE = ?").run(sender, message, userId);
};

// DELETE
function deleteChatMessage(id) {
    db.prepare("DELETE FROM chat WHERE id = ?").run(id);
};

export { createChatMessage, readChatMessage, updateChatMessage, deleteChatMessage };