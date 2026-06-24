const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');
const path = require('path');
const { authConfig } = require('./auth');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../database.sqlite');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function migrateUsersTable() {
  const columns = db.prepare('PRAGMA table_info(users)').all().map((c) => c.name);

  if (columns.includes('username')) return;

  db.exec('PRAGMA foreign_keys = OFF');
  db.exec('DROP TABLE IF EXISTS users');
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'user')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  db.exec('PRAGMA foreign_keys = ON');
}

async function seedDefaultAdmin() {
  const count = db.prepare('SELECT COUNT(*) AS total FROM users').get().total;
  if (count > 0) return;

  const { username, password, name } = authConfig.defaultAdmin;
  const passwordHash = await bcrypt.hash(password, 10);

  db.prepare(
    `INSERT INTO users (username, password_hash, name, role) VALUES (?, ?, ?, 'admin')`
  ).run(username, passwordHash, name);

  console.log(`✓ Usuário admin criado: "${username}"`);
}

const { initializeOccurrencesTable } = require('./occurrences');
const { initializeAuditLogsTable } = require('./auditLogs');
const { initializePageContentTable } = require('./pageContent');

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      cpf TEXT UNIQUE,
      birth_date TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      admission_date TEXT,
      status TEXT NOT NULL DEFAULT 'ativo' CHECK(status IN ('ativo', 'alta', 'transferido', 'desligado')),
      notes TEXT,
      created_by INTEGER,
      hidden INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );
  `);

  migrateUsersTable();
  migrateClientsHiddenColumn();
  migrateClientsPhotoColumn();
  migrateClientsExtendedFields();
  migrateClientsExitDateColumn();
  initializeOccurrencesTable(db);
  initializeAuditLogsTable(db);
  initializePageContentTable(db);
}

function migrateClientsHiddenColumn() {
  const columns = db.prepare('PRAGMA table_info(clients)').all().map((c) => c.name);
  if (!columns.includes('hidden')) {
    db.exec('ALTER TABLE clients ADD COLUMN hidden INTEGER NOT NULL DEFAULT 0');
  }
}

function migrateClientsPhotoColumn() {
  const columns = db.prepare('PRAGMA table_info(clients)').all().map((c) => c.name);
  if (!columns.includes('photo_path')) {
    db.exec('ALTER TABLE clients ADD COLUMN photo_path TEXT');
  }
}

function migrateClientsExtendedFields() {
  const columns = db.prepare('PRAGMA table_info(clients)').all().map((c) => c.name);
  const additions = [
    ['rg', 'TEXT'],
    ['orgao_expedidor', 'TEXT'],
    ['data_emissao', 'TEXT'],
    ['titulo_eleitor', 'TEXT'],
    ['profissao', 'TEXT'],
    ['escolaridade', 'TEXT'],
    ['estado_civil', 'TEXT'],
    ['filiacao_pai', 'TEXT'],
    ['filiacao_mae', 'TEXT'],
    ['naturalidade', 'TEXT'],
    ['sexo', 'TEXT'],
    ['trabalha', 'INTEGER'],
    ['numero_filhos', 'INTEGER'],
  ];

  for (const [name, type] of additions) {
    if (!columns.includes(name)) {
      db.exec(`ALTER TABLE clients ADD COLUMN ${name} ${type}`);
    }
  }
}

function migrateClientsExitDateColumn() {
  const columns = db.prepare('PRAGMA table_info(clients)').all().map((c) => c.name);
  if (!columns.includes('data_saida')) {
    db.exec('ALTER TABLE clients ADD COLUMN data_saida TEXT');
  }
}

async function initializeDatabaseAsync() {
  initializeDatabase();
  await seedDefaultAdmin();
}

module.exports = { db, initializeDatabase, initializeDatabaseAsync };
