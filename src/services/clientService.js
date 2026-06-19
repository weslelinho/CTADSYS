const clientRepository = require('../repositories/clientRepository');
const photoService = require('./photoService');

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

  createClient(data, userId) {
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

    return clientRepository.create({ ...data, createdBy: userId });
  },

  updateClient(id, data) {
    this.getClient(id);

    if (data.cpf) {
      const existing = clientRepository.findByCpf(data.cpf);
      if (existing && existing.id !== Number(id)) {
        const error = new Error('CPF já cadastrado');
        error.status = 409;
        throw error;
      }
    }

    return clientRepository.update(id, data);
  },

  deleteClient(id) {
    this.getClient(id);
    return clientRepository.softDelete(id);
  },

  uploadPhoto(clientId, file) {
    if (!file) {
      const error = new Error('Nenhuma imagem enviada');
      error.status = 400;
      throw error;
    }
    return photoService.saveClientPhoto(clientId, file);
  },

  removePhoto(clientId) {
    return photoService.removeClientPhoto(clientId);
  },
};

module.exports = clientService;
