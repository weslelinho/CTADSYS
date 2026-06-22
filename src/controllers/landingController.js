const path = require('path');

const landingController = {
  home(req, res) {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  },

  registerPage(req, res) {
    res.set('Cache-Control', 'no-store');
    res.sendFile(path.join(__dirname, '../../public/cadastro.html'));
  },
};

module.exports = landingController;
