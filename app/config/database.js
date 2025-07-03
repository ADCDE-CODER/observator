import Database from 'better-sqlite3';

const fileName = "database.sqlite";
const db = new Database(fileName);

export { db };