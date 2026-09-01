import Database from "better-sqlite3";
import { env } from "./env.js";
import fs from "fs";
import path from "path";

const databasePath = env.databaseFilename;
const databaseDirectory = path.dirname(databasePath);

fs.mkdirSync(databaseDirectory, { recursive: true });

const db = new Database(databasePath);
db.exec("PRAGMA foreign_keys = ON;"); // Enable foreign key constraints so that deleting a row will propagate to related tables (ON DELETE CASCADE)

console.log("Database Connection established.");

export { db };