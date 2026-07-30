export default class ChatMetadataModel {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = `
            CREATE TABLE IF NOT EXISTS chatmetadata (
                provider TEXT NOT NULL DEFAULT 'ollama',
                model TEXT NOT NULL DEFAULT 'gemma4:latest',
                system_content TEXT,
                think TEXT DEFAULT medium,
                temperature REAL DEFAULT 0.7,
                top_k INTEGER DEFAULT 50,
                top_p REAL DEFAULT 0.9,
                min_p REAL DEFAULT 0.05,
                context INTEGER DEFAULT 4096,
                predict INTEGER DEFAULT 2048,
                chat_id INTEGER PRIMARY KEY,
                FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE
            );
        `;
        this.db.exec(table);
    }

    findById(chatId) {
        const rows = this.db.prepare("SELECT * FROM chatmetadata WHERE chat_id = ?").all(chatId);
        return rows[0];
    }

    update(columns, values, chatId) {
        return this.db.prepare(`UPDATE chatmetadata SET ${columns} WHERE chat_id = ?`).run(...values, chatId);
    }
}