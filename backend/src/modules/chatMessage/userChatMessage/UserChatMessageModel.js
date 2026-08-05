export default class UserChatMessageModel {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = ` 
            CREATE TABLE IF NOT EXISTS userchatmessage (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                images TEXT,
                chatmessage_id INTEGER NOT NULL,
                FOREIGN KEY (chatmessage_id) REFERENCES chatmessage(id) ON DELETE CASCADE
            );
        `;
        this.db.exec(table);
    }

    create(content, images, chatMessageId) {
        this.db.prepare("INSERT INTO userchatmessage(content, images, chatmessage_id) VALUES (?, ?, ?)").run(content, images, chatMessageId);
    }

    findByIds(chatMessageIds) {
        return this.db.prepare(`SELECT * FROM userchatmessage WHERE chatmessage_id IN (${ chatMessageIds.map(() => "?").join(", ") })`).all(chatMessageIds);
    }

    findById(id, chatMessageId) {
        const rows = this.db.prepare("SELECT id, chatmessage_id FROM userchatmessage WHERE id = ? AND chatmessage_id = ?").all(id, chatMessageId);
        return rows[0];
    }

    update(content, images, id, chatMessageId) {
        return this.db.prepare("UPDATE userchatmessage SET content = ?, images = ? WHERE id = ? AND chatmessage_id = ?").run(content, images, id, chatMessageId);
    }

    delete(id, chatMessageId) {
        this.db.prepare("DELETE FROM userchatmessage WHERE id = ? AND chatmessage_id = ?").run(id, chatMessageId);
    }
}