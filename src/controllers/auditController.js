const auditService = require('../services/auditService');

const auditController = {
  list(req, res, next) {
    try {
      const { logs, total } = auditService.listLogs(req.query);
      res.json({
        logs: logs.map((log) => log.toJSON()),
        total,
        limit: Math.min(Math.max(Number(req.query.limit) || 50, 1), 200),
        offset: Math.max(Number(req.query.offset) || 0, 0),
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = auditController;
