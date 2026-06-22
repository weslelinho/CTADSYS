const PAGE_CONFIG = {
  pacientes: { title: 'Pacientes' },
  ocorrencias: { title: 'Ocorrências' },
  relatorios: { title: 'Relatórios' },
  usuarios: { title: 'Usuários' },
};

let currentPage = 'pacientes';
let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
  await loadUser();
  initNavigation();
});

async function loadUser() {
  try {
    const res = await fetch('/auth/me');
    if (!res.ok) throw new Error('Unauthorized');
    const { user } = await res.json();
    currentUser = user;
    document.getElementById('user-name').textContent = `${user.name} (${user.username})`;

    const navUsuarios = document.getElementById('nav-usuarios');
    if (navUsuarios) {
      navUsuarios.hidden = !isAdmin();
    }
  } catch {
    window.location.href = '/?login=required';
  }
}

function initNavigation() {
  document.querySelectorAll('.sidebar__link[data-page]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateToPage(link.dataset.page);
    });
  });
}

function isAdmin() {
  return currentUser && currentUser.role === 'admin';
}

function navigateToPage(page) {
  if (!PAGE_CONFIG[page]) return;

  if (page === 'usuarios' && !isAdmin()) {
    return;
  }

  const targetSection = document.getElementById(`page-${page}`);
  if (!targetSection) {
    window.location.reload();
    return;
  }

  currentPage = page;

  document.querySelectorAll('.sidebar__link[data-page]').forEach((link) => {
    link.classList.toggle('sidebar__link--active', link.dataset.page === page);
  });

  document.querySelectorAll('.admin-page').forEach((section) => {
    section.hidden = section.id !== `page-${page}`;
  });

  document.getElementById('page-title').textContent = PAGE_CONFIG[page].title;

  if (page === 'ocorrencias' && window.Occurrences && window.Occurrences.onPageShow) {
    window.Occurrences.onPageShow();
  }

  if (page === 'relatorios') {
    Reports.onPageShow();
  }

  if (page === 'usuarios' && window.Users && window.Users.onPageShow) {
    window.Users.onPageShow();
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return '—';
  const normalized = dateTimeStr.replace(' ', 'T');
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return dateTimeStr;
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function toDatetimeLocalValue(dateTimeStr) {
  if (!dateTimeStr) return '';
  return dateTimeStr.replace(' ', 'T').slice(0, 16);
}

function nowDatetimeLocalValue() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

function getOpenModals() {
  return Array.from(document.querySelectorAll('.modal.modal--open'));
}

function closeTopModal() {
  const openModals = getOpenModals();
  if (openModals.length === 0) return;

  const topModal = openModals[openModals.length - 1];
  const closeBtn = topModal.querySelector(
    '[data-close-patient-modal], [data-close-delete-modal], [data-close-occurrence-modal], [data-close-user-modal], [data-close-user-password-modal], [data-close-delete-user-modal]'
  );
  if (closeBtn) closeBtn.click();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeTopModal();
});

window.Admin = {
  escapeHtml,
  formatDate,
  formatDateTime,
  toDatetimeLocalValue,
  nowDatetimeLocalValue,
  navigateToPage,
  getCurrentUser: () => currentUser,
  isAdmin,
};

const Reports = (function createReportsModule() {
  const REPORT_PAGE_SIZE = 20;

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
    'user.create': 'Usuário criado',
    'user.password.update': 'Senha de usuário alterada',
    'user.delete': 'Usuário excluído',
  };

  const ENTITY_LABELS = {
    client: 'Paciente',
    occurrence: 'Ocorrência',
    auth: 'Autenticação',
    user: 'Usuário',
  };

  let reportLogs = [];
  let reportTotal = 0;
  let reportPage = 1;
  let searchFilter = '';
  let filtersLoaded = false;
  let reportInitialized = false;

  let reportTbody;
  let clientSelect;
  let userSelect;
  let dateFromInput;
  let dateToInput;
  let actionCheckboxes;
  let reportSearchInput;
  let clearBtn;
  let generateBtn;

  function bindElements() {
    reportTbody = document.getElementById('report-tbody');
    clientSelect = document.getElementById('report-client-select');
    userSelect = document.getElementById('report-user-select');
    dateFromInput = document.getElementById('report-date-from');
    dateToInput = document.getElementById('report-date-to');
    actionCheckboxes = document.getElementById('report-action-checkboxes');
    reportSearchInput = document.getElementById('report-search-input');
    clearBtn = document.getElementById('report-clear-btn');
    generateBtn = document.getElementById('report-generate-btn');
  }

  function getSelectedActions() {
    if (!actionCheckboxes) return [];
    return Array.from(actionCheckboxes.querySelectorAll('input[type="checkbox"]:checked')).map(
      (input) => input.value
    );
  }

  function renderActionCheckboxes() {
    if (!actionCheckboxes || actionCheckboxes.dataset.rendered === 'true') return;

    actionCheckboxes.innerHTML = Object.entries(ACTION_LABELS)
      .map(([value, label]) => {
        const id = `report-action-${value.replace(/\./g, '-')}`;
        return `
          <label class="report-action-checkboxes__item" for="${id}">
            <input type="checkbox" id="${id}" name="report-action" value="${escapeHtml(value)}">
            <span>${escapeHtml(label)}</span>
          </label>
        `;
      })
      .join('');

    actionCheckboxes.dataset.rendered = 'true';
  }

  function showMessage(icon, message) {
    if (!reportTbody) return;
    reportTbody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <div class="empty-state__icon">${icon}</div>
            <p>${escapeHtml(message)}</p>
          </div>
        </td>
      </tr>
    `;
  }

  function summarizeValues(values) {
    if (!values) return '';
    if (typeof values === 'string') return values;
    if (values.fullName) return values.fullName;
    if (values.clientName) return values.clientName;
    if (values.description) return values.description;
    if (values.username) return values.username;
    return JSON.stringify(values);
  }

  function buildDetails(log) {
    const action = log.action || '';

    if (action === 'auth.login.failed') {
      return log.newValues && log.newValues.username ? `Usuário: ${log.newValues.username}` : '';
    }

    if (action === 'auth.login' || action === 'auth.logout') {
      return log.newValues && log.newValues.username ? `Usuário: ${log.newValues.username}` : '';
    }

    if (action === 'client.delete') {
      return log.oldValues && log.oldValues.fullName ? log.oldValues.fullName : '';
    }

    if (action === 'occurrence.delete') {
      const parts = [];
      if (log.oldValues && log.oldValues.clientName) parts.push(log.oldValues.clientName);
      if (log.oldValues && log.oldValues.description) parts.push(log.oldValues.description);
      return parts.join(' — ');
    }

    if (action.indexOf('client.photo') === 0) {
      return (log.newValues && log.newValues.photoPath) || (log.oldValues && log.oldValues.photoPath) || '';
    }

    if (action.indexOf('client.') === 0) {
      return (log.newValues && log.newValues.fullName) || (log.oldValues && log.oldValues.fullName) || '';
    }

    if (action.indexOf('occurrence.') === 0) {
      const parts = [];
      if ((log.newValues && log.newValues.clientName) || (log.oldValues && log.oldValues.clientName)) {
        parts.push((log.newValues && log.newValues.clientName) || (log.oldValues && log.oldValues.clientName));
      }
      if ((log.newValues && log.newValues.description) || (log.oldValues && log.oldValues.description)) {
        parts.push((log.newValues && log.newValues.description) || (log.oldValues && log.oldValues.description));
      }
      return parts.join(' — ');
    }

    return '';
  }

  function hasActiveFilters() {
    return Boolean(
      (clientSelect && clientSelect.value) ||
      (userSelect && userSelect.value) ||
      (dateFromInput && dateFromInput.value) ||
      (dateToInput && dateToInput.value) ||
      getSelectedActions().length > 0 ||
      searchFilter
    );
  }

  function getFilteredLogs() {
    if (!searchFilter) return reportLogs;

    return reportLogs.filter((log) => logMatchesSearch(log));
  }

  function logMatchesSearch(log) {
    if (!searchFilter) return true;

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

    return haystack.indexOf(searchFilter) !== -1;
  }

  function buildReportQueryParams(limit, offset) {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });

    if (clientSelect && clientSelect.value) params.set('clientId', clientSelect.value);
    if (userSelect && userSelect.value) params.set('userId', userSelect.value);
    if (dateFromInput && dateFromInput.value) params.set('dateFrom', dateFromInput.value);
    if (dateToInput && dateToInput.value) params.set('dateTo', dateToInput.value);
    getSelectedActions().forEach((action) => params.append('action', action));

    return params;
  }

  async function fetchAllLogsForReport() {
    const pageSize = 200;
    let offset = 0;
    let total = Infinity;
    const allLogs = [];

    while (offset < total) {
      const params = buildReportQueryParams(pageSize, offset);
      const res = await fetch(`/api/audit-logs?${params}`);
      if (res.status === 401) {
        window.location.href = '/?login=required';
        return null;
      }
      if (!res.ok) {
        throw new Error('request failed');
      }

      const data = await res.json();
      const logs = Array.isArray(data.logs) ? data.logs : [];
      allLogs.push(...logs);
      total = Number(data.total) || 0;
      offset += pageSize;

      if (logs.length === 0) break;
    }

    return allLogs.filter((log) => logMatchesSearch(log));
  }

  function parseLogDate(dateTimeStr) {
    if (!dateTimeStr) return 0;
    const date = new Date(String(dateTimeStr).replace(' ', 'T'));
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  }

  function groupLogsByAction(logs) {
    const groups = new Map();

    logs.forEach((log) => {
      const action = log.action || 'unknown';
      if (!groups.has(action)) groups.set(action, []);
      groups.get(action).push(log);
    });

    groups.forEach((groupLogs) => {
      groupLogs.sort((a, b) => parseLogDate(a.createdAt) - parseLogDate(b.createdAt));
    });

    const ordered = [];
    Object.keys(ACTION_LABELS).forEach((action) => {
      if (groups.has(action)) {
        ordered.push({
          action,
          label: ACTION_LABELS[action],
          logs: groups.get(action),
        });
        groups.delete(action);
      }
    });

    groups.forEach((groupLogs, action) => {
      ordered.push({ action, label: action, logs: groupLogs });
    });

    return ordered;
  }

  function buildFilterSummary() {
    const parts = [];

    if (clientSelect && clientSelect.value) {
      parts.push(`Paciente: ${clientSelect.options[clientSelect.selectedIndex].textContent}`);
    }
    if (userSelect && userSelect.value) {
      parts.push(`Usuário: ${userSelect.options[userSelect.selectedIndex].textContent}`);
    }
    if (dateFromInput && dateFromInput.value) {
      parts.push(`Período de: ${formatDate(dateFromInput.value)}`);
    }
    if (dateToInput && dateToInput.value) {
      parts.push(`Período até: ${formatDate(dateToInput.value)}`);
    }

    const selectedActions = getSelectedActions();
    if (selectedActions.length > 0) {
      parts.push(
        `Tipos de ação: ${selectedActions.map((action) => ACTION_LABELS[action] || action).join(', ')}`
      );
    }
    if (searchFilter) {
      parts.push(`Busca: "${searchFilter}"`);
    }

    return parts.length > 0 ? parts.join(' · ') : 'Todos os registros';
  }

  function buildPrintRow(log) {
    const userLabel = log.userName
      ? `${log.userName} (${log.userUsername || ''})`
      : '—';
    const entityLabel = log.entityType
      ? `${ENTITY_LABELS[log.entityType] || log.entityType}${log.entityId ? ` #${log.entityId}` : ''}`
      : '—';
    const details = buildDetails(log) || '—';

    return `
      <tr>
        <td>${escapeHtml(formatDateTime(log.createdAt))}</td>
        <td>${escapeHtml(userLabel)}</td>
        <td>${escapeHtml(entityLabel)}</td>
        <td>${escapeHtml(details)}</td>
      </tr>
    `;
  }

  function buildLetterheadHtml(generatedAt, totalRecords) {
    const logoUrl = `${window.location.origin}/images/logo.png`;
    return `
      <header class="letterhead">
        <img src="${logoUrl}" alt="CTAD" class="letterhead__logo">
        <p class="letterhead__org">Comunidade Terapêutica Amparados por Deus</p>
        <h1 class="letterhead__title">Relatório de Auditoria</h1>
        <div class="letterhead__meta">
          <p>Gerado em: ${escapeHtml(generatedAt)}</p>
          <p>Total de registros: ${totalRecords}</p>
        </div>
      </header>
    `;
  }

  function buildPrintDocument(groups, totalRecords) {
    const generatedAt = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const filterSummary = buildFilterSummary();
    const letterheadHtml = buildLetterheadHtml(generatedAt, totalRecords);

    const sectionsHtml = groups
      .map(
        (group) => `
        <section class="report-group">
          <h2 class="report-group__title">${escapeHtml(group.label)}</h2>
          <p class="report-group__count">${group.logs.length} registro${group.logs.length === 1 ? '' : 's'}</p>
          <table class="report-table">
            <thead>
              <tr>
                <th>Data e Hora</th>
                <th>Usuário</th>
                <th>Registro</th>
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              ${group.logs.map((log) => buildPrintRow(log)).join('')}
            </tbody>
          </table>
        </section>
      `
      )
      .join('');

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório de Auditoria — CTAD</title>
  <style>
    :root {
      --color-primary: #1a6b5c;
      --color-primary-dark: #0f4a40;
      --color-text: #1e2d2a;
      --color-text-muted: #5a6e69;
      --color-border: #d4e0dc;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    @page {
      size: A4;
      margin: 12mm 14mm 16mm;
    }

    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      color: var(--color-text);
      line-height: 1.5;
      font-size: 11pt;
      background: #fff;
    }

    .print-document {
      width: 100%;
      border-collapse: collapse;
    }

    .print-document thead td,
    .print-document tbody td,
    .print-document tfoot td {
      padding: 0;
      vertical-align: top;
    }

    .letterhead {
      text-align: center;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--color-primary);
    }

    .letterhead__logo {
      width: 80px;
      height: auto;
      margin: 0 auto 0.5rem;
    }

    .letterhead__org {
      font-size: 0.82rem;
      color: var(--color-text-muted);
      margin-bottom: 0.25rem;
    }

    .letterhead__title {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--color-primary-dark);
      margin-bottom: 0.5rem;
    }

    .letterhead__meta {
      font-size: 0.78rem;
      color: var(--color-text-muted);
    }

    .letterhead__meta p + p {
      margin-top: 0.2rem;
    }

    .print-document__body {
      padding-top: 1rem;
    }

    .report-summary {
      background: #f4f7f6;
      border: 1px solid var(--color-border);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      margin-bottom: 1.25rem;
      font-size: 0.88rem;
    }

    .report-summary strong {
      color: var(--color-primary-dark);
    }

    .report-group {
      margin-bottom: 1.5rem;
      page-break-inside: avoid;
    }

    .report-group__title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-primary-dark);
      margin-bottom: 0.2rem;
      padding-bottom: 0.35rem;
      border-bottom: 1px solid var(--color-border);
    }

    .report-group__count {
      font-size: 0.78rem;
      color: var(--color-text-muted);
      margin-bottom: 0.6rem;
    }

    .report-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
    }

    .report-table th,
    .report-table td {
      border: 1px solid var(--color-border);
      padding: 0.45rem 0.55rem;
      text-align: left;
      vertical-align: top;
    }

    .report-table th {
      background: #e8f2ef;
      color: var(--color-primary-dark);
      font-weight: 600;
    }

    .report-table tbody tr:nth-child(even) {
      background: #fafcfc;
    }

    .print-document__footer {
      padding-top: 0.5rem;
      border-top: 1px solid var(--color-border);
      text-align: center;
      font-size: 0.72rem;
      color: var(--color-text-muted);
    }

    .print-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      margin: 1.5rem 0 2rem;
    }

    .print-actions button {
      font-family: inherit;
      font-size: 0.9rem;
      padding: 0.55rem 1.25rem;
      border-radius: 8px;
      cursor: pointer;
      border: 1px solid var(--color-primary);
    }

    .print-actions button:first-child {
      background: var(--color-primary);
      color: #fff;
    }

    .print-actions button:last-child {
      background: #fff;
      color: var(--color-primary);
    }

    @media print {
      .print-actions { display: none !important; }

      .print-document thead {
        display: table-header-group;
      }

      .print-document tfoot {
        display: table-footer-group;
      }

      .report-table thead {
        display: table-header-group;
      }

      .report-group {
        page-break-inside: auto;
      }

      .report-group__title {
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <button type="button" onclick="window.print()">Imprimir</button>
    <button type="button" onclick="window.close()">Fechar</button>
  </div>

  <table class="print-document">
    <thead>
      <tr>
        <td>${letterheadHtml}</td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="print-document__body">
          <div class="report-summary">
            <strong>Filtros aplicados:</strong> ${escapeHtml(filterSummary)}
          </div>
          ${sectionsHtml}
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td class="print-document__footer">
          CTAD — Comunidade Terapêutica Amparados por Deus · Documento gerado pelo sistema
        </td>
      </tr>
    </tfoot>
  </table>
</body>
</html>`;
  }

  function openPrintReport(html) {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');

    if (!printWindow) {
      URL.revokeObjectURL(url);
      window.alert('Permita pop-ups neste site para gerar o relatório.');
      return;
    }

    const cleanup = () => URL.revokeObjectURL(url);

    const triggerPrint = () => {
      printWindow.focus();
      printWindow.print();
      cleanup();
    };

    let ready = false;
    const onReady = () => {
      if (ready) return;
      try {
        const doc = printWindow.document;
        if (!doc?.body?.innerHTML?.trim()) return;
      } catch {
        return;
      }
      ready = true;
      const logo = printWindow.document.querySelector('.letterhead__logo');
      if (logo && !logo.complete) {
        logo.addEventListener('load', triggerPrint, { once: true });
        logo.addEventListener('error', triggerPrint, { once: true });
      } else {
        setTimeout(triggerPrint, 300);
      }
    };

    printWindow.addEventListener('load', onReady, { once: true });
    setTimeout(onReady, 1500);
  }

  async function generateReport() {
    bindElements();
    if (!generateBtn) return;

    const originalLabel = generateBtn.textContent;
    generateBtn.disabled = true;
    generateBtn.textContent = 'Gerando...';

    try {
      const logs = await fetchAllLogsForReport();
      if (logs === null) return;

      if (logs.length === 0) {
        window.alert(
          hasActiveFilters()
            ? 'Nenhum registro encontrado para os filtros selecionados.'
            : 'Nenhuma alteração registrada para gerar o relatório.'
        );
        return;
      }

      const groups = groupLogsByAction(logs);
      openPrintReport(buildPrintDocument(groups, logs.length));
    } catch {
      window.alert('Erro ao gerar relatório. Verifique se o servidor está em execução.');
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = originalLabel;
    }
  }

  function renderPagination(total) {
    const container = document.getElementById('report-pagination');
    if (!container) return;

    const totalPages = Math.ceil(total / REPORT_PAGE_SIZE);
    if (total === 0 || totalPages <= 1) {
      container.hidden = true;
      container.innerHTML = '';
      return;
    }

    const start = (reportPage - 1) * REPORT_PAGE_SIZE + 1;
    const end = Math.min(reportPage * REPORT_PAGE_SIZE, total);

    container.hidden = false;
    container.innerHTML = `
      <div class="pagination">
        <p class="pagination__info">Mostrando ${start}–${end} de ${total} registro${total === 1 ? '' : 's'}</p>
        <div class="pagination__controls">
          <button type="button" class="btn btn--outline btn--sm" data-report-page="prev" ${reportPage <= 1 ? 'disabled' : ''}>Anterior</button>
          <span class="pagination__pages">${renderPageButtons(totalPages)}</span>
          <button type="button" class="btn btn--outline btn--sm" data-report-page="next" ${reportPage >= totalPages ? 'disabled' : ''}>Próxima</button>
        </div>
      </div>
    `;
  }

  function renderPageButtons(totalPages) {
    const pages = [];

    function addPage(page) {
      const isActive = page === reportPage;
      pages.push(
        `<button type="button" class="pagination__page${isActive ? ' pagination__page--active' : ''}" data-report-page="${page}"${isActive ? ' aria-current="page"' : ''}>${page}</button>`
      );
    }

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) addPage(i);
      return pages.join('');
    }

    addPage(1);
    if (reportPage > 3) pages.push('<span class="pagination__ellipsis">…</span>');

    const rangeStart = Math.max(2, reportPage - 1);
    const rangeEnd = Math.min(totalPages - 1, reportPage + 1);
    for (let i = rangeStart; i <= rangeEnd; i++) addPage(i);

    if (reportPage < totalPages - 2) pages.push('<span class="pagination__ellipsis">…</span>');
    addPage(totalPages);
    return pages.join('');
  }

  function renderLogs() {
    if (!reportTbody) return;

    const filtered = getFilteredLogs();

    if (filtered.length === 0) {
      showMessage(
        '📊',
        hasActiveFilters()
          ? 'Nenhum registro encontrado para os filtros selecionados.'
          : 'Nenhuma alteração registrada ainda.'
      );
      renderPagination(0);
      return;
    }

    reportTbody.innerHTML = filtered
      .map((log) => {
        const userLabel = log.userName
          ? `${escapeHtml(log.userName)} (${escapeHtml(log.userUsername || '')})`
          : '—';
        const actionLabel = escapeHtml(ACTION_LABELS[log.action] || log.action || '—');
        const entityLabel = log.entityType
          ? `${escapeHtml(ENTITY_LABELS[log.entityType] || log.entityType)}${log.entityId ? ` #${log.entityId}` : ''}`
          : '—';
        const details = escapeHtml(buildDetails(log));

        return `
          <tr>
            <td>${formatDateTime(log.createdAt)}</td>
            <td>${userLabel}</td>
            <td>${actionLabel}</td>
            <td>${entityLabel}</td>
            <td class="audit-details">${details || '—'}</td>
          </tr>
        `;
      })
      .join('');

    renderPagination(reportTotal);
  }

  async function loadFilterOptions() {
    if (!clientSelect || !userSelect) return;

    try {
      const [clientsRes, usersRes] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/users'),
      ]);

      if (clientsRes.ok) {
        const data = await clientsRes.json();
        const clients = data.clients || [];
        clients
          .slice()
          .sort((a, b) => String(a.fullName || '').localeCompare(String(b.fullName || ''), 'pt-BR'))
          .forEach((client) => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.fullName;
            clientSelect.appendChild(option);
          });
      }

      if (usersRes.ok) {
        const data = await usersRes.json();
        const users = data.users || [];
        users.forEach((user) => {
          const option = document.createElement('option');
          option.value = user.id;
          option.textContent = `${user.name} (${user.username})`;
          userSelect.appendChild(option);
        });
      }
    } catch {
      // Keep default filter options
    }
  }

  async function loadLogs() {
    bindElements();
    if (!reportTbody) {
      return;
    }

    showMessage('📊', 'Carregando relatório...');

    const params = buildReportQueryParams(REPORT_PAGE_SIZE, (reportPage - 1) * REPORT_PAGE_SIZE);

    try {
      const res = await fetch(`/api/audit-logs?${params}`);
      if (res.status === 401) {
        window.location.href = '/?login=required';
        return;
      }
      if (!res.ok) {
        throw new Error('request failed');
      }

      const data = await res.json();
      reportLogs = Array.isArray(data.logs) ? data.logs : [];
      reportTotal = Number(data.total) || 0;
      renderLogs();
    } catch {
      showMessage('⚠️', 'Erro ao carregar relatório. Verifique se o servidor está em execução.');
      renderPagination(0);
    }
  }

  function clearFilters() {
    if (clientSelect) clientSelect.value = '';
    if (userSelect) userSelect.value = '';
    if (dateFromInput) dateFromInput.value = '';
    if (dateToInput) dateToInput.value = '';
    if (actionCheckboxes) {
      actionCheckboxes.querySelectorAll('input[type="checkbox"]').forEach((input) => {
        input.checked = false;
      });
    }
    if (reportSearchInput) reportSearchInput.value = '';
    searchFilter = '';
    reportPage = 1;
    loadLogs();
  }

  function handlePaginationClick(e) {
    const btn = e.target.closest('[data-report-page]');
    if (!btn || btn.disabled || !btn.closest('#report-pagination')) return;

    const action = btn.dataset.reportPage;
    if (action === 'prev') reportPage -= 1;
    else if (action === 'next') reportPage += 1;
    else reportPage = Number(action);

    loadLogs();
  }

  function initReportsPage() {
    if (reportInitialized) return;
    bindElements();
    renderActionCheckboxes();
    if (!reportTbody || !reportSearchInput || !clearBtn) return;

    reportSearchInput.addEventListener('input', () => {
      searchFilter = reportSearchInput.value.trim().toLowerCase();
      renderLogs();
    });

    [clientSelect, userSelect, dateFromInput, dateToInput]
      .filter(Boolean)
      .forEach((el) => {
        el.addEventListener('change', () => {
          reportPage = 1;
          loadLogs();
        });
      });

    if (actionCheckboxes) {
      actionCheckboxes.addEventListener('change', () => {
        reportPage = 1;
        loadLogs();
      });
    }

    clearBtn.addEventListener('click', clearFilters);
    if (generateBtn) {
      generateBtn.addEventListener('click', generateReport);
    }
    document.addEventListener('click', handlePaginationClick);
    reportInitialized = true;
  }

  async function onPageShow() {
    bindElements();
    initReportsPage();

    if (!reportTbody) {
      return;
    }

    if (!filtersLoaded) {
      filtersLoaded = true;
      loadFilterOptions();
    }

    await loadLogs();
  }

  return { onPageShow };
})();

window.Reports = Reports;
