import { Sqlite } from '@nativescript/sqlite';

export class DatabaseService {
  private db: Sqlite;

  async init() {
    this.db = await new Sqlite('garbage_routes.db');
    
    await this.db.execSQL(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT NOT NULL,
        cpf TEXT UNIQUE NOT NULL,
        address TEXT NOT NULL
      )
    `);

    await this.db.execSQL(`
      CREATE TABLE IF NOT EXISTS route_stretches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'not_started'
      )
    `);

    await this.db.execSQL(`
      CREATE TABLE IF NOT EXISTS waypoints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        stretch_id INTEGER,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        sequence INTEGER NOT NULL,
        description TEXT,
        FOREIGN KEY (stretch_id) REFERENCES route_stretches(id)
      )
    `);
  }

  async saveUser(user: any) {
    const result = await this.db.execSQL(
      `INSERT INTO users (name, email, phone, cpf, address) 
       VALUES (?, ?, ?, ?, ?)`,
      [user.name, user.email, user.phone, user.cpf, user.address]
    );
    return result;
  }

  async getUser(email: string) {
    const result = await this.db.get(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return result;
  }
}