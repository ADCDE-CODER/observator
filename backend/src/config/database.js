import Database from 'better-sqlite3';

const db = new Database(process.env.DATABASE_FILENAME);
db.exec("PRAGMA foreign_keys = ON;"); // Enable foreign key constraints so that deleting a row will propagate to related tables (ON DELETE CASCADE)

console.log("Database Connection established.");

export { db };