const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(process.cwd(), 'database', 'warehouse.db');

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE,
    product TEXT,
    tie INTEGER,
    height INTEGER,
    truck TEXT
  );
`);

console.log('Database and table created at:', dbPath);
