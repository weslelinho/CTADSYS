const { db } = require('../config/database');

const userReportPreferencesRepository = {
  findByUserId(userId) {
    return db
      .prepare(
        `SELECT user_id, action_filters, updated_at
         FROM user_report_preferences
         WHERE user_id = ?`
      )
      .get(userId);
  },

  upsert(userId, actionFiltersJson) {
    db.prepare(
      `INSERT INTO user_report_preferences (user_id, action_filters, updated_at)
       VALUES (?, ?, datetime('now'))
       ON CONFLICT(user_id) DO UPDATE SET
         action_filters = excluded.action_filters,
         updated_at = excluded.updated_at`
    ).run(userId, actionFiltersJson);
  },

  remove(userId) {
    db.prepare('DELETE FROM user_report_preferences WHERE user_id = ?').run(userId);
  },
};

module.exports = userReportPreferencesRepository;
