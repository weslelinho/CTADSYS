const pageContentRepository = require('../repositories/pageContentRepository');
const auditService = require('./auditService');

function validationError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

const pageContentService = {
  getPublicContent() {
    const items = pageContentRepository.findAll();
    const content = {};
    items.forEach((item) => {
      content[item.key] = item.content;
    });
    return content;
  },

  listForAdmin() {
    return pageContentRepository.findAll();
  },

  updateContents(updates, actorId, req) {
    if (!Array.isArray(updates) || updates.length === 0) {
      throw validationError('Nenhum conteúdo informado para atualização');
    }

    const normalized = [];
    const oldValues = {};

    updates.forEach((item) => {
      const key = String(item.key || '').trim();
      if (!key) {
        throw validationError('Chave de conteúdo inválida');
      }

      const existing = pageContentRepository.findByKey(key);
      if (!existing) {
        throw validationError(`Conteúdo "${key}" não encontrado`, 404);
      }

      const content = item.content == null ? '' : String(item.content);
      oldValues[key] = existing.content;
      normalized.push({ key, content });
    });

    const updated = pageContentRepository.updateMany(normalized, actorId);

    auditService.log({
      userId: actorId,
      action: auditService.ACTIONS.PAGE_CONTENT_UPDATE,
      entityType: 'page_content',
      entityId: null,
      oldValues,
      newValues: Object.fromEntries(normalized.map((item) => [item.key, item.content])),
      req,
    });

    return updated;
  },
};

module.exports = pageContentService;
