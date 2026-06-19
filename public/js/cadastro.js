let clients = [];
let editingId = null;
let deletingId = null;

const form = document.getElementById('client-form');
const formTitle = document.getElementById('form-title');
const formAlert = document.getElementById('form-alert');
const submitBtn = document.getElementById('submit-btn');
const searchInput = document.getElementById('search-input');
const tbody = document.getElementById('clients-tbody');
const modal = document.getElementById('patient-modal');
const deleteModal = document.getElementById('delete-patient-modal');
const deleteConfirmMessage = document.getElementById('delete-confirm-message');
const deleteAlert = document.getElementById('delete-alert');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const newPatientBtn = document.getElementById('new-patient-btn');

document.addEventListener('DOMContentLoaded', async () => {
  await loadClients();

  form.addEventListener('submit', handleSubmit);
  searchInput.addEventListener('input', renderClients);
  tbody.addEventListener('click', handleTableClick);
  newPatientBtn.addEventListener('click', openNewPatientModal);
  confirmDeleteBtn.addEventListener('click', confirmDeletePatient);

  document.getElementById('cpf').addEventListener('input', formatCpf);
  document.getElementById('phone').addEventListener('input', formatPhone);

  modal.querySelectorAll('[data-close-patient-modal]').forEach((el) => {
    el.addEventListener('click', closeModal);
  });

  deleteModal.querySelectorAll('[data-close-delete-modal]').forEach((el) => {
    el.addEventListener('click', closeDeleteModal);
  });
});

async function loadClients() {
  try {
    const res = await fetch('/api/clients');
    if (!res.ok) throw new Error('Failed to load');
    const data = await res.json();
    clients = data.clients;
    renderClients();
  } catch {
    tbody.innerHTML = `
      <tr><td colspan="6">
        <div class="empty-state"><p>Erro ao carregar pacientes.</p></div>
      </td></tr>`;
  }
}

