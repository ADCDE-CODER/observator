export default class ChatModel {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = `
            CREATE TABLE IF NOT EXISTS chat (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                user_id INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES user(id)
            );
        `;
        this.db.exec(table);
    }

    create(title, userId) {
        return this.db.prepare("INSERT INTO chat(title, user_id) VALUES (?, ?)").run(title, userId);
    }

    getAll(userId) {
        return this.db.prepare("SELECT * FROM chat WHERE user_id = ? ORDER BY created_at ASC").all(userId);
    }

    findById(chatId, userId) {
        const rows = this.db.prepare("SELECT id, user_id FROM chat WHERE id = ? AND user_id = ?").all(chatId, userId);
        return rows[0];
    }

    update(title, chatId, userId) {
        return this.db.prepare("UPDATE chat SET title = ? WHERE id = ? AND user_id = ?").run(title, chatId, userId);
    }

    delete(chatId, userId) {
        this.db.prepare("DELETE FROM chat WHERE id = ? AND user_id = ?").run(chatId, userId);
    }
}