const clientRepository = require('../repositories/clientRepository');
const occurrenceRepository = require('../repositories/occurrenceRepository');

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

  createOccurrence(data, userId) {
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

    return occurrenceRepository.create({
      clientId: data.clientId,
      description: data.description.trim(),
      occurredAt,
      createdBy: userId,
    });
  },

  updateOccurrence(id, data) {
    this.getOccurrence(id);

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

    const occurredAt = normalizeDateTime(data.occurredAt);
    if (!occurredAt) {
      const error = new Error('Data e hora são obrigatórias');
      error.status = 400;
      throw error;
    }

    return occurrenceRepository.update(id, {
      clientId: data.clientId,
      description: data.description.trim(),
      occurredAt,
    });
  },

  deleteOccurrence(id) {
    this.getOccurrence(id);
    return occurrenceRepository.delete(id);
  },
};

module.exports = occurrenceService;
