let occurrences = [];
let editingOccurrenceId = null;
let patientsForSelect = [];

const occurrenceForm = document.getElementById('occurrence-form');
const occurrenceFormTitle = document.getElementById('occurrence-form-title');
const occurrenceFormAlert = document.getElementById('occurrence-form-alert');
const occurrenceSubmitBtn = document.getElementById('occurrence-submit-btn');
const occurrenceSearchInput = document.getElementById('occurrence-search-input');
const occurrencesTbody = document.getElementById('occurrences-tbody');
const occurrenceModal = document.getElementById('occurrence-modal');
const newOccurrenceBtn = document.getElementById('new-occurrence-btn');
const occurrenceClientSelect = document.getElementById('occurrence-client');

document.addEventListener('DOMContentLoaded', () => {
  occurrenceForm.addEventListener('submit', handleOccurrenceSubmit);
  occurrenceSearchInput.addEventListener('input', renderOccurrences);
  newOccurrenceBtn.addEventListener('click', openNewOccurrenceModal);

  occurrenceModal.querySelectorAll('[data-close-occurrence-modal]').forEach((el) => {
    el.addEventListener('click', closeOccurrenceModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && occurrenceModal.classList.contains('modal--open')) {
      closeOccurrenceModal();
    }
  });
});

async function onPageShow() {
  await Promise.all([loadPatientsForSelect(), loadOccurrences()]);
}

async function loadPatientsForSelect() {
  try {
    const res = await fetch('/api/clients');
    if (!res.ok) throw new Error('Failed to load patients');
    const data = await res.json();
    patientsForSelect = data.clients;
    renderPatientOptions();
  } catch {
    occurrenceClientSelect.innerHTML = '<option value="">Erro ao carregar pacientes</option>';
  }
}

function renderPatientOptions(selectedId) {
  if (patientsForSelect.length === 0) {
    occurrenceClientSelect.innerHTML = '<option value="">Nenhum paciente cadastrado</option>';
    return;
  }

  const options = ['<option value="">Selecione um paciente</option>']
    .concat(
      patientsForSelect.map(
        (p) =>
          `<option value="${p.id}"${Number(selectedId) === p.id ? ' selected' : ''}>${Admin.escapeHtml(p.fullName)}</option>`
      )
    )
    .join('');

  occurrenceClientSelect.innerHTML = options;
}

async function loadOccurrences() {
  try {
    const res = await fetch('/api/occurrences');
    if (!res.ok) throw new Error('Failed to load');
    const data = await res.json();
    occurrences = data.occurrences;
    renderOccurrences();
  } catch {
    occurrencesTbody.innerHTML = `
      <tr><td colspan="4">
        <div class="empty-state"><p>Erro ao carregar ocorrências.</p></div>
      </td></tr>`;
  }
}

function renderOccurrences() {
  const query = occurrenceSearchInput.value.toLowerCase().trim();
  const filtered = occurrences.filter((o) => {
    if (!query) return true;
    return (
      o.clientName.toLowerCase().includes(query) ||
      o.description.toLowerCase().includes(query)
    );
  });

  if (filtered.length === 0) {
    occurrencesTbody.innerHTML = `
      <tr><td colspan="4">
        <div class="empty-state">
          <div class="empty-state__icon">📝</div>
          <p>${query ? 'Nenhuma ocorrência encontrada.' : 'Nenhuma ocorrência registrada ainda.'}</p>
        </div>
      </td></tr>`;
    return;
  }

  occurrencesTbody.innerHTML = filtered
    .map(
      (o) => `
    <tr>
      <td>${Admin.formatDateTime(o.occurredAt)}</td>
      <td><strong>${Admin.escapeHtml(o.clientName)}</strong></td>
      <td class="description-cell" title="${Admin.escapeHtml(o.description)}">${Admin.escapeHtml(truncateText(o.description, 80))}</td>
      <td>
        <div class="table-actions">
          <button class="btn btn--outline btn--sm" onclick="editOccurrence(${o.id})">Editar</button>
          <button class="btn btn--danger btn--sm" onclick="deleteOccurrence(${o.id})">Excluir</button>
        </div>
      </td>
    </tr>`
    )
    .join('');
}

