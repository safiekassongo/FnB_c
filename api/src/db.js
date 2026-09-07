// db.js — SQLite database setup (file-based, no external DB service needed).
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '..', 'data', 'fnb.db');

// Ensure the data directory exists (important on first boot / fresh deploys).
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS news (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    date TEXT NOT NULL,
    body TEXT NOT NULL,
    image TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS research (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    ref TEXT,
    status TEXT,
    date TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- One JSON document per page (or "global" for shared nav/footer info).
  -- This is what makes every page's content editable/dynamic without a
  -- bespoke table per section. Public GET, publisher-only PUT.
  CREATE TABLE IF NOT EXISTS content (
    page TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Contact form submissions. Anyone can POST (submit an inquiry);
  -- only publishers can GET (read the inbox) or DELETE.
  CREATE TABLE IF NOT EXISTS contact_messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    topic TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = db;
