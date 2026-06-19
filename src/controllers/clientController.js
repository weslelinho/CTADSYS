const clientService = require('../services/clientService');

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
      const client = clientService.createClient(req.body, req.user.id);
      res.status(201).json({ client: client.toJSON() });
    } catch (err) {
      next(err);
    }
  },

  update(req, res, next) {
    try {
      const client = clientService.updateClient(req.params.id, req.body);
      res.json({ client: client.toJSON() });
    } catch (err) {
      next(err);
    }
  },

  remove(req, res, next) {
    try {
      clientService.deleteClient(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = clientController;
