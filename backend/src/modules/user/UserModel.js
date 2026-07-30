export default class UserModel {
    constructor(db) {
        this.db = db;
        this.initializeDatabase();
    }

    initializeDatabase() {
        const table = `
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                username TEXT NOT NULL UNIQUE,
                first_name TEXT,
                last_name TEXT,
                street_address TEXT,
                postal_address TEXT,
                phone_number INTEGER UNIQUE,
                date_of_birth INTEGER
            );
        `;
        this.db.exec(table);
    }

    create(columns, questionMarks, values) {
        this.db.prepare(`INSERT INTO user(${columns}) VALUES (${questionMarks})`).run(...values);
    }

    findByIdentifier(indentifier) {
        return this.db.prepare("SELECT id, email, username, password FROM user WHERE (email = ? OR username = ?)").get(indentifier, indentifier);
    }

    findById(userId) {
        const rows = this.db.prepare("SELECT * FROM user WHERE id = ?").get(userId);
        return rows[0];
    }

    update(columns, values, userId) {
        return this.db.prepare(`UPDATE user SET ${columns.splice(0, -1)} WHERE id = ?`).run(...values, userId);
    }

    delete(userId) {
        this.db.prepare("DELETE FROM user WHERE id = ?").run(userId);
    }
}