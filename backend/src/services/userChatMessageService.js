export default class UserChatMessageService {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = ` 
            CREATE TABLE IF NOT EXISTS chatmessage (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                role TEXT CHECK(role IN ('user')) NOT NULL,
                content TEXT NOT NULL,
                images TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                chat_id INTEGER NOT NULL,
                FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE
            );
        `;
        this.db.exec(table);
    };

    create(chatMessageData, chatId) {    
        const { role, content, images } = chatMessageData;
        
        if (!role || !content && !images) {
            const error = new Error("Role, content, and images are required to create a chat message.");
            error.status = 400;
            throw error;
        }
        
        if (!chatId) {
            throw new Error("Chat ID is required to create a chat message.");
        }
    
        try {
            this.db.prepare("INSERT INTO chatmessage(role, content, images, chat_id) VALUES (?, ?, ?, ?)").run(role, content, images, chatId);
        } catch (error) {
            throw error;
        }
    };
    
    read(chatId) {
        if (!chatId) {
            throw new Error("Chat ID is required to read chat message(s).");
        }

        try {
            return this.db.prepare("SELECT role, content, images created_at FROM chatmessage WHERE chat_id = ? ORDER BY created_at ASC").all(chatId);
        } catch (error) {
            throw error;
        }
    };
    
    update(chatMessageData, chatMessageId, chatId) {  
        const { role, content, images } = chatMessageData;
        
        if (!role || !content && !images) {
            const error = new Error("Role, content, and images are required to update a chat message.");
            error.status = 400;
            throw error;
        }
        
        if (!chatMessageId || !chatId ) {
            throw new Error("Chat message ID and chat ID are required to update a chat message.");
        }

        try {
            const userChatMessage = this.db.prepare("UPDATE chatmessage SET role = ?, content = ?, images = ? WHERE id = ? AND chat_id = ?").run(role, content, images, chatMessageId, chatId);

            if(!userChatMessage) {
                throw new Error("Update failed.");
            }

            return userChatMessage;
        } catch (error) {
            throw error;
        }
    };
    
    delete(chatMessageId, chatId) {
        if (!chatMessageId && !chatId) {
            throw new Error("Chat message ID and chat ID are required to delete a chat message.")
        }

        try {
            this.db.prepare("DELETE FROM chatmessage WHERE id = ? AND chat_id = ?").run(chatMessageId, chatId);
        } catch (error) {
            throw error;
        }
    };
}