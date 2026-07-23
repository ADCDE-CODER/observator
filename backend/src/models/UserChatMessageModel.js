export default class UserChatMessageModel {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = ` 
            CREATE TABLE IF NOT EXISTS userchatmessage (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role TEXT CHECK(role IN ('user')) NOT NULL,
                content TEXT NOT NULL,
                images TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                chat_id INTEGER NOT NULL,
                FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE
            );
        `;
        this.db.exec(table);
    }

    create(role, content, images, chatId) {
        this.db.prepare("INSERT INTO userchatmessage(role, content, images, chat_id) VALUES (?, ?, ?, ?)").run(role, content, images, chatId);
    }

    getAll(chatId) {
        return this.db.prepare("SELECT role, content, images created_at FROM userchatmessage WHERE chat_id = ? ORDER BY created_at ASC").all(chatId);
    }

    findById(chatMessageId, chatId) {
        return this.db.prepare("SELECT id, chat_id FROM userchatmessage WHERE id = ? AND chat_id = ?").all(chatMessageId, chatId);
    }

    update(role, content, images, chatMessageId, chatId) {
        return this.db.prepare("UPDATE userchatmessage SET role = ?, content = ?, images = ? WHERE id = ? AND chat_id = ?").run(role, content, images, chatMessageId, chatId);
    }

    delete(chatMessageId, chatId) {
        this.db.prepare("DELETE FROM userchatmessage WHERE id = ? AND chat_id = ?").run(chatMessageId, chatId);
    }
}