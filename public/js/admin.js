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
  initReportsPage();
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
      navUsuarios.hidden = user.role !== 'admin';
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

function navigateToPage(page) {
  if (!PAGE_CONFIG[page]) return;

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
  let actionSelect;
  let reportSearchInput;
  let clearBtn;

  function bindElements() {
    reportTbody = document.getElementById('report-tbody');
    clientSelect = document.getElementById('report-client-select');
    userSelect = document.getElementById('report-user-select');
    dateFromInput = document.getElementById('report-date-from');
    dateToInput = document.getElementById('report-date-to');
    actionSelect = document.getElementById('report-action-select');
    reportSearchInput = document.getElementById('report-search-input');
    clearBtn = document.getElementById('report-clear-btn');
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
      (actionSelect && actionSelect.value) ||
      searchFilter
    );
  }

  function getFilteredLogs() {
    if (!searchFilter) return reportLogs;

    return reportLogs.filter((log) => {
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
    });
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

    const params = new URLSearchParams({
      limit: String(REPORT_PAGE_SIZE),
      offset: String((reportPage - 1) * REPORT_PAGE_SIZE),
    });

    if (clientSelect && clientSelect.value) params.set('clientId', clientSelect.value);
    if (userSelect && userSelect.value) params.set('userId', userSelect.value);
    if (dateFromInput && dateFromInput.value) params.set('dateFrom', dateFromInput.value);
    if (dateToInput && dateToInput.value) params.set('dateTo', dateToInput.value);
    if (actionSelect && actionSelect.value) params.set('action', actionSelect.value);

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
    if (actionSelect) actionSelect.value = '';
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
    if (!reportTbody || !reportSearchInput || !clearBtn) return;

    reportSearchInput.addEventListener('input', () => {
      searchFilter = reportSearchInput.value.trim().toLowerCase();
      renderLogs();
    });

    [clientSelect, userSelect, dateFromInput, dateToInput, actionSelect]
      .filter(Boolean)
      .forEach((el) => {
        el.addEventListener('change', () => {
          reportPage = 1;
          loadLogs();
        });
      });

    clearBtn.addEventListener('click', clearFilters);
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
