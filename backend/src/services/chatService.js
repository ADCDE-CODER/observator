export default class ChatService {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = `
            CREATE TABLE IF NOT EXISTS chat (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                user_id INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES user(id)
            );
        `;
        this.db.exec(table);
    };

    create(chatData, userId) {    
        const { title } = chatData;

        if (!title) {
            const error = new Error("Title is required to create a chat.");
            error.status = 400;
            throw error;
        }
        
        if (!userId) {
            throw new Error("User ID is required to create a chat.");
        }
    
        try {
            this.db.prepare("INSERT INTO chat(title, user_id) VALUES (?, ?)").run(title, userId);
        } catch (error) {
            throw error;
        }
    };
    
    read(userId) {
        if (!userId) {
            throw new Error("User ID is required to read chat(s).");
        }

        try {
            return this.db.prepare("SELECT * FROM chat WHERE user_id = ? ORDER BY created_at ASC").all(userId);
        } catch (error) {
            throw error;
        }
    };

    findById(chatId, userId) {
        if (!chatId || !userId) {
            throw new Error("Chat ID and user ID are required to get a chat.");
        }

        try {
            const chat = this.db.prepare("SELECT id, user_id FROM chat WHERE chat_id = ? AND user_id = ?").all(chatId, userId);

            if (!chat) {
                const error = new Error("Chat not found.");
                error.status = 404;
                throw error;
            }

            return chat;
        } catch (error) {
            throw error;
        }
    };
    
    update(chatData, chatId, userId) {        
        const { title } = chatData;

        if (!title) {
            const error = new Error("Title is required to update a chat.");
            error.status = 400;
            throw error;
        }
        
        if (!chatId || !userId) {
            throw new Error("Chat ID, and user ID are required to update a chat.");
        }

        try {
            const chat = this.db.prepare("UPDATE chat SET title = ? WHERE id = ? AND user_id = ?").run(title, chatId, userId);

            if (!chat) {
                throw new Error("Failed to update chat title");
            }

            return chat;
        } catch (error) {
            throw error;
        }
    };
    
    delete(chatId, userId) {
        if (!chatId && !userId) {
            throw new Error("chat ID and user ID are required to delete a chat.")
        }

        try {
            this.db.prepare("DELETE FROM chat WHERE id = ? AND user_id = ?").run(chatId, userId);
        } catch (error) {
            throw error;
        }
    };
}