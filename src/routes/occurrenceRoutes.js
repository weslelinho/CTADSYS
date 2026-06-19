const express = require('express');
const occurrenceController = require('../controllers/occurrenceController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', occurrenceController.list);
router.get('/:id', occurrenceController.get);
router.post('/', occurrenceController.create);
router.put('/:id', occurrenceController.update);
router.delete('/:id', occurrenceController.remove);

module.exports = router;
