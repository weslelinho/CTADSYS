const fs = require('fs');
const path = require('path');
const { uploadsRoot } = require('../config/uploads');
const clientRepository = require('../repositories/clientRepository');

const photoService = {
  getAbsolutePath(relativePath) {
    if (!relativePath) return null;
    const normalized = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
    return path.join(uploadsRoot, normalized);
  },

  deleteFile(relativePath) {
    if (!relativePath) return;
    const absolutePath = this.getAbsolutePath(relativePath);
    if (absolutePath && fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  },

  saveClientPhoto(clientId, file) {
    const client = clientRepository.findById(clientId);
    if (!client) {
      const error = new Error('Cliente não encontrado');
      error.status = 404;
      throw error;
    }

    const relativePath = path.join('clients', file.filename).replace(/\\/g, '/');

    if (client.photoPath) {
      this.deleteFile(client.photoPath);
    }

    clientRepository.updatePhotoPath(clientId, relativePath);
    return clientRepository.findById(clientId);
  },

  removeClientPhoto(clientId) {
    const client = clientRepository.findById(clientId);
    if (!client) {
      const error = new Error('Cliente não encontrado');
      error.status = 404;
      throw error;
    }

    if (client.photoPath) {
      this.deleteFile(client.photoPath);
      clientRepository.updatePhotoPath(clientId, null);
    }

    return clientRepository.findById(clientId);
  },
};

module.exports = photoService;
