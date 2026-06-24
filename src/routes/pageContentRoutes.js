const express = require('express');
const pageContentController = require('../controllers/pageContentController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', pageContentController.getPublic);

router.get('/admin', authenticate, requireAdmin, pageContentController.listAdmin);
router.put('/', authenticate, requireAdmin, pageContentController.update);

module.exports = router;
