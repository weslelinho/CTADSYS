const OCCURRENCES_PAGE_SIZE = 10;

let occurrences = [];
let occurrencesPage = 1;
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
  occurrenceSearchInput.addEventListener('input', () => {
    occurrencesPage = 1;
    renderOccurrences();
  });
  document.addEventListener('click', handleOccurrencesPaginationClick);
  occurrencesTbody.addEventListener('click', handleOccurrenceTableClick);
  newOccurrenceBtn.addEventListener('click', openNewOccurrenceModal);

  occurrenceModal.querySelectorAll('[data-close-occurrence-modal]').forEach((el) => {
    el.addEventListener('click', closeOccurrenceModal);
  });
});

function handleOccurrenceTableClick(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const id = Number(btn.dataset.id);
  if (btn.dataset.action === 'edit') editOccurrence(id);
  if (btn.dataset.action === 'delete') deleteOccurrence(id);
}

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

function renderPatientOptions(selectedId, extraPatient) {
  let list = [...patientsForSelect];

  if (extraPatient && !list.some((p) => p.id === extraPatient.id)) {
    list.unshift(extraPatient);
  }

  if (list.length === 0) {
    occurrenceClientSelect.innerHTML = '<option value="">Nenhum paciente cadastrado</option>';
    return;
  }

  const options = ['<option value="">Selecione um paciente</option>']
    .concat(
      list.map(
        (p) =>
          `<option value="${p.id}"${Number(selectedId) === p.id ? ' selected' : ''}>${Admin.escapeHtml(p.fullName)}</option>`
      )
    )
    .join('');

  occurrenceClientSelect.innerHTML = options;
}

function fillOccurrenceForm(occurrence) {
  renderPatientOptions(occurrence.clientId, {
    id: occurrence.clientId,
    fullName: occurrence.clientName,
  });
  document.getElementById('occurred-at').value = Admin.toDatetimeLocalValue(occurrence.occurredAt);
  document.getElementById('occurrence-description').value = occurrence.description || '';
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
    renderOccurrencesPagination(0, 0);
  }
}

function getFilteredOccurrences() {
  const query = occurrenceSearchInput.value.toLowerCase().trim();
  return occurrences.filter((o) => {
    if (!query) return true;
    return (
      o.clientName.toLowerCase().includes(query) ||
      o.description.toLowerCase().includes(query)
    );
  });
}

function renderOccurrences() {
  const query = occurrenceSearchInput.value.toLowerCase().trim();
  const filtered = getFilteredOccurrences();
  const totalPages = Math.max(1, Math.ceil(filtered.length / OCCURRENCES_PAGE_SIZE));

  if (occurrencesPage > totalPages) {
    occurrencesPage = totalPages;
  }

  if (filtered.length === 0) {
    occurrencesTbody.innerHTML = `
      <tr><td colspan="4">
        <div class="empty-state">
          <div class="empty-state__icon">📝</div>
          <p>${query ? 'Nenhuma ocorrência encontrada.' : 'Nenhuma ocorrência registrada ainda.'}</p>
        </div>
      </td></tr>`;
    renderOccurrencesPagination(0, 0);
    return;
  }

  const start = (occurrencesPage - 1) * OCCURRENCES_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + OCCURRENCES_PAGE_SIZE);

  occurrencesTbody.innerHTML = pageItems
    .map(
      (o) => `
    <tr>
      <td>${Admin.formatDateTime(o.occurredAt)}</td>
      <td><strong>${Admin.escapeHtml(o.clientName)}</strong></td>
      <td class="description-cell" title="${Admin.escapeHtml(o.description)}">${Admin.escapeHtml(truncateText(o.description, 80))}</td>
      <td>
        <div class="table-actions">
          <button type="button" class="btn btn--outline btn--sm" data-action="edit" data-id="${o.id}">Editar</button>
          <button type="button" class="btn btn--danger btn--sm" data-action="delete" data-id="${o.id}">Excluir</button>
        </div>
      </td>
    </tr>`
    )
    .join('');

  renderOccurrencesPagination(filtered.length, totalPages);
}

function getOccurrencesPaginationEl() {
  let el = document.getElementById('occurrences-pagination');
  if (el || !occurrencesTbody) return el;

  const card = occurrencesTbody.closest('.card');
  if (!card) return null;

  el = document.createElement('div');
  el.id = 'occurrences-pagination';
  el.className = 'pagination-bar';
  el.hidden = true;
  card.appendChild(el);
  return el;
}

