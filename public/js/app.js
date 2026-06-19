const MESSAGES = {
  login_required: 'Faça login para acessar o cadastro de clientes.',
  auth_failed: 'Usuário ou senha inválidos. Tente novamente.',
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const alertBox = document.getElementById('alert-box');
  const loginForm = document.getElementById('login-form');
  const loginBtn = document.getElementById('login-btn');

  const error = params.get('error');
  const login = params.get('login');

  if (error && MESSAGES[error]) {
    showAlert(alertBox, MESSAGES[error], 'error');
  } else if (login === 'required') {
    showAlert(alertBox, MESSAGES.login_required, 'info');
  }

  if (error || login) {
    document.getElementById('login-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.history.replaceState({}, '', '/');
  }

  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert(alertBox);

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
      showAlert(alertBox, 'Informe usuário e senha.', 'error');
      return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = 'Entrando...';

    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Falha no login');

      window.location.href = '/cadastro';
    } catch (err) {
      showAlert(alertBox, err.message, 'error');
    } finally {
      loginBtn.disabled = false;
      loginBtn.textContent = 'Entrar';
    }
  });
});

function showAlert(el, message, type) {
  el.textContent = message;
  el.className = `alert alert--visible alert--${type}`;
}

function hideAlert(el) {
  el.className = 'alert';
}
