require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { initializeDatabaseAsync } = require('./src/config/database');
const { validateAuthConfig } = require('./src/config/auth');
const { ensureUploadDirs, uploadsRoot } = require('./src/config/uploads');
const { authenticate } = require('./src/middleware/auth');
const routes = require('./src/routes');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

validateAuthConfig();
ensureUploadDirs();

initializeDatabaseAsync().then(() => {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
          mediaSrc: ["'self'", 'blob:'],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'"],
        },
      },
    })
  );
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(
    express.static(path.join(__dirname, 'public'), {
      setHeaders(res, filePath) {
        if (filePath.endsWith('.html') || filePath.endsWith('.js')) {
          res.setHeader('Cache-Control', 'no-store');
        }
      },
    })
  );
  app.use('/uploads', authenticate, express.static(uploadsRoot));

  app.use(routes);

  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`🏥 CTAD Sys running at http://localhost:${PORT}`);
  });
});

module.exports = app;
