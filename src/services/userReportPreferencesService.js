const auditService = require('./auditService');
const userReportPreferencesRepository = require('../repositories/userReportPreferencesRepository');

const ALLOWED_ACTIONS = new Set(Object.values(auditService.ACTIONS));

function parseStoredFilters(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((action) => typeof action === 'string' && ALLOWED_ACTIONS.has(action));
  } catch {
    return [];
  }
}

function normalizeActionFilters(actionFilters) {
  if (!Array.isArray(actionFilters)) {
    const error = new Error('actionFilters deve ser uma lista de tipos de ação');
    error.status = 400;
    throw error;
  }

  const unique = [];
  const seen = new Set();

  actionFilters.forEach((action) => {
    if (typeof action !== 'string' || !ALLOWED_ACTIONS.has(action) || seen.has(action)) {
      return;
    }
    seen.add(action);
    unique.push(action);
  });

  return unique;
}

const userReportPreferencesService = {
  getActionFilters(userId) {
    const row = userReportPreferencesRepository.findByUserId(userId);
    return parseStoredFilters(row?.action_filters);
  },

  saveActionFilters(userId, actionFilters) {
    const normalized = normalizeActionFilters(actionFilters);
    userReportPreferencesRepository.upsert(userId, JSON.stringify(normalized));
    return normalized;
  },

  clearActionFilters(userId) {
    userReportPreferencesRepository.remove(userId);
    return [];
  },
};

module.exports = userReportPreferencesService;
