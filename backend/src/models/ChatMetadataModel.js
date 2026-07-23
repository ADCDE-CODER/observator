export default class ChatMetadataModel {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = `
            CREATE TABLE IF NOT EXISTS chatmetadata (
                provider TEXT NOT NULL UNIQUE,
                model TEXT NOT NULL,
                system_content TEXT,
                think TEXT,
                temperature REAL,
                top_k INTEGER,
                top_p REAL,
                min_p REAL,
                context INTEGER,
                predict INTEGER,
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