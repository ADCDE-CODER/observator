export default class ChatMessageModel {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = ` 
            CREATE TABLE IF NOT EXISTS chatmessage (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role TEXT CHECK(role IN ('user', 'assistant')) NOT NULL,
                created_at TEXT,
                chat_id INTEGER NOT NULL,
                FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE
            );
        `;
        this.db.exec(table);
    }

    create(role, createdAt, chatId) {
        return this.db.prepare("INSERT INTO chatmessage(role, created_at, chat_id) VALUES (?, ?, ?)").run(role, createdAt, chatId);
    }

    getAll(orderBy, chatId) {
        return this.db.prepare("SELECT * FROM chatmessage WHERE chat_id = ? ORDER BY created_at = ?").all(chatId, orderBy);
    }

    findById(id, chatId) {
        const rows = this.db.prepare("SELECT * FROM chatmessage WHERE id = ? AND chat_id = ?").all(id, chatId);
        return rows[0];
    }

    update(role, createdAt, id, chatId) {
        return this.db.prepare("UPDATE chatmessage SET role = ?, created_at = ? WHERE id = ? AND chat_id = ?").run(role, createdAt, id, chatId);
    }

    delete(id, chatId) {
        this.db.prepare("DELETE FROM chatmessage WHERE id = ? AND chat_id = ?").run(id, chatId);
    }
}