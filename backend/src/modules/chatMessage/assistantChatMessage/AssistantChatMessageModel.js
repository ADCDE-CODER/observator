export default class AssistantChatMessageModel {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = ` 
            CREATE TABLE IF NOT EXISTS assistantchatmessage (
                chatmessage_id INTEGER PRIMARY KEY,
                model TEXT,
                thinking TEXT,
                content TEXT NOT NULL,
                images TEXT,
                userchatmessage_id INTEGER NOT NULL,
                FOREIGN KEY (chatmessage_id) REFERENCES chatmessage(id) ON DELETE CASCADE,
                FOREIGN KEY (userchatmessage_id) REFERENCES userchatmessage(chatmessage_id) ON DELETE CASCADE
            );
        `;
        this.db.exec(table);
    }

    create(model, thinking, content, images, chatMessageId, userChatMessageId) {
        this.db.prepare("INSERT INTO assistantchatmessage(model, thinking, content, images, chatmessage_id, userchatmessage_id) VALUES (?, ?, ?, ?, ?, ?)").run(model, thinking, content, images, chatMessageId, userChatMessageId);
    }

    findByIds(chatMessageIds) {
        return this.db.prepare(`SELECT * FROM assistantchatmessage WHERE chatmessage_id IN (${ chatMessageIds.map(() => "?").join(", ") })`).all(chatMessageIds);
    }

    findMessageIdsByUserMessageId(userChatMessageId) {
        return this.db.prepare("SELECT chatmessage_id FROM assistantchatmessage WHERE userchatmessage_id = ?").all(userChatMessageId).map(row => row.chatmessage_id);
    }

    update(content, images, chatMessageId) {
        return this.db.prepare("UPDATE assistantchatmessage SET content = ?, images = ? WHERE chatmessage_id = ?").run(content, images, chatMessageId);
    }

    delete(chatMessageId, userChatMessageId) {
        this.db.prepare("DELETE FROM assistantchatmessage WHERE chatmessage_id = ? AND userchatmessage_id = ?").run(chatMessageId, userChatMessageId);
    }
}