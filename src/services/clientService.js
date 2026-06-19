const clientRepository = require('../repositories/clientRepository');
const photoService = require('./photoService');
const auditService = require('./auditService');

const clientService = {
  listClients() {
    return clientRepository.findAll();
  },

  getClient(id) {
    const client = clientRepository.findById(id);
    if (!client) {
      const error = new Error('Cliente não encontrado');
      error.status = 404;
      throw error;
    }
    return client;
  },

  createClient(data, userId, req) {
    if (!data.fullName || !data.fullName.trim()) {
      const error = new Error('Nome completo é obrigatório');
      error.status = 400;
      throw error;
    }

    if (data.cpf) {
      const existing = clientRepository.findByCpf(data.cpf);
      if (existing) {
        const error = new Error('CPF já cadastrado');
        error.status = 409;
        throw error;
      }
    }

    const client = clientRepository.create({ ...data, createdBy: userId });

    auditService.log({
      userId,
      action: auditService.ACTIONS.CLIENT_CREATE,
      entityType: 'client',
      entityId: client.id,
      newValues: client,
      req,
    });

    return client;
  },

  updateClient(id, data, userId, req) {
    const existing = this.getClient(id);

    if (data.cpf) {
      const duplicate = clientRepository.findByCpf(data.cpf);
      if (duplicate && duplicate.id !== Number(id)) {
        const error = new Error('CPF já cadastrado');
        error.status = 409;
        throw error;
      }
    }

    const client = clientRepository.update(id, data);

    auditService.log({
      userId,
      action: auditService.ACTIONS.CLIENT_UPDATE,
      entityType: 'client',
      entityId: client.id,
      oldValues: existing,
      newValues: client,
      req,
    });

    return client;
  },

  deleteClient(id, userId, req) {
    const existing = this.getClient(id);
    clientRepository.softDelete(id);

    auditService.log({
      userId,
      action: auditService.ACTIONS.CLIENT_DELETE,
      entityType: 'client',
      entityId: Number(id),
      oldValues: existing,
      req,
    });

    return true;
  },

  uploadPhoto(clientId, file, userId, req) {
    if (!file) {
      const error = new Error('Nenhuma imagem enviada');
      error.status = 400;
      throw error;
    }

    const existing = this.getClient(clientId);
    const client = photoService.saveClientPhoto(clientId, file);

    auditService.log({
      userId,
      action: auditService.ACTIONS.CLIENT_PHOTO_UPLOAD,
      entityType: 'client',
      entityId: client.id,
      oldValues: { photoPath: existing.photoPath },
      newValues: { photoPath: client.photoPath },
      req,
    });

    return client;
  },

  removePhoto(clientId, userId, req) {
    const existing = this.getClient(clientId);
    const client = photoService.removeClientPhoto(clientId);

    auditService.log({
      userId,
      action: auditService.ACTIONS.CLIENT_PHOTO_REMOVE,
      entityType: 'client',
      entityId: client.id,
      oldValues: { photoPath: existing.photoPath },
      newValues: { photoPath: client.photoPath },
      req,
    });

    return client;
  },
};

module.exports = clientService;
