const { authConfig } = require('../config/auth');
const authService = require('../services/authService');

function authenticate(req, res, next) {
  const token =
    req.cookies[authConfig.jwt.cookieName] ||
    (req.headers.authorization && req.headers.authorization.replace('Bearer ', ''));

  if (!token) {
    return res.status(401).json({ error: 'Autenticação necessária' });
  }

  try {
    const user = authService.getUserFromToken(token);
    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Sessão inválida ou expirada' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso restrito a administradores' });
  }
  next();
}

function authenticatePage(req, res, next) {
  const token = req.cookies[authConfig.jwt.cookieName];

  if (!token) {
    return res.redirect('/?login=required');
  }

  try {
    const user = authService.getUserFromToken(token);
    if (!user) {
      res.clearCookie(authConfig.jwt.cookieName);
      return res.redirect('/?login=required');
    }
    req.user = user;
    next();
  } catch {
    res.clearCookie(authConfig.jwt.cookieName);
    return res.redirect('/?login=required');
  }
}

module.exports = { authenticate, requireAdmin, authenticatePage };
