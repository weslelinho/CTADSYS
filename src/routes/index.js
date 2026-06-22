const express = require('express');
const authRoutes = require('./authRoutes');
const clientRoutes = require('./clientRoutes');
const occurrenceRoutes = require('./occurrenceRoutes');
const auditRoutes = require('./auditRoutes');
const userRoutes = require('./userRoutes');
const landingController = require('../controllers/landingController');
const { authenticatePage } = require('../middleware/auth');

const router = express.Router();

router.get('/', landingController.home);
router.get('/cadastro', authenticatePage, landingController.registerPage);

router.use('/auth', authRoutes);
router.use('/api/clients', clientRoutes);
router.use('/api/occurrences', occurrenceRoutes);
router.use('/api/audit-logs', auditRoutes);
router.use('/api/users', userRoutes);

module.exports = router;
