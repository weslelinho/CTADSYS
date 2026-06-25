const userReportPreferencesService = require('../services/userReportPreferencesService');

const reportPreferencesController = {
  get(req, res, next) {
    try {
      const actionFilters = userReportPreferencesService.getActionFilters(req.user.id);
      res.json({ actionFilters });
    } catch (err) {
      next(err);
    }
  },

  save(req, res, next) {
    try {
      const actionFilters = userReportPreferencesService.saveActionFilters(
        req.user.id,
        req.body.actionFilters
      );
      res.json({ actionFilters });
    } catch (err) {
      next(err);
    }
  },

  clear(req, res, next) {
    try {
      const actionFilters = userReportPreferencesService.clearActionFilters(req.user.id);
      res.json({ actionFilters });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = reportPreferencesController;
