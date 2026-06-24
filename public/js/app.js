const MESSAGES = {
  login_required: 'Faça login para acessar o cadastro de clientes.',
  auth_failed: 'Usuário ou senha inválidos. Tente novamente.',
};

function showLoginCard({ scroll = true } = {}) {
  const loginCard = document.getElementById('login-card');
  if (!loginCard || !loginCard.hidden) return;

  loginCard.hidden = false;

  if (scroll) {
    requestAnimationFrame(() => {
      loginCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.getElementById('username')?.focus();
    });
  }
}

function hideLoginCard() {
  const loginCard = document.getElementById('login-card');
  if (!loginCard || loginCard.hidden) return;

  loginCard.hidden = true;
}

function toggleLoginCard() {
  const loginCard = document.getElementById('login-card');
  if (!loginCard) return;

  if (loginCard.hidden) {
    showLoginCard();
  } else {
    hideLoginCard();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const alertBox = document.getElementById('alert-box');
  const loginForm = document.getElementById('login-form');
  const loginBtn = document.getElementById('login-btn');

  const error = params.get('error');
  const login = params.get('login');

  document.querySelectorAll('.js-show-login').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      toggleLoginCard();
    });
  });

  if (error && MESSAGES[error]) {
    showAlert(alertBox, MESSAGES[error], 'error');
  } else if (login === 'required') {
    showAlert(alertBox, MESSAGES.login_required, 'info');
  }

  if (error || login || window.location.hash === '#login-card') {
    showLoginCard();
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
