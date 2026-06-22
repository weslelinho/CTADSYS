const userRepository = require('../repositories/userRepository');

const userController = {
  list(req, res, next) {
    try {
      const users = userRepository.findAll();
      res.json({ users: users.map((user) => user.toJSON()) });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
