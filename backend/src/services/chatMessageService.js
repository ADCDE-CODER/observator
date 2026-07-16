export class ChatMessageService {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = ` 
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
        this.db.exec(table);
    };

    create({ role, content, images, chat_id } = {}) {    
        if (!content && !images) {
            const error = new Error("Content and images are required to create a chat message.");
            error.status = 400;
            throw error;
        }
        
        if (!role || !chat_id ) {
            throw new Error("Role and chat ID are required to create a chat message.");
        }
    
        try {
            this.db.prepare("INSERT INTO chatmessage(role, content, images, chat_id) VALUES (?, ?, ?, ?)").run(role, content, images, chat_id);
        } catch (error) {
            throw error;
        }
    };
    
    read(chat_id) {
        if (!chat_id) {
            throw new Error("Chat ID is required to read chat message(s).");
        }

        try {
            return this.db.prepare("SELECT role, content, created_at FROM chatmessage WHERE chat_id = ? ORDER BY created_at ASC").all(chat_id);
        } catch (error) {
            throw error;
        }
    };
    
    update({ role, content, images } = {}, id, chat_id) {        
        if (!content && !images) {
            const error = new Error("Content and images are required to update a chat message.");
            error.status = 400;
            throw error;
        }
        
        if (!role || !id || !chat_id ) {
            throw new Error("Role, chat message ID, and chat ID are required to update a chat message.");
        }

        try {
            return this.db.prepare("UPDATE chatmessage SET role = ?, content = ?, images = ? WHERE id = ? AND chat_id = ?").run(role, content, images, id, chat_id);
        } catch (error) {
            throw error;
        }
    };
    
    delete(id, chat_id) {
        if (!id && !chat_id) {
            throw new Error("chat message ID and chat ID are required to delete a chat message.")
        }

        try {
            this.db.prepare("DELETE FROM chatmessage WHERE id = ? AND chat_id = ?").run(id, chat_id);
        } catch (error) {
            throw error;
        }
    };
}