const userRepository = require('../repositories/userRepository');
const authService = require('./authService');
const auditService = require('./auditService');

const USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;
const MIN_PASSWORD_LENGTH = 6;

function validationError(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function normalizeUsername(username) {
  return String(username || '').trim();
}

function validateUsername(username) {
  if (!username) {
    throw validationError('Usuário (login) é obrigatório');
  }
  if (username.length < 3) {
    throw validationError('Usuário deve ter pelo menos 3 caracteres');
  }
  if (!USERNAME_PATTERN.test(username)) {
    throw validationError('Usuário deve conter apenas letras, números, ponto, hífen ou sublinhado');
  }
}

function validatePassword(password, fieldLabel = 'Senha') {
  if (!password) {
    throw validationError(`${fieldLabel} é obrigatória`);
  }
  if (String(password).length < MIN_PASSWORD_LENGTH) {
    throw validationError(`${fieldLabel} deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres`);
  }
}

function getUserOrThrow(id) {
  const user = userRepository.findById(id);
  if (!user) {
    throw validationError('Usuário não encontrado', 404);
  }
  return user;
}

const userService = {
  listUsers() {
    return userRepository.findAll();
  },

  async createUser(data, actorId, req) {
    const username = normalizeUsername(data.username);
    const name = String(data.name || '').trim();
    const email = data.email ? String(data.email).trim() : null;
    const role = data.role === 'admin' ? 'admin' : 'user';

    validateUsername(username);
    validatePassword(data.password);

    if (!name) {
      throw validationError('Nome é obrigatório');
    }

    if (userRepository.findByUsername(username)) {
      throw validationError('Usuário (login) já cadastrado', 409);
    }

    const passwordHash = await authService.hashPassword(data.password);
    const user = userRepository.create({ username, passwordHash, name, email, role });

    auditService.log({
      userId: actorId,
      action: auditService.ACTIONS.USER_CREATE,
      entityType: 'user',
      entityId: user.id,
      newValues: user,
      req,
    });

    return user;
  },

  async updatePassword(id, password, actorId, req) {
    const user = getUserOrThrow(id);
    validatePassword(password, 'Nova senha');

    const passwordHash = await authService.hashPassword(password);
    const updated = userRepository.updatePassword(id, passwordHash);

    auditService.log({
      userId: actorId,
      action: auditService.ACTIONS.USER_PASSWORD_UPDATE,
      entityType: 'user',
      entityId: user.id,
      oldValues: { username: user.username },
      newValues: { username: updated.username },
      req,
    });

    return updated;
  },

  deleteUser(id, actorId, req) {
    const user = getUserOrThrow(id);

    if (Number(id) === Number(actorId)) {
      throw validationError('Você não pode excluir sua própria conta');
    }

    if (user.role === 'admin' && userRepository.countByRole('admin') <= 1) {
      throw validationError('Não é possível excluir o último administrador');
    }

    userRepository.delete(id);

    auditService.log({
      userId: actorId,
      action: auditService.ACTIONS.USER_DELETE,
      entityType: 'user',
      entityId: user.id,
      oldValues: user,
      req,
    });
  },
};

module.exports = userService;
