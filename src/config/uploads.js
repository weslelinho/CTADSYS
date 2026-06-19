const path = require('path');
const fs = require('fs');

const uploadsRoot = process.env.UPLOADS_PATH || path.join(__dirname, '../../uploads');
const clientsDir = path.join(uploadsRoot, 'clients');

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function ensureUploadDirs() {
  fs.mkdirSync(clientsDir, { recursive: true });
}

module.exports = {
  uploadsRoot,
  clientsDir,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  ensureUploadDirs,
};
