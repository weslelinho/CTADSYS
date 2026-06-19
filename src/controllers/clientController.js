const clientService = require('../services/clientService');
const photoService = require('../services/photoService');

const clientController = {
  list(req, res, next) {
    try {
      const clients = clientService.listClients();
      res.json({ clients: clients.map((c) => c.toJSON()) });
    } catch (err) {
      next(err);
    }
  },

  get(req, res, next) {
    try {
      const client = clientService.getClient(req.params.id);
      res.json({ client: client.toJSON() });
    } catch (err) {
      next(err);
    }
  },

  create(req, res, next) {
    try {
      const client = clientService.createClient(req.body, req.user.id, req);
      res.status(201).json({ client: client.toJSON() });
    } catch (err) {
      next(err);
    }
  },

  update(req, res, next) {
    try {
      const client = clientService.updateClient(req.params.id, req.body, req.user.id, req);
      res.json({ client: client.toJSON() });
    } catch (err) {
      next(err);
    }
  },

  remove(req, res, next) {
    try {
      clientService.deleteClient(req.params.id, req.user.id, req);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  uploadPhoto(req, res, next) {
    try {
      const client = clientService.uploadPhoto(req.params.id, req.file, req.user.id, req);
      res.json({ client: client.toJSON() });
    } catch (err) {
      if (req.file) {
        photoService.deleteFile(`clients/${req.file.filename}`);
      }
      next(err);
    }
  },

  removePhoto(req, res, next) {
    try {
      const client = clientService.removePhoto(req.params.id, req.user.id, req);
      res.json({ client: client.toJSON() });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = clientController;
