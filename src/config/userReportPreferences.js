function initializeUserReportPreferencesTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_report_preferences (
      user_id INTEGER PRIMARY KEY,
      action_filters TEXT NOT NULL DEFAULT '[]',
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}

module.exports = { initializeUserReportPreferencesTable };
