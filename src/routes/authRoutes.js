const express = require('express');
const authController = require('../controllers/authController');
const reportPreferencesController = require('../controllers/reportPreferencesController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/logout', authController.logout);
router.get('/me', authenticate, authController.me);
router.get('/me/report-preferences', authenticate, reportPreferencesController.get);
router.put('/me/report-preferences', authenticate, reportPreferencesController.save);
router.delete('/me/report-preferences', authenticate, reportPreferencesController.clear);

module.exports = router;
