const AUDIT_PAGE_SIZE = 20;

const ACTION_LABELS = {
  'client.create': 'Paciente criado',
  'client.update': 'Paciente atualizado',
  'client.delete': 'Paciente excluído',
  'client.photo.upload': 'Foto do paciente enviada',
  'client.photo.remove': 'Foto do paciente removida',
  'occurrence.create': 'Ocorrência criada',
  'occurrence.update': 'Ocorrência atualizada',
  'occurrence.delete': 'Ocorrência excluída',
  'auth.login': 'Login realizado',
  'auth.login.failed': 'Tentativa de login falhou',
  'auth.logout': 'Logout realizado',
};

const ENTITY_LABELS = {
  client: 'Paciente',
  occurrence: 'Ocorrência',
  auth: 'Autenticação',
};

let auditLogs = [];
let auditTotal = 0;
let auditPage = 1;
let auditFilter = '';

const auditTbody = document.getElementById('audit-tbody');
const auditSearchInput = document.getElementById('audit-search-input');
const auditFilterSelect = document.getElementById('audit-filter-select');

document.addEventListener('DOMContentLoaded', () => {
  auditSearchInput.addEventListener('input', () => {
    auditFilter = auditSearchInput.value.trim().toLowerCase();
    auditPage = 1;
    renderAuditLogs();
  });

  auditFilterSelect.addEventListener('change', () => {
    auditPage = 1;
    loadAuditLogs();
  });

  document.addEventListener('click', handleAuditPaginationClick);
});

async function onPageShow() {
  await loadAuditLogs();
}

async function loadAuditLogs() {
  auditTbody.innerHTML = `
    <tr>
      <td colspan="5">
        <div class="empty-state">
          <div class="empty-state__icon">📋</div>
          <p>Carregando histórico...</p>
        </div>
      </td>
    </tr>
  `;

  const action = auditFilterSelect.value;
  const params = new URLSearchParams({
    limit: String(AUDIT_PAGE_SIZE),
    offset: String((auditPage - 1) * AUDIT_PAGE_SIZE),
  });

  if (action) params.set('action', action);

  try {
    const res = await fetch(`/api/audit-logs?${params}`);
    if (!res.ok) throw new Error('Failed to load audit logs');
    const data = await res.json();
    auditLogs = data.logs;
    auditTotal = data.total;
    renderAuditLogs();
  } catch {
    auditTbody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <div class="empty-state__icon">⚠️</div>
            <p>Erro ao carregar histórico.</p>
          </div>
        </td>
      </tr>
    `;
  }
}

function getFilteredLogs() {
  if (!auditFilter) return auditLogs;

  return auditLogs.filter((log) => {
    const haystack = [
      log.userName,
      log.userUsername,
      ACTION_LABELS[log.action] || log.action,
      ENTITY_LABELS[log.entityType] || log.entityType,
      log.entityId,
      summarizeValues(log.newValues),
      summarizeValues(log.oldValues),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(auditFilter);
  });
}

function summarizeValues(values) {
  if (!values) return '';
  if (typeof values === 'string') return values;
  if (values.fullName) return values.fullName;
  if (values.description) return values.description;
  if (values.username) return values.username;
  return JSON.stringify(values);
}

function renderAuditLogs() {
  const filtered = getFilteredLogs();

  if (filtered.length === 0) {
    auditTbody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <div class="empty-state__icon">📋</div>
            <p>${auditFilter ? 'Nenhum registro encontrado para a busca.' : 'Nenhuma transação registrada ainda.'}</p>
          </div>
        </td>
      </tr>
    `;
    renderAuditPagination(0);
    return;
  }

  auditTbody.innerHTML = filtered
    .map((log) => {
      const userLabel = log.userName
        ? `${Admin.escapeHtml(log.userName)} (${Admin.escapeHtml(log.userUsername || '')})`
        : '—';
      const actionLabel = Admin.escapeHtml(ACTION_LABELS[log.action] || log.action);
      const entityLabel = log.entityType
        ? `${Admin.escapeHtml(ENTITY_LABELS[log.entityType] || log.entityType)}${log.entityId ? ` #${log.entityId}` : ''}`
        : '—';
      const details = Admin.escapeHtml(buildDetails(log));

      return `
        <tr>
          <td>${Admin.formatDateTime(log.createdAt)}</td>
          <td>${userLabel}</td>
          <td>${actionLabel}</td>
          <td>${entityLabel}</td>
          <td class="audit-details">${details || '—'}</td>
        </tr>
      `;
    })
    .join('');

  renderAuditPagination(auditTotal);
}

