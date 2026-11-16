const Database = require('better-sqlite3')
const path = require('path')

const db = new Database(process.env.DB_PATH || path.join(__dirname, 'campus.db'))
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  enrollment TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT DEFAULT '',
  department TEXT DEFAULT 'Computer Science & Engineering',
  year TEXT DEFAULT 'Third year',
  interests TEXT DEFAULT '[]',
  password_hash TEXT,
  verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published',
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  registration_deadline TEXT NOT NULL,
  venue TEXT NOT NULL,
  organiser TEXT NOT NULL,
  coordinator_name TEXT NOT NULL DEFAULT '',
  coordinator_email TEXT NOT NULL DEFAULT '',
  max_participants INTEGER NOT NULL,
  available_seats INTEGER NOT NULL,
  fee INTEGER NOT NULL DEFAULT 0,
  eligibility TEXT NOT NULL DEFAULT '',
  rules TEXT NOT NULL DEFAULT '',
  featured INTEGER NOT NULL DEFAULT 0,
  image TEXT NOT NULL DEFAULT 'favicon.svg',
  image_alt TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reg_id TEXT NOT NULL UNIQUE,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'confirmed', -- confirmed | waitlist | cancelled
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (student_id, event_id)
);

CREATE TABLE IF NOT EXISTS saved_events (
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  PRIMARY KEY (student_id, event_id)
);

CREATE TABLE IF NOT EXISTS otps (
  student_id INTEGER PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0
);
`)

module.exports = db
