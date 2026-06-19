const PAGE_CONFIG = {
  pacientes: { title: 'Pacientes' },
  ocorrencias: { title: 'Ocorrências' },
  historico: { title: 'Histórico de Transações' },
};

let currentPage = 'pacientes';

document.addEventListener('DOMContentLoaded', async () => {
  await loadUser();
  initNavigation();
});

async function loadUser() {
  try {
    const res = await fetch('/auth/me');
    if (!res.ok) throw new Error('Unauthorized');
    const { user } = await res.json();
    document.getElementById('user-name').textContent = `${user.name} (${user.username})`;
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

  currentPage = page;

  document.querySelectorAll('.sidebar__link[data-page]').forEach((link) => {
    link.classList.toggle('sidebar__link--active', link.dataset.page === page);
  });

  document.querySelectorAll('.admin-page').forEach((section) => {
    section.hidden = section.id !== `page-${page}`;
  });

  document.getElementById('page-title').textContent = PAGE_CONFIG[page].title;

  if (page === 'ocorrencias' && window.Occurrences?.onPageShow) {
    window.Occurrences.onPageShow();
  }

  if (page === 'historico' && window.AuditHistory?.onPageShow) {
    window.AuditHistory.onPageShow();
  }
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
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
  const closeBtn = topModal.querySelector('[data-close-patient-modal], [data-close-delete-modal], [data-close-occurrence-modal]');
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
};
