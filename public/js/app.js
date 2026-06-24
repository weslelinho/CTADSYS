const MESSAGES = {
  login_required: 'Faça login para acessar o cadastro de clientes.',
  auth_failed: 'Usuário ou senha inválidos. Tente novamente.',
};

function phoneToTelHref(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) return 'tel:';
  return digits.startsWith('55') ? `tel:+${digits}` : `tel:+55${digits}`;
}

function applyPageContent(content) {
  if (!content || typeof content !== 'object') return;

  document.querySelectorAll('[data-content]').forEach((el) => {
    const key = el.dataset.content;
    if (content[key] == null) return;
    el.textContent = content[key];
  });

  document.querySelectorAll('[data-content-meta]').forEach((el) => {
    const key = el.dataset.contentMeta;
    if (content[key] != null) {
      el.setAttribute('content', content[key]);
    }
  });

  document.querySelectorAll('[data-content-title]').forEach((el) => {
    const key = el.dataset.contentTitle;
    if (content[key] != null) {
      el.textContent = content[key];
    }
  });

  document.querySelectorAll('[data-content-href-mail]').forEach((el) => {
    const key = el.dataset.contentHrefMail;
    if (content[key] != null) {
      el.href = `mailto:${content[key]}`;
    }
  });

  document.querySelectorAll('[data-content-href-tel]').forEach((el) => {
    const key = el.dataset.contentHrefTel;
    if (content[key] != null) {
      el.href = phoneToTelHref(content[key]);
    }
  });
}

async function loadPageContent() {
  try {
    const res = await fetch('/api/page-content');
    if (!res.ok) return;
    const data = await res.json();
    applyPageContent(data.content);
  } catch {
    // Keep static fallback content
  }
}

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
  loadPageContent();

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
