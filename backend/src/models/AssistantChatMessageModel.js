export default class AssistantChatMessageModel {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = ` 
            CREATE TABLE IF NOT EXISTS assistantchatmessage (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role TEXT CHECK(role IN ('assistant')) NOT NULL,
                model TEXT,
                thinking TEXT,
                content TEXT NOT NULL,
                images TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                chat_id INTEGER NOT NULL,
                FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE
            );
        `;
        this.db.exec(table);
    }

    create(role, model, thinking, content, images, chatId) {
        this.db.prepare("INSERT INTO assistantchatmessage(role, model, thinking, content, images, chat_id) VALUES (?, ?, ?, ?, ?, ?)").run(role, model, thinking, content, images, chatId);
    }

    getAll(chatId) {
        return this.db.prepare("SELECT role, model, thinking, content, images created_at FROM assistantchatmessage WHERE chat_id = ? ORDER BY created_at ASC").all(chatId);
    }

    findById(chatMessageId, chatId) {
        const rows = this.db.prepare("SELECT id, chat_id FROM assistantchatmessage WHERE id = ? AND chat_id = ?").all(chatMessageId, chatId);
        return rows[0];
    }

    update(role, content, images, chatMessageId, chatId) {
        return this.db.prepare("UPDATE assistantchatmessage SET role = ?, content = ?, images = ? WHERE id = ? AND chat_id = ?").run(role, content, images, chatMessageId, chatId);
    }

    delete(chatMessageId, chatId) {
        this.db.prepare("DELETE FROM assistantchatmessage WHERE id = ? AND chat_id = ?").run(chatMessageId, chatId);
    }
}