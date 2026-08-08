export default class UserChatMessageModel {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = ` 
            CREATE TABLE IF NOT EXISTS userchatmessage (
                chatmessage_id INTEGER PRIMARY KEY,
                content TEXT NOT NULL,
                images TEXT,
                FOREIGN KEY (chatmessage_id) REFERENCES chatmessage(id) ON DELETE CASCADE
            );
        `;
        this.db.exec(table);
    }

    create(content, images, chatMessageId) {
        return this.db.prepare("INSERT INTO userchatmessage(content, images, chatmessage_id) VALUES (?, ?, ?)").run(content, images, chatMessageId);
    }

    findByIds(chatMessageIds) {
        return this.db.prepare(`SELECT * FROM userchatmessage WHERE chatmessage_id IN (${ chatMessageIds.map(() => "?").join(", ") })`).all(chatMessageIds);
    }

    update(content, images, chatMessageId) {
        return this.db.prepare("UPDATE userchatmessage SET content = ?, images = ? WHERE chatmessage_id = ?").run(content, images, chatMessageId);
    }

    delete(chatMessageId) {
        this.db.prepare("DELETE FROM userchatmessage WHERE chatmessage_id = ?").run(chatMessageId);
    }
}