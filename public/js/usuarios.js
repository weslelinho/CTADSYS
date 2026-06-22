let users = [];
let searchFilter = '';
let passwordUserId = null;
let deleteUserId = null;

const usersTbody = document.getElementById('users-tbody');
const userSearchInput = document.getElementById('user-search-input');
const newUserBtn = document.getElementById('new-user-btn');
const userModal = document.getElementById('user-modal');
const userForm = document.getElementById('user-form');
const userFormAlert = document.getElementById('user-form-alert');
const userSubmitBtn = document.getElementById('user-submit-btn');
const userPasswordModal = document.getElementById('user-password-modal');
const userPasswordForm = document.getElementById('user-password-form');
const userPasswordAlert = document.getElementById('user-password-alert');
const userPasswordTarget = document.getElementById('user-password-target');
const userPasswordSubmitBtn = document.getElementById('user-password-submit-btn');
const deleteUserModal = document.getElementById('delete-user-modal');
const deleteUserAlert = document.getElementById('delete-user-alert');
const deleteUserConfirmMessage = document.getElementById('delete-user-confirm-message');
const confirmDeleteUserBtn = document.getElementById('confirm-delete-user-btn');

document.addEventListener('DOMContentLoaded', () => {
  if (!usersTbody) return;

  userSearchInput.addEventListener('input', () => {
    searchFilter = userSearchInput.value.trim().toLowerCase();
    renderUsers();
  });

  newUserBtn.addEventListener('click', openUserModal);
  userForm.addEventListener('submit', handleUserSubmit);
  userPasswordForm.addEventListener('submit', handlePasswordSubmit);
  confirmDeleteUserBtn.addEventListener('click', confirmDeleteUser);
  usersTbody.addEventListener('click', handleUsersTableClick);

  userModal.querySelectorAll('[data-close-user-modal]').forEach((el) => {
    el.addEventListener('click', closeUserModal);
  });

  userPasswordModal.querySelectorAll('[data-close-user-password-modal]').forEach((el) => {
    el.addEventListener('click', closePasswordModal);
  });

  deleteUserModal.querySelectorAll('[data-close-delete-user-modal]').forEach((el) => {
    el.addEventListener('click', closeDeleteUserModal);
  });
});

function roleLabel(role) {
  return role === 'admin' ? 'Administrador' : 'Usuário';
}

function showAlert(alertEl, message, type = 'error') {
  alertEl.textContent = message;
  alertEl.className = `alert alert--${type}`;
  alertEl.hidden = false;
}

function hideAlert(alertEl) {
  alertEl.hidden = true;
  alertEl.textContent = '';
  alertEl.className = 'alert';
}

function getFilteredUsers() {
  if (!searchFilter) return users;

  return users.filter((user) => {
    const haystack = [user.name, user.username, user.email, roleLabel(user.role)]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.indexOf(searchFilter) !== -1;
  });
}

function renderUsers() {
  const filtered = getFilteredUsers();

  if (filtered.length === 0) {
    usersTbody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            <div class="empty-state__icon">🔐</div>
            <p>${searchFilter ? 'Nenhum usuário encontrado.' : 'Nenhum usuário cadastrado.'}</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  usersTbody.innerHTML = filtered
    .map((user) => {
      const email = user.email ? Admin.escapeHtml(user.email) : '—';
      const createdAt = Admin.formatDateTime(user.createdAt);

      return `
        <tr>
          <td>${Admin.escapeHtml(user.name)}</td>
          <td>${Admin.escapeHtml(user.username)}</td>
          <td>${email}</td>
          <td>${Admin.escapeHtml(roleLabel(user.role))}</td>
          <td>${createdAt}</td>
          <td>
            <div class="table-actions">
              <button type="button" class="btn btn--outline btn--sm" data-action="password" data-id="${user.id}">Alterar senha</button>
              <button type="button" class="btn btn--danger btn--sm" data-action="delete" data-id="${user.id}">Excluir</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

async function onPageShow() {
  if (!Admin.isAdmin()) {
    Admin.navigateToPage('pacientes');
    return;
  }

  await loadUsers();
}

async function loadUsers() {
  usersTbody.innerHTML = `
    <tr>
      <td colspan="6">
        <div class="empty-state">
          <div class="empty-state__icon">🔐</div>
          <p>Carregando usuários...</p>
        </div>
      </td>
    </tr>
  `;

  try {
    const res = await fetch('/api/users');
    if (res.status === 401) {
      window.location.href = '/?login=required';
      return;
    }
    if (res.status === 403) {
      Admin.navigateToPage('pacientes');
      return;
    }
    if (!res.ok) throw new Error('request failed');

    const data = await res.json();
    users = Array.isArray(data.users) ? data.users : [];
    renderUsers();
  } catch {
    usersTbody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            <div class="empty-state__icon">⚠️</div>
            <p>Erro ao carregar usuários. Verifique se o servidor está em execução.</p>
          </div>
        </td>
      </tr>
    `;
  }
}

function openUserModal() {
  userForm.reset();
  hideAlert(userFormAlert);
  userModal.classList.add('modal--open');
  userModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  document.getElementById('user-name-input').focus();
}

function closeUserModal() {
  userModal.classList.remove('modal--open');
  userModal.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.modal.modal--open')) {
    document.body.classList.remove('modal-open');
  }
}

function openPasswordModal(user) {
  passwordUserId = user.id;
  userPasswordForm.reset();
  hideAlert(userPasswordAlert);
  userPasswordTarget.textContent = `Alterar senha de ${user.name} (${user.username})`;
  userPasswordModal.classList.add('modal--open');
  userPasswordModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  document.getElementById('user-new-password-input').focus();
}

function closePasswordModal() {
  passwordUserId = null;
  userPasswordModal.classList.remove('modal--open');
  userPasswordModal.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.modal.modal--open')) {
    document.body.classList.remove('modal-open');
  }
}

