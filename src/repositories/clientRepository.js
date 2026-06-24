const { db } = require('../config/database');
const Client = require('../models/Client');

function normalizeTrabalha(value) {
  if (value === undefined || value === null || value === '') return null;
  return value ? 1 : 0;
}

function normalizeNumeroFilhos(value) {
  if (value === undefined || value === null || value === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

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

  exists(id) {
    const row = db.prepare('SELECT id FROM clients WHERE id = ?').get(id);
    return Boolean(row);
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
          admission_date, data_saida, status, notes, created_by, hidden,
          rg, orgao_expedidor, data_emissao, titulo_eleitor, profissao,
          escolaridade, estado_civil, filiacao_pai, filiacao_mae,
          naturalidade, sexo, trabalha, numero_filhos
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
        data.exitDate || null,
        data.status || 'ativo',
        data.notes || null,
        data.createdBy || null,
        data.rg || null,
        data.orgaoExpedidor || null,
        data.dataEmissao || null,
        data.tituloEleitor || null,
        data.profissao || null,
        data.escolaridade || null,
        data.estadoCivil || null,
        data.filiacaoPai || null,
        data.filiacaoMae || null,
        data.naturalidade || null,
        data.sexo || null,
        normalizeTrabalha(data.trabalha),
        normalizeNumeroFilhos(data.numeroFilhos)
      );

    return this.findById(result.lastInsertRowid);
  },

  update(id, data) {
    db.prepare(
      `UPDATE clients SET
        full_name = ?, cpf = ?, birth_date = ?, phone = ?, email = ?,
        address = ?, city = ?, state = ?, admission_date = ?, data_saida = ?, status = ?,
        notes = ?, rg = ?, orgao_expedidor = ?, data_emissao = ?,
        titulo_eleitor = ?, profissao = ?, escolaridade = ?, estado_civil = ?,
        filiacao_pai = ?, filiacao_mae = ?, naturalidade = ?, sexo = ?,
        trabalha = ?, numero_filhos = ?, updated_at = datetime('now')
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
      data.exitDate || null,
      data.status || 'ativo',
      data.notes || null,
      data.rg || null,
      data.orgaoExpedidor || null,
      data.dataEmissao || null,
      data.tituloEleitor || null,
      data.profissao || null,
      data.escolaridade || null,
      data.estadoCivil || null,
      data.filiacaoPai || null,
      data.filiacaoMae || null,
      data.naturalidade || null,
      data.sexo || null,
      normalizeTrabalha(data.trabalha),
      normalizeNumeroFilhos(data.numeroFilhos),
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

  updatePhotoPath(id, photoPath) {
    db.prepare(
      `UPDATE clients SET photo_path = ?, updated_at = datetime('now') WHERE id = ? AND hidden = 0`
    ).run(photoPath, id);
    return this.findById(id);
  },
};

module.exports = clientRepository;
