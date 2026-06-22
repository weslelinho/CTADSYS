const userService = require('../services/userService');

const userController = {
  list(req, res, next) {
    try {
      const users = userService.listUsers();
      res.json({ users: users.map((user) => user.toJSON()) });
    } catch (err) {
      next(err);
    }
  },

  async create(req, res, next) {
    try {
      const user = await userService.createUser(req.body, req.user.id, req);
      res.status(201).json({ user: user.toJSON() });
    } catch (err) {
      next(err);
    }
  },

  async updatePassword(req, res, next) {
    try {
      const user = await userService.updatePassword(
        req.params.id,
        req.body.password,
        req.user.id,
        req
      );
      res.json({ user: user.toJSON() });
    } catch (err) {
      next(err);
    }
  },

  remove(req, res, next) {
    try {
      userService.deleteUser(req.params.id, req.user.id, req);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
