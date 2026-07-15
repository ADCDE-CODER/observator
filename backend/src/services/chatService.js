export class ChatService {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const chatTable = `
            CREATE TABLE IF NOT EXISTS chat (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                user_id INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES user(id)
            );
        `;
        this.db.exec(chatTable);
    };

    create({ title,  userID } = {}) {    
        if (!title || !userID) {
            throw new Error("Title and user ID are required to create a chat.");
        }
    
        try {
            return this.db.prepare("INSERT INTO chat(title, user_id) VALUES (?, ?)").run(title, userID);
        } catch (error) {
            throw error;
        }
    };
    
    read(userID) {
        if (!userID) {
            throw new Error("User ID is required to read chat(s).");
        }

        try {
            return this.db.prepare("SELECT * FROM chat WHERE user_id = ? ORDER BY created_at ASC").all(userID);
        } catch (error) {
            throw error;
        }
    };
    
    update({ title, chatID, userID } = {}) {        
        if (!title || !chatID || !userID) {
            throw new Error("Title, chat ID, and user ID are required to update a chat.");
        }

        try {
            return this.db.prepare("UPDATE chat SET title = ? WHERE id = ? AND user_id = ?").run(title, chatID, userID);
        } catch (error) {
            throw error;
        }
    };
    
    delete({ chatID, userID } = {}) {
        if (!chatID && !userID) {
            throw new Error("chat ID and user ID are required to delete a chat.")
        }

        try {
            return this.db.prepare("DELETE FROM chat WHERE id = ? AND user_id = ?").run(chatID, userID);
        } catch (error) {
            throw error;
        }
    };
}