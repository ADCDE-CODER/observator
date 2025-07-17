import { db } from "../config/database.js";

const messagesTable = ` 
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chat_id INTEGER NOT NULL,
        sender TEXT CHECK(sender IN ('user', 'ai')) NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (chat_id) REFERENCES chats(id)
    );
`;

db.exec(messagesTable);

// CREATE
function createChatMessage(chatId, sender, message) {
    return db.prepare("INSERT INTO messages(chat_id, sender, message) VALUES (?, ?, ?)").run(chatId, sender, message);
};

// READ
function readAllChatMessages() {
    return db.prepare("SELECT * FROM messages ORDER BY created_at ASC").all();
};

function readChatMessage(chatId) {
    return db.prepare("SELECT sender, message, created_at FROM messages WHERE chat_id = ? ORDER BY created_at ASC").all(chatId);
};

// UPDATE
function updateChatMessage(sender, message, chatId) {
    return db.prepare("UPDATE messages SET sender = ?, message = ?, WHERE chat_id = ?").run(sender, message, chatId);
};

// DELETE
function deleteChatMessage(id) {
    return db.prepare("DELETE FROM messages WHERE id = ?").run(id);
};

export { createChatMessage, readAllChatMessages,readChatMessage, updateChatMessage, deleteChatMessage };