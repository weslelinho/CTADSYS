const pageContentService = require('../services/pageContentService');

const pageContentController = {
  getPublic(req, res, next) {
    try {
      const content = pageContentService.getPublicContent();
      res.json({ content });
    } catch (err) {
      next(err);
    }
  },

  listAdmin(req, res, next) {
    try {
      const items = pageContentService.listForAdmin();
      res.json({ items: items.map((item) => item.toJSON()) });
    } catch (err) {
      next(err);
    }
  },

  update(req, res, next) {
    try {
      const updates = Array.isArray(req.body.items) ? req.body.items : [req.body];
      const items = pageContentService.updateContents(updates, req.user.id, req);
      res.json({ items: items.map((item) => item.toJSON()) });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = pageContentController;
