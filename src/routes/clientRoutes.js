const express = require('express');
const clientController = require('../controllers/clientController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.get('/', clientController.list);
router.get('/:id', clientController.get);
router.post('/', clientController.create);
router.put('/:id', clientController.update);
router.delete('/:id', clientController.remove);

module.exports = router;
