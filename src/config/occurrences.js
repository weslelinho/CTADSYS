function initializeOccurrencesTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS occurrences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      occurred_at TEXT NOT NULL,
      created_by INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );
  `);
}

module.exports = { initializeOccurrencesTable };