function renderOccurrencesPagination(totalItems, totalPages) {
  const occurrencesPaginationEl = getOccurrencesPaginationEl();
  if (!occurrencesPaginationEl) return;

  if (totalItems === 0) {
    occurrencesPaginationEl.hidden = true;
    occurrencesPaginationEl.innerHTML = '';
    return;
  }

  occurrencesPaginationEl.hidden = false;
  const start = (occurrencesPage - 1) * OCCURRENCES_PAGE_SIZE + 1;
  const end = Math.min(occurrencesPage * OCCURRENCES_PAGE_SIZE, totalItems);

  occurrencesPaginationEl.innerHTML = `
    <div class="pagination">
      <p class="pagination__info">Mostrando ${start}–${end} de ${totalItems} ocorrência${totalItems === 1 ? '' : 's'}</p>
      ${
        totalPages > 1
          ? `<div class="pagination__controls">
        <button type="button" class="btn btn--outline btn--sm" data-occurrences-page="prev" ${occurrencesPage === 1 ? 'disabled' : ''}>Anterior</button>
        <span class="pagination__pages">${renderOccurrencesPageButtons(totalPages)}</span>
        <button type="button" class="btn btn--outline btn--sm" data-occurrences-page="next" ${occurrencesPage === totalPages ? 'disabled' : ''}>Próxima</button>
      </div>`
          : ''
      }
    </div>`;
}

function renderOccurrencesPageButtons(totalPages) {
  const pages = [];
  const addPage = (page) => {
    const isActive = page === occurrencesPage;
    pages.push(
      `<button type="button" class="pagination__page${isActive ? ' pagination__page--active' : ''}" data-occurrences-page="${page}"${isActive ? ' aria-current="page"' : ''}>${page}</button>`
    );
  };
  const addEllipsis = () => {
    pages.push('<span class="pagination__ellipsis">…</span>');
  };

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) addPage(i);
    return pages.join('');
  }

  addPage(1);

  if (occurrencesPage > 3) addEllipsis();

  const rangeStart = Math.max(2, occurrencesPage - 1);
  const rangeEnd = Math.min(totalPages - 1, occurrencesPage + 1);

  for (let i = rangeStart; i <= rangeEnd; i++) addPage(i);

  if (occurrencesPage < totalPages - 2) addEllipsis();

  addPage(totalPages);
  return pages.join('');
}

function handleOccurrencesPaginationClick(e) {
  const btn = e.target.closest('[data-occurrences-page]');
  if (!btn || btn.disabled || !btn.closest('#occurrences-pagination')) return;

  const action = btn.dataset.occurrencesPage;
  if (action === 'prev') occurrencesPage -= 1;
  else if (action === 'next') occurrencesPage += 1;
  else occurrencesPage = Number(action);

  renderOccurrences();
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
  if (!document.querySelector('.modal.modal--open')) {
    document.body.classList.remove('modal-open');
  }
  resetOccurrenceForm();
}

async function openNewOccurrenceModal() {
  await loadPatientsForSelect();
  resetOccurrenceForm();
  occurrenceFormTitle.textContent = 'Nova Ocorrência';
  document.getElementById('occurred-at').value = Admin.nowDatetimeLocalValue();
  openOccurrenceModal();
}

async function editOccurrence(id) {
  hideOccurrenceAlert();
  occurrenceFormTitle.textContent = 'Editar Ocorrência';
  occurrenceSubmitBtn.disabled = true;
  occurrenceSubmitBtn.textContent = 'Carregando...';
  openOccurrenceModal();

  try {
    await loadPatientsForSelect();

    const res = await fetch(`/api/occurrences/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Ocorrência não encontrada');

    editingOccurrenceId = id;
    fillOccurrenceForm(data.occurrence);
  } catch (err) {
    closeOccurrenceModal();
    alert(err.message);
    return;
  } finally {
    occurrenceSubmitBtn.disabled = false;
    occurrenceSubmitBtn.textContent = 'Salvar';
  }
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
      occurrencesPage = 1;
    }

    renderOccurrences();
    closeOccurrenceModal();
  } catch (err) {
    showOccurrenceAlert(err.message, 'error');
  } finally {
    occurrenceSubmitBtn.disabled = false;
    occurrenceSubmitBtn.textContent = 'Salvar';
  }
}

function getOccurrenceFormData() {
  return {
    clientId: Number(occurrenceClientSelect.value) || null,
    occurredAt: document.getElementById('occurred-at').value,
    description: document.getElementById('occurrence-description').value.trim(),
  };
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
