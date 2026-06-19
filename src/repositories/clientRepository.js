const { db } = require('../config/database');
const Client = require('../models/Client');

const clientRepository = {
  findAll() {
    const rows = db
      .prepare('SELECT * FROM clients WHERE hidden = 0 ORDER BY created_at DESC')
      .all();
    return rows.map((row) => new Client(row));
  },

  findById(id) {
    const row = db
      .prepare('SELECT * FROM clients WHERE id = ? AND hidden = 0')
      .get(id);
    return row ? new Client(row) : null;
  },

  findByCpf(cpf) {
    const row = db
      .prepare('SELECT * FROM clients WHERE cpf = ? AND hidden = 0')
      .get(cpf);
    return row ? new Client(row) : null;
  },

  create(data) {
    const result = db
      .prepare(
        `INSERT INTO clients (
          full_name, cpf, birth_date, phone, email, address, city, state,
          admission_date, status, notes, created_by, hidden
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
      )
      .run(
        data.fullName,
        data.cpf || null,
        data.birthDate || null,
        data.phone || null,
        data.email || null,
        data.address || null,
        data.city || null,
        data.state || null,
        data.admissionDate || null,
        data.status || 'ativo',
        data.notes || null,
        data.createdBy || null
      );

    return this.findById(result.lastInsertRowid);
  },

  update(id, data) {
    db.prepare(
      `UPDATE clients SET
        full_name = ?, cpf = ?, birth_date = ?, phone = ?, email = ?,
        address = ?, city = ?, state = ?, admission_date = ?, status = ?,
        notes = ?, updated_at = datetime('now')
       WHERE id = ? AND hidden = 0`
    ).run(
      data.fullName,
      data.cpf || null,
      data.birthDate || null,
      data.phone || null,
      data.email || null,
      data.address || null,
      data.city || null,
      data.state || null,
      data.admissionDate || null,
      data.status || 'ativo',
      data.notes || null,
      id
    );

    return this.findById(id);
  },

  softDelete(id) {
    const result = db
      .prepare(
        `UPDATE clients SET hidden = 1, updated_at = datetime('now') WHERE id = ? AND hidden = 0`
      )
      .run(id);
    return result.changes > 0;
  },
};

module.exports = clientRepository;
