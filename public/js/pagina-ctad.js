let contentItems = [];
let contentLoaded = false;

const pageContentForm = document.getElementById('page-content-form');
const pageContentSaveBtn = document.getElementById('page-content-save-btn');
const pageContentAlert = document.getElementById('page-content-alert');

const LONG_TEXT_KEYS = new Set([
  'hero.subtitle',
  'login.text',
  'about.quote',
  'about.paragraph1',
  'about.paragraph2',
  'services.desc',
  'services.feature1.text',
  'services.feature2.text',
  'services.feature3.text',
  'services.feature4.text',
  'services.feature5.text',
  'services.feature6.text',
  'cta.text',
  'footer.desc',
  'meta.description',
]);

document.addEventListener('DOMContentLoaded', () => {
  if (!pageContentForm) return;

  pageContentSaveBtn?.addEventListener('click', handleSave);
});

function showAlert(message, type = 'error') {
  if (!pageContentAlert) return;
  pageContentAlert.textContent = message;
  pageContentAlert.className = `alert alert--visible alert--${type}`;
  pageContentAlert.hidden = false;
}

function hideAlert() {
  if (!pageContentAlert) return;
  pageContentAlert.hidden = true;
  pageContentAlert.textContent = '';
  pageContentAlert.className = 'alert';
}

function groupBySection(items) {
  const groups = new Map();
  items.forEach((item) => {
    const section = item.section || 'Geral';
    if (!groups.has(section)) groups.set(section, []);
    groups.get(section).push(item);
  });
  return groups;
}

function renderForm() {
  if (!pageContentForm) return;

  const groups = groupBySection(contentItems);

  pageContentForm.innerHTML = Array.from(groups.entries())
    .map(([section, items]) => {
      const fields = items
        .map((item) => {
          const id = `page-content-${item.key.replace(/\./g, '-')}`;
          const isLong = LONG_TEXT_KEYS.has(item.key);
          const value = Admin.escapeHtml(item.content || '');

          if (isLong) {
            return `
              <div class="form-group">
                <label for="${id}">${Admin.escapeHtml(item.label)}</label>
                <textarea id="${id}" name="${Admin.escapeHtml(item.key)}" rows="3">${value}</textarea>
              </div>
            `;
          }

          return `
            <div class="form-group">
              <label for="${id}">${Admin.escapeHtml(item.label)}</label>
              <input type="text" id="${id}" name="${Admin.escapeHtml(item.key)}" value="${value}">
            </div>
          `;
        })
        .join('');

      return `
        <fieldset class="page-content-section">
          <legend>${Admin.escapeHtml(section)}</legend>
          ${fields}
        </fieldset>
      `;
    })
    .join('');
}

function collectFormData() {
  const updates = [];

  contentItems.forEach((item) => {
    const input = pageContentForm.querySelector(`[name="${CSS.escape(item.key)}"]`);
    if (!input) return;

    const content = input.value;
    if (content !== item.content) {
      updates.push({ key: item.key, content });
    }
  });

  return updates;
}

async function loadContent() {
  if (!pageContentForm) return;

  pageContentForm.innerHTML = `
    <div class="empty-state">
      <div class="empty-state__icon">🌐</div>
      <p>Carregando conteúdos...</p>
    </div>
  `;

  try {
    const res = await fetch('/api/page-content/admin');
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
    contentItems = Array.isArray(data.items) ? data.items : [];
    renderForm();
    contentLoaded = true;
  } catch {
    pageContentForm.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">⚠️</div>
        <p>Erro ao carregar conteúdos. Verifique se o servidor está em execução.</p>
      </div>
    `;
  }
}

async function handleSave() {
  if (!pageContentSaveBtn || !contentLoaded) return;

  hideAlert();
  const updates = collectFormData();

  if (updates.length === 0) {
    showAlert('Nenhuma alteração para salvar.', 'info');
    return;
  }

  const originalLabel = pageContentSaveBtn.textContent;
  pageContentSaveBtn.disabled = true;
  pageContentSaveBtn.textContent = 'Salvando...';

  try {
    const res = await fetch('/api/page-content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: updates }),
    });

    if (res.status === 401) {
      window.location.href = '/?login=required';
      return;
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Falha ao salvar');

    const savedItems = Array.isArray(data.items) ? data.items : [];
    savedItems.forEach((saved) => {
      const item = contentItems.find((entry) => entry.key === saved.key);
      if (item) item.content = saved.content;
    });

    showAlert('Conteúdos salvos com sucesso.', 'info');
  } catch (err) {
    showAlert(err.message || 'Erro ao salvar conteúdos.', 'error');
  } finally {
    pageContentSaveBtn.disabled = false;
    pageContentSaveBtn.textContent = originalLabel;
  }
}

async function onPageShow() {
  if (!Admin.isAdmin()) {
    Admin.navigateToPage('pacientes');
    return;
  }

  if (!contentLoaded) {
    await loadContent();
  }
}

window.PageContentAdmin = { onPageShow };
