function notFound(req, res) {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Rota não encontrada' });
  }
  return res.status(404).sendFile('404.html', { root: './public' });
}

function errorHandler(err, req, res, _next) {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';

  if (req.path.startsWith('/api')) {
    return res.status(status).json({ error: message });
  }

  return res.status(status).send(message);
}

module.exports = { notFound, errorHandler };
