import { DatabaseSync } from "node:sqlite";
import path from "node:path";

export type UserRecord = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
};

export type OrganizerCardRecord = {
  id: number;
  headline: string;
  body: string;
  example: string | null;
  sort_order: number;
  is_published: number;
  updated_at: string;
};

export type EventRecord = {
  id: number;
  name: string;
  date: string;
  location: string | null;
  description: string | null;
  organizer_id: number;
  created_at: string;
};

export type GuestRecord = {
  id: number;
  event_id: number;
  name: string;
  email: string;
  rsvp_status: string;
  created_at: string;
};

const dbPath = process.env.SQLITE_DB_PATH
  ? path.resolve(process.env.SQLITE_DB_PATH)
  : path.resolve(process.cwd(), "eventhive.db");

// Preserve DB instance across hot reloads in development
declare global {
  var __eventhiveDb: DatabaseSync | undefined;
}

let db: DatabaseSync | undefined;

function initDb() {
  const connection = new DatabaseSync(dbPath);
  connection.exec("PRAGMA journal_mode = WAL");
  connection.exec("PRAGMA busy_timeout = 5000");

  connection.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  connection.exec(`
    CREATE TABLE IF NOT EXISTS organizer_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      headline TEXT NOT NULL,
      body TEXT NOT NULL,
      example TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_published INTEGER NOT NULL DEFAULT 1,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  connection.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      location TEXT,
      description TEXT,
      organizer_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (organizer_id) REFERENCES users(id)
    )
  `);

  connection.exec(`
    CREATE TABLE IF NOT EXISTS guests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      rsvp_status TEXT NOT NULL DEFAULT 'Pending',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    )
  `);

  if (process.env.NODE_ENV !== "production") {
    globalThis.__eventhiveDb = connection;
  }

  return connection;
}

function getDb() {
  if (!db) {
    db = initDb();
  }
  return db;
}

function prepare(sql: string) {
  return getDb().prepare(sql);
}

export function createUser(input: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  const result = prepare(`
    INSERT INTO users (name, email, password_hash)
    VALUES (?, ?, ?)
  `).run(input.name, input.email, input.passwordHash);
  return Number(result.lastInsertRowid);
}

export function getUserByEmail(email: string) {
  return prepare(`
    SELECT id, name, email, password_hash, created_at
    FROM users
    WHERE email = ?
  `).get(email) as UserRecord | undefined;
}

export function getUserById(id: number) {
  return prepare(`
    SELECT id, name, email, password_hash, created_at
    FROM users
    WHERE id = ?
  `).get(id) as UserRecord | undefined;
}

export function getPublishedOrganizerCards() {
  return prepare(`
    SELECT id, headline, body, example, sort_order, is_published, updated_at
    FROM organizer_cards
    WHERE is_published = 1
    ORDER BY sort_order ASC, id ASC
  `).all() as OrganizerCardRecord[];
}

// ── Events ──────────────────────────────────────────────────────────────────

export function createEvent(input: {
  name: string;
  date: string;
  location?: string;
  description?: string;
  organizer_id: number;
}) {
  const result = prepare(`
    INSERT INTO events (name, date, location, description, organizer_id)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    input.name,
    input.date,
    input.location ?? null,
    input.description ?? null,
    input.organizer_id,
  );
  return Number(result.lastInsertRowid);
}

export function getEventById(id: number) {
  return prepare(`
    SELECT id, name, date, location, description, organizer_id, created_at
    FROM events WHERE id = ?
  `).get(id) as EventRecord | undefined;
}

export function getAllEvents() {
  return prepare(`
    SELECT id, name, date, location, description, organizer_id, created_at
    FROM events ORDER BY date ASC
  `).all() as EventRecord[];
}

export function getEventsByOrganizer(organizerId: number) {
  return prepare(`
    SELECT id, name, date, location, description, organizer_id, created_at
    FROM events WHERE organizer_id = ? ORDER BY date ASC
  `).all(organizerId) as EventRecord[];
}

export function updateEvent(
  id: number,
  input: { name: string; date: string; location?: string; description?: string },
) {
  prepare(`
    UPDATE events SET name = ?, date = ?, location = ?, description = ?
    WHERE id = ?
  `).run(
    input.name,
    input.date,
    input.location ?? null,
    input.description ?? null,
    id,
  );
}

export function deleteEvent(id: number) {
  prepare(`
    DELETE FROM guests WHERE event_id = ?
  `).run(id);
  prepare(`
    DELETE FROM events WHERE id = ?
  `).run(id);
}

// ── Guests ───────────────────────────────────────────────────────────────────

export function addGuest(input: { event_id: number; name: string; email: string }) {
  const result = prepare(`
    INSERT INTO guests (event_id, name, email)
    VALUES (?, ?, ?)
  `).run(input.event_id, input.name, input.email);
  return Number(result.lastInsertRowid);
}

export function getGuestsByEventId(eventId: number) {
  return prepare(`
    SELECT id, event_id, name, email, rsvp_status, created_at
    FROM guests WHERE event_id = ? ORDER BY created_at ASC
  `).all(eventId) as GuestRecord[];
}

export function deleteGuest(id: number) {
  prepare(`
    DELETE FROM guests WHERE id = ?
  `).run(id);
}
