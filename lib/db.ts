import fs from "fs";
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

// Simple in-memory database for demo purposes
interface DatabaseRecord {
  id: number;
  [key: string]: any;
}

class SimpleDB {
  private data: {
    users: UserRecord[];
    organizer_cards: OrganizerCardRecord[];
    events: EventRecord[];
    guests: GuestRecord[];
  } = {
    users: [],
    organizer_cards: [],
    events: [],
    guests: [],
  };

  private nextId = {
    users: 1,
    organizer_cards: 1,
    events: 1,
    guests: 1,
  };

  constructor() {
    this.loadFromFile();
  }

  private getFilePath(): string {
    const dbPath = process.env.SQLITE_DB_PATH || path.resolve(process.cwd(), "eventhive.json");
    return dbPath;
  }

  private loadFromFile() {
    try {
      const filePath = this.getFilePath();
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        this.data = JSON.parse(content);
        // Update nextId based on existing data
        this.nextId.users = Math.max(1, ...this.data.users.map(u => u.id)) + 1;
        this.nextId.organizer_cards = Math.max(1, ...this.data.organizer_cards.map(c => c.id)) + 1;
        this.nextId.events = Math.max(1, ...this.data.events.map(e => e.id)) + 1;
        this.nextId.guests = Math.max(1, ...this.data.guests.map(g => g.id)) + 1;
      }
    } catch (error) {
      console.warn('Failed to load database from file:', error);
    }
  }

  private saveToFile() {
    try {
      const filePath = this.getFilePath();
      fs.writeFileSync(filePath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.warn('Failed to save database to file:', error);
    }
  }

  // Users
  createUser(input: { name: string; email: string; passwordHash: string }): number {
    const user: UserRecord = {
      id: this.nextId.users++,
      name: input.name,
      email: input.email,
      password_hash: input.passwordHash,
      created_at: new Date().toISOString(),
    };
    this.data.users.push(user);
    this.saveToFile();
    return user.id;
  }

  getUserByEmail(email: string): UserRecord | undefined {
    return this.data.users.find(u => u.email === email);
  }

  getUserById(id: number): UserRecord | undefined {
    return this.data.users.find(u => u.id === id);
  }

  // Organizer Cards
  getPublishedOrganizerCards(): OrganizerCardRecord[] {
    return this.data.organizer_cards.filter(c => c.is_published);
  }

  // Events
  createEvent(input: {
    name: string;
    date: string;
    location?: string;
    description?: string;
    organizer_id: number;
  }): number {
    const event: EventRecord = {
      id: this.nextId.events++,
      name: input.name,
      date: input.date,
      location: input.location || null,
      description: input.description || null,
      organizer_id: input.organizer_id,
      created_at: new Date().toISOString(),
    };
    this.data.events.push(event);
    this.saveToFile();
    return event.id;
  }

  getEventById(id: number): EventRecord | undefined {
    return this.data.events.find(e => e.id === id);
  }

  getAllEvents(): EventRecord[] {
    return [...this.data.events].sort((a, b) => a.date.localeCompare(b.date));
  }

  getEventsByOrganizer(organizerId: number): EventRecord[] {
    return this.data.events
      .filter(e => e.organizer_id === organizerId)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  updateEvent(id: number, input: { name: string; date: string; location?: string; description?: string }): void {
    const event = this.data.events.find(e => e.id === id);
    if (event) {
      event.name = input.name;
      event.date = input.date;
      event.location = input.location || null;
      event.description = input.description || null;
      this.saveToFile();
    }
  }

  deleteEvent(id: number): void {
    this.data.events = this.data.events.filter(e => e.id !== id);
    this.data.guests = this.data.guests.filter(g => g.event_id !== id);
    this.saveToFile();
  }

  // Guests
  addGuest(input: { event_id: number; name: string; email: string }): number {
    const guest: GuestRecord = {
      id: this.nextId.guests++,
      event_id: input.event_id,
      name: input.name,
      email: input.email,
      rsvp_status: 'Pending',
      created_at: new Date().toISOString(),
    };
    this.data.guests.push(guest);
    this.saveToFile();
    return guest.id;
  }

  getGuestsByEventId(eventId: number): GuestRecord[] {
    return this.data.guests
      .filter(g => g.event_id === eventId)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
  }

  deleteGuest(id: number): void {
    this.data.guests = this.data.guests.filter(g => g.id !== id);
    this.saveToFile();
  }
}

// Create singleton instance
const db = new SimpleDB();

// Export functions that match the original interface
export function createUser(input: { name: string; email: string; passwordHash: string }): number {
  return db.createUser(input);
}

export function getUserByEmail(email: string): UserRecord | undefined {
  return db.getUserByEmail(email);
}

export function getUserById(id: number): UserRecord | undefined {
  return db.getUserById(id);
}

export function getPublishedOrganizerCards(): OrganizerCardRecord[] {
  return db.getPublishedOrganizerCards();
}

export function createEvent(input: {
  name: string;
  date: string;
  location?: string;
  description?: string;
  organizer_id: number;
}): number {
  return db.createEvent(input);
}

export function getEventById(id: number): EventRecord | undefined {
  return db.getEventById(id);
}

export function getAllEvents(): EventRecord[] {
  return db.getAllEvents();
}

export function getEventsByOrganizer(organizerId: number): EventRecord[] {
  return db.getEventsByOrganizer(organizerId);
}

export function updateEvent(id: number, input: { name: string; date: string; location?: string; description?: string }): void {
  db.updateEvent(id, input);
}

export function deleteEvent(id: number): void {
  db.deleteEvent(id);
}

export function addGuest(input: { event_id: number; name: string; email: string }): number {
  return db.addGuest(input);
}

export function getGuestsByEventId(eventId: number): GuestRecord[] {
  return db.getGuestsByEventId(eventId);
}

export function deleteGuest(id: number): void {
  db.deleteGuest(id);
}
