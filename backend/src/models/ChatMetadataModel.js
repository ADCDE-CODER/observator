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

    create(columns, questionMarks, values) {
        this.db.prepare(`INSERT INTO chatmetadata(${columns}) VALUES (${questionMarks})`).run(...values);
    }

    findById(chatId) {
        return this.db.prepare("SELECT * FROM chatmetadata WHERE chat_id = ?").all(chatId);
    }

    update(columns, values, userId) {
        return this.db.prepare(`UPDATE chatmetadata SET ${columns.slice(0, -1)} WHERE chat_id = ?`).run(...values, userId);
    }
}