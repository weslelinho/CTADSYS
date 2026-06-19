const clientRepository = require('../repositories/clientRepository');
const occurrenceRepository = require('../repositories/occurrenceRepository');
const auditService = require('./auditService');

function normalizeDateTime(value) {
  if (!value) return null;
  return value.replace('T', ' ').slice(0, 19);
}

const occurrenceService = {
  listOccurrences() {
    return occurrenceRepository.findAll();
  },

  getOccurrence(id) {
    const occurrence = occurrenceRepository.findById(id);
    if (!occurrence) {
      const error = new Error('Ocorrência não encontrada');
      error.status = 404;
      throw error;
    }
    return occurrence;
  },

  createOccurrence(data, userId, req) {
    if (!data.clientId) {
      const error = new Error('Paciente é obrigatório');
      error.status = 400;
      throw error;
    }

    if (!data.description || !data.description.trim()) {
      const error = new Error('Descrição é obrigatória');
      error.status = 400;
      throw error;
    }

    const client = clientRepository.findById(data.clientId);
    if (!client) {
      const error = new Error('Paciente não encontrado');
      error.status = 404;
      throw error;
    }

    const occurredAt = normalizeDateTime(data.occurredAt) || new Date().toISOString().slice(0, 19).replace('T', ' ');

    const occurrence = occurrenceRepository.create({
      clientId: data.clientId,
      description: data.description.trim(),
      occurredAt,
      createdBy: userId,
    });

    auditService.log({
      userId,
      action: auditService.ACTIONS.OCCURRENCE_CREATE,
      entityType: 'occurrence',
      entityId: occurrence.id,
      newValues: occurrence,
      req,
    });

    return occurrence;
  },

  updateOccurrence(id, data, userId, req) {
    const existing = this.getOccurrence(id);

    if (!data.clientId) {
      const error = new Error('Paciente é obrigatório');
      error.status = 400;
      throw error;
    }

    if (!data.description || !data.description.trim()) {
      const error = new Error('Descrição é obrigatória');
      error.status = 400;
      throw error;
    }

    const clientId = Number(data.clientId);
    const client = clientRepository.findById(clientId);
    const isSameClient = clientId === Number(existing.clientId);

    if (!client && !(isSameClient && clientRepository.exists(clientId))) {
      const error = new Error('Paciente não encontrado');
      error.status = 404;
      throw error;
    }

    const occurredAt = normalizeDateTime(data.occurredAt);
    if (!occurredAt) {
      const error = new Error('Data e hora são obrigatórias');
      error.status = 400;
      throw error;
    }

    const occurrence = occurrenceRepository.update(id, {
      clientId,
      description: data.description.trim(),
      occurredAt,
    });

    auditService.log({
      userId,
      action: auditService.ACTIONS.OCCURRENCE_UPDATE,
      entityType: 'occurrence',
      entityId: occurrence.id,
      oldValues: existing,
      newValues: occurrence,
      req,
    });

    return occurrence;
  },

  deleteOccurrence(id, userId, req) {
    const existing = this.getOccurrence(id);
    occurrenceRepository.delete(id);

    auditService.log({
      userId,
      action: auditService.ACTIONS.OCCURRENCE_DELETE,
      entityType: 'occurrence',
      entityId: Number(id),
      oldValues: existing,
      req,
    });

    return true;
  },
};

module.exports = occurrenceService;
