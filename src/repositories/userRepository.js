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

  create({ username, passwordHash, name, email, role }) {
    const result = db
      .prepare(
        `INSERT INTO users (username, password_hash, name, email, role)
         VALUES (?, ?, ?, ?, ?)`
      )
      .run(username, passwordHash, name, email || null, role || 'user');

    return this.findById(result.lastInsertRowid);
  },
};

module.exports = userRepository;
