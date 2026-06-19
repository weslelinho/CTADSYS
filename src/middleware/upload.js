const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const { clientsDir, ALLOWED_MIME_TYPES, MAX_FILE_SIZE } = require('../config/uploads');

const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, clientsDir);
  },
  filename(_req, file, cb) {
    const ext = MIME_TO_EXT[file.mimetype] || path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
    cb(null, uniqueName);
  },
});

function fileFilter(_req, file, cb) {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Use JPEG, PNG, GIF ou WebP.'));
  }
}

const uploadPhoto = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).single('photo');

function handleUpload(req, res, next) {
  uploadPhoto(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Arquivo muito grande. Máximo: 5 MB.' });
      }
      return res.status(400).json({ error: err.message });
    }

    return res.status(400).json({ error: err.message });
  });
}

module.exports = { handleUpload };
