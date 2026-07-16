export class ChatMetadataService {
    constructor(db) {
        this.db = db;
        this.keys = ['provider', 'model', 'system_content', 'think', 'temperature', 'top_k', 'top_p', 'min_p', 'context', 'predict'];
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = `
            CREATE TABLE IF NOT EXISTS chatmetadata (
                provider TEXT NOT NULL UNIQUE,
                model TEXT NOT NULL,
                system_content TEXT,
                think TEXT,
                temperature REAL,
                top_k INTEGER,
                top_p REAL,
                min_p REAL,
                context INTEGER,
                predict INTEGER,
                chat_id INTEGER PRIMARY KEY,
                FOREIGN KEY (chat_id) REFERENCES chat(id) ON DELETE CASCADE
            );
        `;
        this.db.exec(table);
    };

    create(chatMetadata) {
        const { provider, model, chat_id } = chatMetadata; 

        if (!provider || !model) {
            const error = new Error("Provider and model are required to create a chat metadata.");
            error.status = 400;
            throw error;
        }

        if (!chat_id) {
            throw new Error("Chat ID is required to create a chat metadata.");
        }

        let validKeys = [];
        let validValues = [];
    
        // Ensure casing matches DB schema strictly (snake_case)
        this.keys.forEach(key => {
            const value = chatMetadata[key];
            if (!value || value !== undefined) return;

            validKeys.push(key);
            validValues.push(value);
        });

        const columns = validKeys.join(', ');
        const questionMarks = Array(validKeys.length).fill('?').join(', ');
        
        try {
            this.db.prepare(`INSERT INTO chatmetadata(${columns}) VALUES (${questionMarks})`).run(...validValues);
        } catch (error) {
            throw error;
        }
    };
    
    read(chat_id) {
        if (!chat_id) {
            throw new Error("Chat ID is required to read chat metadata.");
        }

        try {            
            return this.db.prepare("SELECT * FROM chatmetadata WHERE chat_id = ?").all(chat_id);
        } catch (error) {
            throw error;
        }
    };
    
    update(chatMetadata, chat_id) {
        const { provider, model } = chatMetadata; 
        
        if (!provider || !model) {
            const error = new Error("Provider and model are required to update a chat metadata.");
            error.status = 400;
            throw error;
        }
        
        if (!chat_id) {
            throw new Error("Chat ID is required to update a chat metadata.");
        }

        let columns = "";
        let validValues = [];
        
        // Ensure casing matches DB schema strictly (snake_case)
        this.keys.forEach(key => {
            const value = chatMetadata[key];
            if (!value || value !== undefined) return;

            columns += `${key} = ?, `;
            validValues.push(value);
        });

        try {
            return this.db.prepare(`UPDATE chatmetadata SET ${columns.slice(0, -1)} WHERE chat_id = ?`).run(...validValues, chat_id);
        } catch (error) {
            throw error;
        }
    };
}