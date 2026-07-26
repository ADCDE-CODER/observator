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
                created_at TEXT,
                chat_id INTEGER NOT NULL,
                FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE
            );
        `;
        this.db.exec(table);
    }

    create(role, content, images, createdAt, chatId) {
        this.db.prepare("INSERT INTO userchatmessage(role, content, images, created_at, chat_id) VALUES (?, ?, ?, ?, ?)").run(role, content, images, createdAt, chatId);
    }

    getAll(chatId) {
        return this.db.prepare("SELECT * FROM userchatmessage WHERE chat_id = ? ORDER BY created_at ASC").all(chatId);
    }

    findById(chatMessageId, chatId) {
        const rows = this.db.prepare("SELECT id, chat_id FROM userchatmessage WHERE id = ? AND chat_id = ?").all(chatMessageId, chatId);
        return rows[0];
    }

    update(role, content, images, chatMessageId, chatId) {
        return this.db.prepare("UPDATE userchatmessage SET role = ?, content = ?, images = ? WHERE id = ? AND chat_id = ?").run(role, content, images, chatMessageId, chatId);
    }

    delete(chatMessageId, chatId) {
        this.db.prepare("DELETE FROM userchatmessage WHERE id = ? AND chat_id = ?").run(chatMessageId, chatId);
    }
}