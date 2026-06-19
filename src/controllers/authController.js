const { authConfig } = require('../config/auth');
const authService = require('../services/authService');

const authController = {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const { user, token } = await authService.login(username, password, req);

      res.cookie(authConfig.jwt.cookieName, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ user: user.toJSON() });
    } catch (err) {
      next(err);
    }
  },

  logout(req, res) {
    const token =
      req.cookies[authConfig.jwt.cookieName] ||
      (req.headers.authorization && req.headers.authorization.replace('Bearer ', ''));

    if (token) {
      try {
        const user = authService.getUserFromToken(token);
        if (user) {
          authService.logLogout(user.id, req);
        }
      } catch {
        // Token invalid or expired — skip audit log
      }
    }

    res.clearCookie(authConfig.jwt.cookieName);
    if (req.path.startsWith('/api') || req.headers.accept?.includes('application/json')) {
      return res.json({ message: 'Logout realizado' });
    }
    res.redirect('/');
  },

  me(req, res) {
    res.json({ user: req.user.toJSON() });
  },
};

module.exports = authController;
