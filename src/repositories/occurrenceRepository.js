const { db } = require('../config/database');
const Occurrence = require('../models/Occurrence');

const occurrenceRepository = {
  findAll() {
    const rows = db
      .prepare(
        `SELECT o.*, c.full_name AS client_name
         FROM occurrences o
         JOIN clients c ON c.id = o.client_id
         ORDER BY o.occurred_at DESC`
      )
      .all();
    return rows.map((row) => new Occurrence(row));
  },

  findById(id) {
    const row = db
      .prepare(
        `SELECT o.*, c.full_name AS client_name
         FROM occurrences o
         JOIN clients c ON c.id = o.client_id
         WHERE o.id = ?`
      )
      .get(id);
    return row ? new Occurrence(row) : null;
  },

  create({ clientId, description, occurredAt, createdBy }) {
    const result = db
      .prepare(
        `INSERT INTO occurrences (client_id, description, occurred_at, created_by)
         VALUES (?, ?, ?, ?)`
      )
      .run(clientId, description, occurredAt, createdBy || null);

    return this.findById(result.lastInsertRowid);
  },

  update(id, { clientId, description, occurredAt }) {
    db.prepare(
      `UPDATE occurrences
       SET client_id = ?, description = ?, occurred_at = ?
       WHERE id = ?`
    ).run(clientId, description, occurredAt, id);

    return this.findById(id);
  },

  delete(id) {
    const result = db.prepare('DELETE FROM occurrences WHERE id = ?').run(id);
    return result.changes > 0;
  },
};

module.exports = occurrenceRepository;
