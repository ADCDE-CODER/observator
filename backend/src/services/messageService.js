import { db } from "../config/database.js";

const messageTable = ` 
    CREATE TABLE IF NOT EXISTS message (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        images TEXT NOT NULL,
        role TEXT CHECK(role IN ('user', 'assistant', 'system')) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        chat_id INTEGER NOT NULL,
        FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE
    );
`;

db.exec(messageTable);

// CREATE
function createChatMessage(chatId, sender, message) {
    return db.prepare("INSERT INTO message(chat_id, sender, message) VALUES (?, ?, ?)").run(chatId, sender, message);
};

// READ
function readAllChatMessages() {
    return db.prepare("SELECT * FROM message ORDER BY created_at ASC").all();
};

function readChatMessage(chatId) {
    return db.prepare("SELECT sender, message, created_at FROM message WHERE chat_id = ? ORDER BY created_at ASC").all(chatId);
};

// UPDATE
function updateChatMessage(sender, message, chatId) {
    return db.prepare("UPDATE message SET sender = ?, message = ?, WHERE chat_id = ?").run(sender, message, chatId);
};

// DELETE
function deleteChatMessage(id) {
    return db.prepare("DELETE FROM message WHERE id = ?").run(id);
};

export { createChatMessage, readAllChatMessages,readChatMessage, updateChatMessage, deleteChatMessage };