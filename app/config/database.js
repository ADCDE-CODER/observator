import Database from 'better-sqlite3';

const fileName = "database.sqlite";
const db = new Database(fileName);

db.exec("PRAGMA foreign_keys = ON;"); // Enable foreign key constraints so that deleting a row will propagate to related tables (ON DELETE CASCADE)

export { db };