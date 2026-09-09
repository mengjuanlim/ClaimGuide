import Database from 'better-sqlite3';
import fs from 'fs';
fs.mkdirSync('./data',{recursive:true});
export const db=new Database('./data/claimguide.db');
db.pragma('journal_mode = WAL');
db.exec(`
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, provider TEXT, provider_id TEXT, name TEXT, email TEXT UNIQUE, avatar TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS claims(id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, ref TEXT UNIQUE, title TEXT NOT NULL, claim_type TEXT, insurer TEXT, incident_date TEXT, status TEXT DEFAULT 'Action needed', progress INTEGER DEFAULT 20, facts TEXT DEFAULT '{}', created_at TEXT DEFAULT CURRENT_TIMESTAMP, updated_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS documents(id INTEGER PRIMARY KEY AUTOINCREMENT, claim_id INTEGER NOT NULL, name TEXT, stored_name TEXT, mime TEXT, size INTEGER, category TEXT DEFAULT 'Claim evidence', review_status TEXT DEFAULT 'Processing', created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS drafts(id INTEGER PRIMARY KEY AUTOINCREMENT, claim_id INTEGER NOT NULL, mode TEXT, content TEXT, version INTEGER DEFAULT 1, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS activities(id INTEGER PRIMARY KEY AUTOINCREMENT, claim_id INTEGER NOT NULL, actor TEXT, event TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
`);
export function seedUser(){let u=db.prepare('SELECT * FROM users WHERE email=?').get('demo@claimguide.test');if(!u){db.prepare('INSERT INTO users(provider,provider_id,name,email) VALUES(?,?,?,?)').run('demo','demo-1','MJ Lim','demo@claimguide.test');u=db.prepare('SELECT * FROM users WHERE email=?').get('demo@claimguide.test');}return u;}
