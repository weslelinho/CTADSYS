const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authConfig } = require('../config/auth');
const userRepository = require('../repositories/userRepository');
const auditService = require('./auditService');

const authService = {
  async login(username, password, req) {
    if (!username || !password) {
      const error = new Error('Usuário e senha são obrigatórios');
      error.status = 400;
      throw error;
    }

    const row = userRepository.findByUsernameWithPassword(username.trim());
    if (!row) {
      auditService.log({
        userId: null,
        action: auditService.ACTIONS.AUTH_LOGIN_FAILED,
        entityType: 'auth',
        newValues: { username: username.trim() },
        req,
      });

      const error = new Error('Usuário ou senha inválidos');
      error.status = 401;
      throw error;
    }

    const valid = await bcrypt.compare(password, row.password_hash);
    if (!valid) {
      auditService.log({
        userId: row.id,
        action: auditService.ACTIONS.AUTH_LOGIN_FAILED,
        entityType: 'auth',
        newValues: { username: username.trim() },
        req,
      });

      const error = new Error('Usuário ou senha inválidos');
      error.status = 401;
      throw error;
    }

    const user = userRepository.findById(row.id);
    const token = this.generateToken(user);

    auditService.log({
      userId: user.id,
      action: auditService.ACTIONS.AUTH_LOGIN,
      entityType: 'auth',
      entityId: user.id,
      newValues: { username: user.username },
      req,
    });

    return { user, token };
  },

  logLogout(userId, req) {
    auditService.log({
      userId,
      action: auditService.ACTIONS.AUTH_LOGOUT,
      entityType: 'auth',
      entityId: userId,
      req,
    });
  },

  async hashPassword(password) {
    return bcrypt.hash(password, 10);
  },

  generateToken(user) {
    return jwt.sign(
      { sub: user.id, username: user.username, role: user.role },
      authConfig.jwt.secret,
      { expiresIn: authConfig.jwt.expiresIn }
    );
  },

  verifyToken(token) {
    return jwt.verify(token, authConfig.jwt.secret);
  },

  getUserFromToken(token) {
    const decoded = this.verifyToken(token);
    return userRepository.findById(decoded.sub);
  },
};

module.exports = authService;