function buildDetails(log) {
  if (log.action === 'auth.login.failed') {
    return log.newValues?.username ? `Usuário: ${log.newValues.username}` : '';
  }

  if (log.action === 'auth.login' || log.action === 'auth.logout') {
    return log.newValues?.username ? `Usuário: ${log.newValues.username}` : '';
  }

  if (log.action === 'client.delete') {
    return log.oldValues?.fullName ? log.oldValues.fullName : '';
  }

  if (log.action === 'occurrence.delete') {
    const parts = [];
    if (log.oldValues?.clientName) parts.push(log.oldValues.clientName);
    if (log.oldValues?.description) parts.push(log.oldValues.description);
    return parts.join(' — ');
  }

  if (log.action.startsWith('client.photo')) {
    return log.newValues?.photoPath || log.oldValues?.photoPath || '';
  }

  if (log.action.startsWith('client.')) {
    return log.newValues?.fullName || log.oldValues?.fullName || '';
  }

  if (log.action.startsWith('occurrence.')) {
    const parts = [];
    if (log.newValues?.clientName || log.oldValues?.clientName) {
      parts.push(log.newValues?.clientName || log.oldValues?.clientName);
    }
    if (log.newValues?.description || log.oldValues?.description) {
      parts.push(log.newValues?.description || log.oldValues?.description);
    }
    return parts.join(' — ');
  }

  return '';
}

function renderAuditPagination(total) {
  const container = document.getElementById('audit-pagination');
  if (!container) return;

  const totalPages = Math.ceil(total / AUDIT_PAGE_SIZE);
  if (total === 0 || totalPages <= 1) {
    container.hidden = true;
    container.innerHTML = '';
    return;
  }

  const start = (auditPage - 1) * AUDIT_PAGE_SIZE + 1;
  const end = Math.min(auditPage * AUDIT_PAGE_SIZE, total);

  container.hidden = false;
  container.innerHTML = `
    <div class="pagination">
      <p class="pagination__info">Mostrando ${start}–${end} de ${total} registro${total === 1 ? '' : 's'}</p>
      <div class="pagination__controls">
        <button type="button" class="btn btn--outline btn--sm" data-audit-page="prev" ${auditPage <= 1 ? 'disabled' : ''}>Anterior</button>
        <span class="pagination__pages">${renderAuditPageButtons(totalPages)}</span>
        <button type="button" class="btn btn--outline btn--sm" data-audit-page="next" ${auditPage >= totalPages ? 'disabled' : ''}>Próxima</button>
      </div>
    </div>
  `;
}

function renderAuditPageButtons(totalPages) {
  const pages = [];
  const addPage = (page) => {
    const isActive = page === auditPage;
    pages.push(
      `<button type="button" class="pagination__page${isActive ? ' pagination__page--active' : ''}" data-audit-page="${page}"${isActive ? ' aria-current="page"' : ''}>${page}</button>`
    );
  };

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) addPage(i);
    return pages.join('');
  }

  addPage(1);
  if (auditPage > 3) pages.push('<span class="pagination__ellipsis">…</span>');

  const rangeStart = Math.max(2, auditPage - 1);
  const rangeEnd = Math.min(totalPages - 1, auditPage + 1);
  for (let i = rangeStart; i <= rangeEnd; i++) addPage(i);

  if (auditPage < totalPages - 2) pages.push('<span class="pagination__ellipsis">…</span>');
  addPage(totalPages);
  return pages.join('');
}

function handleAuditPaginationClick(e) {
  const btn = e.target.closest('[data-audit-page]');
  if (!btn || btn.disabled || !btn.closest('#audit-pagination')) return;

  const action = btn.dataset.auditPage;
  if (action === 'prev') auditPage -= 1;
  else if (action === 'next') auditPage += 1;
  else auditPage = Number(action);

  loadAuditLogs();
}

window.AuditHistory = { onPageShow };
