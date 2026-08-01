import Database from "better-sqlite3";
import { env } from "./env.js";

const db = new Database(env.databaseFilename);
db.exec("PRAGMA foreign_keys = ON;"); // Enable foreign key constraints so that deleting a row will propagate to related tables (ON DELETE CASCADE)

console.log("Database Connection established.");

export { db };