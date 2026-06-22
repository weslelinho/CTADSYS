const { db } = require('../config/database');
const AuditLog = require('../models/AuditLog');

const auditLogRepository = {
  create(data) {
    const result = db
      .prepare(
        `INSERT INTO audit_logs (
          user_id, action, entity_type, entity_id,
          old_values, new_values, ip_address, user_agent
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        data.userId ?? null,
        data.action,
        data.entityType ?? null,
        data.entityId ?? null,
        data.oldValues ?? null,
        data.newValues ?? null,
        data.ipAddress ?? null,
        data.userAgent ?? null
      );

    return this.findById(result.lastInsertRowid);
  },

  findById(id) {
    const row = db
      .prepare(
        `SELECT a.*, u.name AS user_name, u.username AS user_username
         FROM audit_logs a
         LEFT JOIN users u ON u.id = a.user_id
         WHERE a.id = ?`
      )
      .get(id);
    return row ? new AuditLog(row) : null;
  },

  findAll({
    entityType,
    entityId,
    userId,
    clientId,
    action,
    dateFrom,
    dateTo,
    limit = 50,
    offset = 0,
  } = {}) {
    const conditions = [];
    const params = [];

    if (entityType) {
      conditions.push('a.entity_type = ?');
      params.push(entityType);
    }
    if (entityId) {
      conditions.push('a.entity_id = ?');
      params.push(entityId);
    }
    if (userId) {
      conditions.push('a.user_id = ?');
      params.push(userId);
    }
    if (clientId) {
      conditions.push(`(
        (a.entity_type = 'client' AND a.entity_id = ?)
        OR (
          a.entity_type = 'occurrence' AND (
            CAST(json_extract(a.new_values, '$.clientId') AS INTEGER) = ?
            OR CAST(json_extract(a.old_values, '$.clientId') AS INTEGER) = ?
          )
        )
      )`);
      params.push(clientId, clientId, clientId);
    }
    if (action) {
      conditions.push('a.action = ?');
      params.push(action);
    }
    if (dateFrom) {
      conditions.push('a.created_at >= ?');
      params.push(`${dateFrom} 00:00:00`);
    }
    if (dateTo) {
      conditions.push('a.created_at <= ?');
      params.push(`${dateTo} 23:59:59`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const rows = db
      .prepare(
        `SELECT a.*, u.name AS user_name, u.username AS user_username
         FROM audit_logs a
         LEFT JOIN users u ON u.id = a.user_id
         ${where}
         ORDER BY a.created_at DESC
         LIMIT ? OFFSET ?`
      )
      .all(...params, limit, offset);

    const countRow = db
      .prepare(`SELECT COUNT(*) AS total FROM audit_logs a ${where}`)
      .get(...params);

    return {
      logs: rows.map((row) => new AuditLog(row)),
      total: countRow.total,
    };
  },
};

module.exports = auditLogRepository;