function renderClients() {
  const query = searchInput.value.toLowerCase().trim();
  const filtered = clients.filter((c) => {
    if (!query) return true;
    return (
      c.fullName.toLowerCase().includes(query) ||
      (c.cpf && c.cpf.includes(query)) ||
      (c.phone && c.phone.includes(query))
    );
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="6">
        <div class="empty-state">
          <div class="empty-state__icon">📋</div>
          <p>${query ? 'Nenhum paciente encontrado.' : 'Nenhum paciente cadastrado ainda.'}</p>
        </div>
      </td></tr>`;
    return;
  }

  tbody.innerHTML = filtered
    .map(
      (c) => `
    <tr>
      <td><strong>${Admin.escapeHtml(c.fullName)}</strong></td>
      <td>${Admin.escapeHtml(c.cpf || '—')}</td>
      <td>${Admin.escapeHtml(c.phone || '—')}</td>
      <td>${Admin.formatDate(c.admissionDate)}</td>
      <td><span class="status-badge status-badge--${c.status}">${capitalize(c.status)}</span></td>
      <td>
        <div class="table-actions">
          <button type="button" class="btn btn--outline btn--sm" data-action="edit" data-id="${c.id}">Editar</button>
          <button type="button" class="btn btn--danger btn--sm" data-action="delete" data-id="${c.id}">Excluir</button>
        </div>
      </td>
    </tr>`
    )
    .join('');
}

function fillPatientForm(client) {
  document.getElementById('client-id').value = client.id || '';
  document.getElementById('fullName').value = client.fullName || '';
  document.getElementById('cpf').value = client.cpf || '';
  document.getElementById('birthDate').value = client.birthDate || '';
  document.getElementById('phone').value = client.phone || '';
  document.getElementById('email').value = client.email || '';
  document.getElementById('address').value = client.address || '';
  document.getElementById('city').value = client.city || '';
  document.getElementById('state').value = client.state || '';
  document.getElementById('admissionDate').value = client.admissionDate || '';
  document.getElementById('status').value = client.status || 'ativo';
  document.getElementById('notes').value = client.notes || '';
}

function openModal() {
  modal.classList.add('modal--open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeModal() {
  modal.classList.remove('modal--open');
  modal.setAttribute('aria-hidden', 'true');
  if (!deleteModal.classList.contains('modal--open')) {
    document.body.classList.remove('modal-open');
  }
  resetForm();
}

function handleTableClick(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const id = Number(btn.dataset.id);
  if (btn.dataset.action === 'edit') editClient(id);
  if (btn.dataset.action === 'delete') openDeleteModal(id);
}

function openDeleteModal(id) {
  const client = clients.find((c) => c.id === id);
  if (!client) return;

  deletingId = id;
  deleteConfirmMessage.textContent = `Tem certeza que deseja excluir o paciente "${client.fullName}"?`;
  hideDeleteAlert();
  deleteModal.classList.add('modal--open');
  deleteModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeDeleteModal() {
  deleteModal.classList.remove('modal--open');
  deleteModal.setAttribute('aria-hidden', 'true');
  deletingId = null;
  hideDeleteAlert();
  if (!modal.classList.contains('modal--open')) {
    document.body.classList.remove('modal-open');
  }
}

function openNewPatientModal() {
  resetForm();
  formTitle.textContent = 'Novo Paciente';
  openModal();
}

async function editClient(id) {
  hideAlert();
  formTitle.textContent = 'Editar Paciente';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Carregando...';
  openModal();

  try {
    const res = await fetch(`/api/clients/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Paciente não encontrado');

    editingId = id;
    fillPatientForm(data.client);
  } catch (err) {
    closeModal();
    alert(err.message);
    return;
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Salvar';
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  hideAlert();

  const data = getFormData();
  if (!data.fullName.trim()) {
    showAlert('Nome completo é obrigatório.', 'error');
    return;
  }

  const isEditing = Boolean(editingId);
  submitBtn.disabled = true;
  submitBtn.textContent = 'Salvando...';

  try {
    const url = isEditing ? `/api/clients/${editingId}` : '/api/clients';
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erro ao salvar');

    if (isEditing) {
      const idx = clients.findIndex((c) => c.id === editingId);
      clients[idx] = result.client;
    } else {
      clients.unshift(result.client);
    }

    renderClients();
    closeModal();
  } catch (err) {
    showAlert(err.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Salvar';
  }
}

async function confirmDeletePatient() {
  if (!deletingId) return;

  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = 'Excluindo...';
  hideDeleteAlert();

  try {
    const res = await fetch(`/api/clients/${deletingId}`, { method: 'DELETE' });
    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.error || 'Erro ao excluir');
    }

    clients = clients.filter((c) => c.id !== deletingId);
    renderClients();
    if (editingId === deletingId) closeModal();
    closeDeleteModal();
  } catch (err) {
    showDeleteAlert(err.message, 'error');
  } finally {
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.textContent = 'Excluir paciente';
  }
}

function getFormData() {
  return {
    fullName: document.getElementById('fullName').value.trim(),
    cpf: document.getElementById('cpf').value.trim() || null,
    birthDate: document.getElementById('birthDate').value || null,
    phone: document.getElementById('phone').value.trim() || null,
    email: document.getElementById('email').value.trim() || null,
    address: document.getElementById('address').value.trim() || null,
    city: document.getElementById('city').value.trim() || null,
    state: document.getElementById('state').value.trim().toUpperCase() || null,
    admissionDate: document.getElementById('admissionDate').value || null,
    status: document.getElementById('status').value,
    notes: document.getElementById('notes').value.trim() || null,
  };
}

function resetForm() {
  editingId = null;
  form.reset();
  document.getElementById('client-id').value = '';
  formTitle.textContent = 'Novo Paciente';
  submitBtn.textContent = 'Salvar';
  hideAlert();
}

function showAlert(message, type) {
  formAlert.textContent = message;
  formAlert.className = `alert alert--visible alert--${type}`;
}

function hideAlert() {
  formAlert.className = 'alert';
}

function showDeleteAlert(message, type) {
  deleteAlert.textContent = message;
  deleteAlert.className = `alert alert--visible alert--${type}`;
}

function hideDeleteAlert() {
  deleteAlert.className = 'alert';
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatCpf(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  else if (v.length > 3) v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  e.target.value = v;
}

function formatPhone(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  else if (v.length > 6) v = v.replace(/(\d{2})(\d{4,5})(\d{0,4})/, '($1) $2-$3');
  else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  e.target.value = v;
}

