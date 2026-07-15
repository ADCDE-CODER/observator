export class ChatMessageService {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const chatMessageTable = ` 
            CREATE TABLE IF NOT EXISTS chatmessage (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role TEXT CHECK(role IN ('user', 'assistant', 'system')) NOT NULL,
                content TEXT NOT NULL,
                images TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                chat_id INTEGER NOT NULL,
                FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE
            );
        `;
        this.db.exec(chatMessageTable);
    };

    create({ role, content, images, chatID } = {}) {    
        if (!role || (!content && !images) || !chatID ) {
            throw new Error("Role, content/images, and chat ID are required to create a chat message.");
        }
    
        try {
            return this.db.prepare("INSERT INTO chatmessage(role, content, images, chat_id) VALUES (?, ?, ?, ?)").run(role, content, images, chatID);
        } catch (error) {
            throw error;
        }
    };
    
    read(chatID) {
        if (!chatID) {
            throw new Error("Chat ID is required to read chat message(s).");
        }

        try {
            return this.db.prepare("SELECT role, content, created_at FROM chatmessage WHERE chat_id = ? ORDER BY created_at ASC").all(chatID);
        } catch (error) {
            throw error;
        }
    };
    
    update({ role, content, images, chatMessageID, chatID } = {}) {        
        if (!role || (!content && !images) || !chatMessageID || !chatID ) {
            throw new Error("Role, content/images, chat message ID, and chat ID are required to update a chat message.");
        }

        try {
            return this.db.prepare("UPDATE chatmessage SET role = ?, content = ?, images = ? WHERE id = ? AND chat_id = ?").run(role, content, images, chatMessageID, chatID);
        } catch (error) {
            throw error;
        }
    };
    
    delete({ chatMessageID, chatID } = {}) {
        if (!chatMessageID && !chatID) {
            throw new Error("chat message ID and chat ID are required to delete a chat message.")
        }

        try {
            return this.db.prepare("DELETE FROM chatmessage WHERE id = ? AND chat_id = ?").run(chatMessageID, chatID);
        } catch (error) {
            throw error;
        }
    };
}