function openDeleteUserModal(user) {
  deleteUserId = user.id;
  hideAlert(deleteUserAlert);
  deleteUserConfirmMessage.textContent = `Tem certeza que deseja excluir o usuário ${user.name} (${user.username})?`;
  deleteUserModal.classList.add('modal--open');
  deleteUserModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeDeleteUserModal() {
  deleteUserId = null;
  deleteUserModal.classList.remove('modal--open');
  deleteUserModal.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.modal.modal--open')) {
    document.body.classList.remove('modal-open');
  }
}

function handleUsersTableClick(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const user = users.find((item) => item.id === Number(btn.dataset.id));
  if (!user) return;

  if (btn.dataset.action === 'password') openPasswordModal(user);
  if (btn.dataset.action === 'delete') openDeleteUserModal(user);
}

async function handleUserSubmit(e) {
  e.preventDefault();
  hideAlert(userFormAlert);

  const payload = {
    name: document.getElementById('user-name-input').value.trim(),
    username: document.getElementById('user-username-input').value.trim(),
    email: document.getElementById('user-email-input').value.trim(),
    password: document.getElementById('user-password-input').value,
    role: document.getElementById('user-role-input').value,
  };

  userSubmitBtn.disabled = true;

  try {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      window.location.href = '/?login=required';
      return;
    }
    if (!res.ok) {
      showAlert(userFormAlert, data.error || 'Erro ao criar usuário.');
      return;
    }

    closeUserModal();
    await loadUsers();
  } catch {
    showAlert(userFormAlert, 'Erro ao criar usuário. Tente novamente.');
  } finally {
    userSubmitBtn.disabled = false;
  }
}

async function handlePasswordSubmit(e) {
  e.preventDefault();
  hideAlert(userPasswordAlert);

  const password = document.getElementById('user-new-password-input').value;
  const confirmPassword = document.getElementById('user-confirm-password-input').value;

  if (password !== confirmPassword) {
    showAlert(userPasswordAlert, 'As senhas não coincidem.');
    return;
  }

  userPasswordSubmitBtn.disabled = true;

  try {
    const res = await fetch(`/api/users/${passwordUserId}/password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      window.location.href = '/?login=required';
      return;
    }
    if (!res.ok) {
      showAlert(userPasswordAlert, data.error || 'Erro ao alterar senha.');
      return;
    }

    closePasswordModal();
  } catch {
    showAlert(userPasswordAlert, 'Erro ao alterar senha. Tente novamente.');
  } finally {
    userPasswordSubmitBtn.disabled = false;
  }
}

async function confirmDeleteUser() {
  hideAlert(deleteUserAlert);
  confirmDeleteUserBtn.disabled = true;

  try {
    const res = await fetch(`/api/users/${deleteUserId}`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      window.location.href = '/?login=required';
      return;
    }
    if (!res.ok) {
      showAlert(deleteUserAlert, data.error || 'Erro ao excluir usuário.');
      return;
    }

    closeDeleteUserModal();
    await loadUsers();
  } catch {
    showAlert(deleteUserAlert, 'Erro ao excluir usuário. Tente novamente.');
  } finally {
    confirmDeleteUserBtn.disabled = false;
  }
}

window.Users = {
  onPageShow,
};
