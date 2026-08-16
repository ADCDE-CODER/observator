export default class ChatMessageModel {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = ` 
            CREATE TABLE IF NOT EXISTS chatmessage (
                id INTEGER PRIMARY KEY,
                role TEXT CHECK(role IN ('user', 'assistant')) NOT NULL,
                sequence INTEGER NOT NULL,
                created_at TEXT,
                updated_at TEXT,
                chat_id INTEGER NOT NULL,
                FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE,
                UNIQUE(chat_id, sequence)
            );
        `;
        this.db.exec(table);
    }

    create(role, createdAt, chatId) {
        const { next_sequence: nextSequence } = this.db.prepare("SELECT COALESCE(MAX(sequence), 0) + 1 AS next_sequence FROM chatmessage WHERE chat_id = ?").get(chatId);
        return this.db.prepare("INSERT INTO chatmessage(role, sequence, created_at, chat_id) VALUES (?, ?, ?, ?)").run(role, nextSequence, createdAt, chatId);
    }

    getAll(orderBy, chatId) {
        return this.db.prepare("SELECT * FROM chatmessage WHERE chat_id = ? ORDER BY sequence = ?").all(chatId, orderBy);
    }

    getAllBySequence(orderBy, sequence, chatId) {
        return this.db.prepare("SELECT * FROM chatmessage WHERE sequence <= ? AND chat_id = ? ORDER BY sequence = ?").all(sequence, chatId, orderBy);
    }

    findById(id, chatId) {
        const rows = this.db.prepare("SELECT * FROM chatmessage WHERE id = ? AND chat_id = ?").all(id, chatId);
        return rows[0];
    }

    update(role, updatedAt, id, chatId) {
        return this.db.prepare("UPDATE chatmessage SET role = ?, updated_at = ? WHERE id = ? AND chat_id = ?").run(role, updatedAt, id, chatId);
    }

    delete(id, chatId) {
        this.db.prepare("DELETE FROM chatmessage WHERE id = ? AND chat_id = ?").run(id, chatId);
    }
}