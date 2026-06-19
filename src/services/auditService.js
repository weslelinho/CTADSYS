const auditLogRepository = require('../repositories/auditLogRepository');

const ACTIONS = {
  CLIENT_CREATE: 'client.create',
  CLIENT_UPDATE: 'client.update',
  CLIENT_DELETE: 'client.delete',
  CLIENT_PHOTO_UPLOAD: 'client.photo.upload',
  CLIENT_PHOTO_REMOVE: 'client.photo.remove',
  OCCURRENCE_CREATE: 'occurrence.create',
  OCCURRENCE_UPDATE: 'occurrence.update',
  OCCURRENCE_DELETE: 'occurrence.delete',
  AUTH_LOGIN: 'auth.login',
  AUTH_LOGIN_FAILED: 'auth.login.failed',
  AUTH_LOGOUT: 'auth.logout',
};

function serialize(value) {
  if (value == null) return null;
  if (typeof value.toJSON === 'function') return JSON.stringify(value.toJSON());
  return JSON.stringify(value);
}

function getRequestMeta(req) {
  if (!req) return {};
  const forwarded = req.headers?.['x-forwarded-for'];
  const ip = forwarded ? String(forwarded).split(',')[0].trim() : req.ip;
  return {
    ipAddress: ip || null,
    userAgent: req.headers?.['user-agent'] || null,
  };
}

const auditService = {
  ACTIONS,

  log({ userId, action, entityType, entityId, oldValues, newValues, req }) {
    const meta = getRequestMeta(req);
    return auditLogRepository.create({
      userId,
      action,
      entityType,
      entityId,
      oldValues: serialize(oldValues),
      newValues: serialize(newValues),
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    });
  },

  listLogs(filters = {}) {
    const limit = Math.min(Math.max(Number(filters.limit) || 50, 1), 200);
    const offset = Math.max(Number(filters.offset) || 0, 0);

    return auditLogRepository.findAll({
      entityType: filters.entityType || null,
      entityId: filters.entityId ? Number(filters.entityId) : null,
      userId: filters.userId ? Number(filters.userId) : null,
      action: filters.action || null,
      limit,
      offset,
    });
  },
};

module.exports = auditService;