function truncateText(text, max) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}...`;
}

function openOccurrenceModal() {
  occurrenceModal.classList.add('modal--open');
  occurrenceModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeOccurrenceModal() {
  occurrenceModal.classList.remove('modal--open');
  occurrenceModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  resetOccurrenceForm();
}

async function openNewOccurrenceModal() {
  await loadPatientsForSelect();
  resetOccurrenceForm();
  occurrenceFormTitle.textContent = 'Nova Ocorrência';
  occurrenceSubmitBtn.textContent = 'Salvar';
  document.getElementById('occurred-at').value = Admin.nowDatetimeLocalValue();
  openOccurrenceModal();
}

async function handleOccurrenceSubmit(e) {
  e.preventDefault();
  hideOccurrenceAlert();

  const data = getOccurrenceFormData();
  if (!data.clientId) {
    showOccurrenceAlert('Selecione um paciente.', 'error');
    return;
  }
  if (!data.description.trim()) {
    showOccurrenceAlert('Descrição é obrigatória.', 'error');
    return;
  }
  if (!data.occurredAt) {
    showOccurrenceAlert('Data e hora são obrigatórias.', 'error');
    return;
  }

  const isEditing = Boolean(editingOccurrenceId);
  occurrenceSubmitBtn.disabled = true;
  occurrenceSubmitBtn.textContent = 'Salvando...';

  try {
    const url = isEditing ? `/api/occurrences/${editingOccurrenceId}` : '/api/occurrences';
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Erro ao salvar');

    if (isEditing) {
      const idx = occurrences.findIndex((o) => o.id === editingOccurrenceId);
      occurrences[idx] = result.occurrence;
    } else {
      occurrences.unshift(result.occurrence);
    }

    renderOccurrences();
    closeOccurrenceModal();
  } catch (err) {
    showOccurrenceAlert(err.message, 'error');
  } finally {
    occurrenceSubmitBtn.disabled = false;
    occurrenceSubmitBtn.textContent = isEditing ? 'Atualizar' : 'Salvar';
  }
}

function getOccurrenceFormData() {
  return {
    clientId: Number(occurrenceClientSelect.value) || null,
    occurredAt: document.getElementById('occurred-at').value,
    description: document.getElementById('occurrence-description').value.trim(),
  };
}

async function editOccurrence(id) {
  const occurrence = occurrences.find((o) => o.id === id);
  if (!occurrence) return;

  await loadPatientsForSelect();

  editingOccurrenceId = id;
  occurrenceFormTitle.textContent = 'Editar Ocorrência';
  occurrenceSubmitBtn.textContent = 'Atualizar';

  renderPatientOptions(occurrence.clientId);
  document.getElementById('occurred-at').value = Admin.toDatetimeLocalValue(occurrence.occurredAt);
  document.getElementById('occurrence-description').value = occurrence.description;

  hideOccurrenceAlert();
  openOccurrenceModal();
}

async function deleteOccurrence(id) {
  const occurrence = occurrences.find((o) => o.id === id);
  if (!occurrence) return;

  if (!confirm(`Excluir a ocorrência do paciente "${occurrence.clientName}"?`)) return;

  try {
    const res = await fetch(`/api/occurrences/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const result = await res.json();
      throw new Error(result.error || 'Erro ao excluir');
    }
    occurrences = occurrences.filter((o) => o.id !== id);
    renderOccurrences();
    if (editingOccurrenceId === id) closeOccurrenceModal();
  } catch (err) {
    alert(err.message);
  }
}

function resetOccurrenceForm() {
  editingOccurrenceId = null;
  occurrenceForm.reset();
  occurrenceFormTitle.textContent = 'Nova Ocorrência';
  occurrenceSubmitBtn.textContent = 'Salvar';
  hideOccurrenceAlert();
  renderPatientOptions();
}

function showOccurrenceAlert(message, type) {
  occurrenceFormAlert.textContent = message;
  occurrenceFormAlert.className = `alert alert--visible alert--${type}`;
}

function hideOccurrenceAlert() {
  occurrenceFormAlert.className = 'alert';
}

window.Occurrences = { onPageShow };
window.editOccurrence = editOccurrence;
window.deleteOccurrence = deleteOccurrence;
