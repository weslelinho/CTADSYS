const express = require('express');
const clientController = require('../controllers/clientController');
const { authenticate } = require('../middleware/auth');
const { handleUpload } = require('../middleware/upload');

const router = express.Router();

router.use(authenticate);

router.get('/', clientController.list);
router.post('/:id/photo', handleUpload, clientController.uploadPhoto);
router.delete('/:id/photo', clientController.removePhoto);
router.get('/:id', clientController.get);
router.post('/', clientController.create);
router.put('/:id', clientController.update);
router.delete('/:id', clientController.remove);

module.exports = router;
