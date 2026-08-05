export default class AssistantChatMessageModel {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = ` 
            CREATE TABLE IF NOT EXISTS assistantchatmessage (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                model TEXT,
                thinking TEXT,
                content TEXT NOT NULL,
                images TEXT,
                chatmessage_id INTEGER NOT NULL,
                FOREIGN KEY (chatmessage_id) REFERENCES chatmessage(id) ON DELETE CASCADE
            );
        `;
        this.db.exec(table);
    }

    create(model, thinking, content, images, chatMessageId) {
        this.db.prepare("INSERT INTO assistantchatmessage(model, thinking, content, images, chatmessage_id) VALUES (?, ?, ?, ?, ?)").run(model, thinking, content, images, chatMessageId);
    }

    findByIds(chatMessageIds) {
        return this.db.prepare(`SELECT * FROM assistantchatmessage WHERE chatmessage_id IN (${ chatMessageIds.map(() => "?").join(", ") })`).all(chatMessageIds);
    }

    findById(id, chatMessageId) {
        const rows = this.db.prepare("SELECT id, chatmessage_id FROM assistantchatmessage WHERE id = ? AND chatmessage_id = ?").all(id, chatMessageId);
        return rows[0];
    }

    update(content, images, id, chatMessageId) {
        return this.db.prepare("UPDATE assistantchatmessage SET content = ?, images = ? WHERE id = ? AND chatmessage_id = ?").run(content, images, id, chatMessageId);
    }

    delete(id, chatMessageId) {
        this.db.prepare("DELETE FROM assistantchatmessage WHERE id = ? AND chatmessage_id = ?").run(id, chatMessageId);
    }
}