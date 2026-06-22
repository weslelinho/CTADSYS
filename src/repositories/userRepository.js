const { db } = require('../config/database');
const User = require('../models/User');

const userRepository = {
  findByUsername(username) {
    const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    return row ? new User(row) : null;
  },

  findByUsernameWithPassword(username) {
    return db
      .prepare('SELECT id, username, password_hash, name, email, role FROM users WHERE username = ?')
      .get(username);
  },

  findById(id) {
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return row ? new User(row) : null;
  },

  findAll() {
    const rows = db
      .prepare('SELECT id, username, name, email, role, created_at FROM users ORDER BY name ASC')
      .all();
    return rows.map((row) => new User(row));
  },

  create({ username, passwordHash, name, email, role }) {
    const result = db
      .prepare(
        `INSERT INTO users (username, password_hash, name, email, role)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(username, passwordHash, name, email || null, role || 'user');

    return this.findById(result.lastInsertRowid);
  },

  updatePassword(id, passwordHash) {
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, id);
    return this.findById(id);
  },

  countByRole(role) {
    return db.prepare('SELECT COUNT(*) AS total FROM users WHERE role = ?').get(role).total;
  },

  delete(id) {
    const deleteUser = db.transaction((userId) => {
      db.prepare('UPDATE audit_logs SET user_id = NULL WHERE user_id = ?').run(userId);
      db.prepare('UPDATE clients SET created_by = NULL WHERE created_by = ?').run(userId);
      db.prepare('UPDATE occurrences SET created_by = NULL WHERE created_by = ?').run(userId);
      db.prepare('DELETE FROM users WHERE id = ?').run(userId);
    });

    deleteUser(id);
  },
};

module.exports = userRepository;
