const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', userController.list);
router.post('/', requireAdmin, userController.create);
router.patch('/:id/password', requireAdmin, userController.updatePassword);
router.delete('/:id', requireAdmin, userController.remove);

module.exports = router;
