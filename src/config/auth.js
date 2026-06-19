require('dotenv').config();

const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret_change_me',
    expiresIn: '7d',
    cookieName: 'ctad_token',
  },
  defaultAdmin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    name: process.env.ADMIN_NAME || 'Administrador',
  },
};

function validateAuthConfig() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'ctad_jwt_secret_key_change_in_production') {
    console.warn('⚠️  Use um JWT_SECRET forte em produção.');
  }
}

module.exports = { authConfig, validateAuthConfig };
