export default class ChatMetadataModel {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = `
            CREATE TABLE IF NOT EXISTS chatmetadata (
                provider TEXT NOT NULL,
                model TEXT,
                config TEXT,
                chat_id INTEGER PRIMARY KEY,
                FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE
            );
        `;
        this.db.exec(table);
    }

    create(provider, model, config, chatId) {
        this.db.prepare("INSERT INTO chatmetadata(provider, model, config, chat_id) VALUES (?, ?, ?, ?)").run(provider, model, config, chatId);
    }

    findById(chatId) {
        return this.db.prepare("SELECT * FROM chatmetadata WHERE chat_id = ?").get(chatId);
    }

    update(provider, model, config, chatId) {
        return this.db.prepare(`UPDATE chatmetadata SET provider = ?, model = ?, config = ? WHERE chat_id = ?`).run(provider, model, config, chatId);
    }

    updateModel(model, chatId) {
        return this.db.prepare(`UPDATE chatmetadata SET model = ? WHERE chat_id = ?`).run(model, chatId);
    }

    updateConfig(config, chatId) {
        return this.db.prepare(`UPDATE chatmetadata SET config = ? WHERE chat_id = ?`).run(config, chatId);
    }
}