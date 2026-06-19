const occurrenceService = require('../services/occurrenceService');

const occurrenceController = {
  list(req, res, next) {
    try {
      const occurrences = occurrenceService.listOccurrences();
      res.json({ occurrences: occurrences.map((o) => o.toJSON()) });
    } catch (err) {
      next(err);
    }
  },

  get(req, res, next) {
    try {
      const occurrence = occurrenceService.getOccurrence(req.params.id);
      res.json({ occurrence: occurrence.toJSON() });
    } catch (err) {
      next(err);
    }
  },

  create(req, res, next) {
    try {
      const occurrence = occurrenceService.createOccurrence(req.body, req.user.id);
      res.status(201).json({ occurrence: occurrence.toJSON() });
    } catch (err) {
      next(err);
    }
  },

  update(req, res, next) {
    try {
      const occurrence = occurrenceService.updateOccurrence(req.params.id, req.body);
      res.json({ occurrence: occurrence.toJSON() });
    } catch (err) {
      next(err);
    }
  },

  remove(req, res, next) {
    try {
      occurrenceService.deleteOccurrence(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};

module.exports = occurrenceController;
