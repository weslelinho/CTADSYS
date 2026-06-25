const PatientPrint = (function createPatientPrintModule() {
  const ESCOLARIDADE_LABELS = {
    fundamental_incompleto: 'Fundamental incompleto',
    fundamental_completo: 'Fundamental completo',
    medio_incompleto: 'Médio incompleto',
    medio_completo: 'Médio completo',
    superior_incompleto: 'Superior incompleto',
    superior_completo: 'Superior completo',
    pos_graduacao: 'Pós-graduação',
  };

  const ESTADO_CIVIL_LABELS = {
    solteiro: 'Solteiro(a)',
    casado: 'Casado(a)',
    divorciado: 'Divorciado(a)',
    viuvo: 'Viúvo(a)',
    uniao_estavel: 'União estável',
    separado: 'Separado(a)',
  };

  const SEXO_LABELS = {
    masculino: 'Masculino',
    feminino: 'Feminino',
    outro: 'Outro',
  };

  const QUESTIONNAIRE_ITEMS = [
    { type: 'yn', text: 'Nosso tratamento é evangélico. Está disposto?' },
    { type: 'yn', text: 'Você está disposto a se recuperar?' },
    { type: 'line', text: 'Doenças que tem ou já teve?' },
    { type: 'line', text: 'Já passou em alguma clínica? Qual?' },
    { type: 'line', text: 'Quais drogas fez uso?' },
    { type: 'line', text: 'Responde algum processo? Qual?' },
    { type: 'line', text: 'Com que idade começou a usar drogas?' },
    { type: 'line', text: 'Pretende ficar o tempo determinado?' },
    { type: 'yn', text: 'Está disposto a obedecer o regulamento da casa?' },
  ];

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

  function formatDateParts(dateStr) {
    if (!dateStr) return { day: '___', month: '___', year: '_____' };
    const parts = dateStr.split('-');
    if (parts.length < 3) return { day: '___', month: '___', year: '_____' };
    return { day: parts[2], month: parts[1], year: parts[0] };
  }

  function label(value, map) {
    if (!value) return '—';
    return map[value] || value;
  }

  function boolLabel(value) {
    if (value === true) return 'Sim';
    if (value === false) return 'Não';
    return '—';
  }

  function compactField(labelText, value, wide) {
    return `
      <span class="compact-field${wide ? ' compact-field--wide' : ''}">
        <span class="compact-field__label">${escapeHtml(labelText)}</span>
        <span class="compact-field__value">${escapeHtml(value ?? '—')}</span>
      </span>`;
  }

  function compactGroup(title, fieldsHtml) {
    return `
      <div class="compact-fields__group">
        <p class="compact-fields__title">${escapeHtml(title)}</p>
        <div class="compact-fields__row">${fieldsHtml}</div>
      </div>`;
  }

  function yesNoOptions() {
    return '<span class="yn-option">() Sim</span><span class="yn-option">() Não</span>';
  }

  function questionYesNo(text) {
    return `
      <li class="question question--yn">
        <span class="question__text">${escapeHtml(text)}</span>
        <span class="question__options">${yesNoOptions()}</span>
      </li>`;
  }

  function questionLine(text) {
    return `
      <li class="question question--line">
        <span class="question__text">${escapeHtml(text)}</span>
        <span class="fill-line"></span>
      </li>`;
  }

  function buildPhotoHtml(client) {
    const photoSrc = client.photoDataUrl
      ? client.photoDataUrl
      : client.photoPath
        ? `${window.location.origin}/uploads/${client.photoPath}`
        : null;

    if (photoSrc) {
      return `<img class="patient-photo" src="${photoSrc}" alt="">`;
    }
    return '<div class="patient-photo patient-photo--empty">Foto<br>3×4</div>';
  }

  function buildPatientDataHtml(client) {
    const filhos =
      client.numeroFilhos !== null && client.numeroFilhos !== undefined ? client.numeroFilhos : '—';

    return `
      <div class="patient-block">
        ${buildPhotoHtml(client)}
        <div class="patient-block__main">
          <p class="patient-block__name">${escapeHtml(client.fullName)}</p>
          <div class="compact-fields">
            ${compactGroup(
              'Documentação',
              `
              ${compactField('CPF', client.cpf)}
              ${compactField('RG', client.rg)}
              ${compactField('Órgão expedidor', client.orgaoExpedidor)}
              ${compactField('Emissão RG', formatDate(client.dataEmissao))}
              ${compactField('Título de eleitor', client.tituloEleitor)}
            `
            )}
            ${compactGroup(
              'Dados pessoais',
              `
              ${compactField('Nascimento', formatDate(client.birthDate))}
              ${compactField('Sexo', label(client.sexo, SEXO_LABELS))}
              ${compactField('Naturalidade', client.naturalidade)}
              ${compactField('Estado civil', label(client.estadoCivil, ESTADO_CIVIL_LABELS))}
              ${compactField('Escolaridade', label(client.escolaridade, ESCOLARIDADE_LABELS))}
              ${compactField('Profissão', client.profissao)}
              ${compactField('Trabalha', boolLabel(client.trabalha))}
              ${compactField('Filhos', filhos)}
            `
            )}
            ${compactGroup(
              'Filiação',
              `
              ${compactField('Pai', client.filiacaoPai, true)}
              ${compactField('Mãe', client.filiacaoMae, true)}
            `
            )}
            ${compactGroup(
              'Contato e endereço',
              `
              ${compactField('Telefone', client.phone)}
              ${compactField('E-mail', client.email)}
              ${compactField('Endereço', client.address, true)}
              ${compactField('Cidade', client.city)}
              ${compactField('Estado', client.state)}
            `
            )}
          </div>
        </div>
      </div>`;
  }

  function buildQuestionnaireHtml() {
    const itemsHtml = QUESTIONNAIRE_ITEMS.map((item) =>
      item.type === 'yn' ? questionYesNo(item.text) : questionLine(item.text)
    ).join('');

    return `
      <section class="questionnaire">
        <h2 class="section-title">Questionário</h2>
        <ol class="question-list">${itemsHtml}</ol>
      </section>`;
  }

  function buildDatesAndSignaturesHtml(client) {
    const arrival = formatDateParts(client.admissionDate);
    const exit = formatDateParts(client.exitDate);

    return `
      <div class="closing-block">
        <div class="signatures">
          <div class="signature-item">
            <span class="signature-item__line"></span>
            <span class="signature-item__label">Ass. do aluno</span>
          </div>
          <div class="signature-item">
            <span class="signature-item__line"></span>
            <span class="signature-item__label">Ass. do responsável</span>
          </div>
          <div class="signature-item">
            <span class="signature-item__line"></span>
            <span class="signature-item__label">Ass. do obreiro CTAD</span>
          </div>
        </div>
        <div class="stay-dates">
          <p class="stay-dates__item">
            <span class="stay-dates__label">Data de chegada</span>
            <span class="date-field">
              <span class="date-box">${escapeHtml(arrival.day)}</span>/<span class="date-box">${escapeHtml(arrival.month)}</span>/<span class="date-box date-box--year">${escapeHtml(arrival.year)}</span>
            </span>
          </p>
          <span class="stay-dates__sep">·</span>
          <p class="stay-dates__item">
            <span class="stay-dates__label">Data de saída</span>
            <span class="date-field">
              <span class="date-box">${escapeHtml(exit.day)}</span>/<span class="date-box">${escapeHtml(exit.month)}</span>/<span class="date-box date-box--year">${escapeHtml(exit.year)}</span>
            </span>
          </p>
        </div>
      </div>`;
  }

  function buildLetterheadHtml() {
    const logoUrl = `${window.location.origin}/images/logo.png`;
    return `
      <header class="letterhead">
        <img src="${logoUrl}" alt="CTAD" class="letterhead__logo">
        <div class="letterhead__text">
          <p class="letterhead__org">Comunidade Terapêutica Amparados por Deus</p>
          <h1 class="letterhead__title">Ficha de Cadastro do Paciente</h1>
        </div>
      </header>`;
  }

  function buildPrintDocument(client) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Ficha do Paciente — ${escapeHtml(client.fullName)} — CTAD</title>
  <style>
    :root {
      --color-primary: #1a6b5c;
      --color-primary-dark: #0f4a40;
      --color-text: #1e2d2a;
      --color-text-muted: #5a6e69;
      --color-border: #c5d5d0;
      --color-bg-muted: #f4f8f6;
      --page-width: 210mm;
      --page-height: 297mm;
      --page-padding: 10mm;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    @page {
      size: A4 portrait;
      margin: 10mm;
    }

    html, body {
      height: 100%;
    }

    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      color: var(--color-text);
      line-height: 1.3;
      font-size: 8.5pt;
      background: #e8ecea;
    }

    .print-sheet {
      width: var(--page-width);
      min-height: var(--page-height);
      margin: 0 auto;
    }

    .print-page {
      width: var(--page-width);
      min-height: var(--page-height);
      height: var(--page-height);
      background: #fff;
      padding: var(--page-padding);
      display: flex;
      flex-direction: column;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .print-page__body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2.5mm;
      min-height: 0;
    }

    .letterhead {
      display: flex;
      align-items: center;
      gap: 3mm;
      padding: 2mm 0;
      border-bottom: 2px solid var(--color-primary);
      margin-bottom: 2mm;
      flex-shrink: 0;
    }

    .letterhead__logo {
      width: 46px;
      height: auto;
      flex-shrink: 0;
    }

    .letterhead__org {
      font-size: 7pt;
      color: var(--color-text-muted);
    }

    .letterhead__title {
      font-size: 10.5pt;
      font-weight: 800;
      color: var(--color-primary-dark);
      line-height: 1.15;
    }

    .patient-block {
      display: flex;
      gap: 3mm;
      align-items: flex-start;
      padding: 2mm 2.5mm;
      background: var(--color-bg-muted);
      border: 1px solid var(--color-border);
      border-radius: 2px;
      flex-shrink: 0;
    }

    .patient-photo {
      width: 22mm;
      height: 28mm;
      object-fit: cover;
      border: 1px solid var(--color-border);
      border-radius: 2px;
      flex-shrink: 0;
      background: #fff;
    }

    .patient-photo--empty {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 6.5pt;
      color: var(--color-text-muted);
      text-align: center;
      line-height: 1.2;
    }

    .patient-block__main {
      flex: 1;
      min-width: 0;
    }

    .patient-block__name {
      font-size: 10pt;
      font-weight: 800;
      color: var(--color-primary-dark);
      line-height: 1.15;
      margin-bottom: 1.5mm;
    }

    .compact-fields {
      display: flex;
      flex-direction: column;
      gap: 1.2mm;
    }

    .compact-fields__title {
      font-size: 6.2pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--color-primary-dark);
      margin-bottom: 0.5mm;
    }

    .compact-fields__row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8mm 3mm;
      align-items: baseline;
    }

    .compact-field {
      display: inline-flex;
      align-items: baseline;
      gap: 0.8mm;
      font-size: 7.2pt;
      line-height: 1.2;
      max-width: 100%;
    }

    .compact-field--wide {
      flex: 1 1 100%;
    }

    .compact-field__label {
      font-size: 6.2pt;
      font-weight: 700;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.02em;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .compact-field__label::after {
      content: ':';
    }

    .compact-field__value {
      font-weight: 500;
      word-break: break-word;
    }

    .section-title {
      font-size: 8pt;
      font-weight: 700;
      color: var(--color-primary-dark);
      padding-bottom: 0.5mm;
      border-bottom: 1px solid var(--color-primary);
      margin-bottom: 1mm;
    }

    .questionnaire {
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
    }

    .question-list {
      list-style: none;
      counter-reset: question;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .question {
      counter-increment: question;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 1.5mm;
      padding: 0.6mm 0;
      border-bottom: 1px dotted var(--color-border);
      font-size: 7.5pt;
    }

    .question::before {
      content: counter(question) ".";
      font-weight: 700;
      color: var(--color-primary-dark);
      min-width: 4mm;
      align-self: flex-start;
    }

    .question__text {
      flex: 1;
      min-width: 30%;
      align-self: flex-start;
    }

    .question--yn {
      align-items: center;
    }

    .question__options {
      display: flex;
      gap: 3mm;
      white-space: nowrap;
      margin-left: auto;
      font-size: 7pt;
    }

    .question--line .question__text {
      flex: 0 1 auto;
      max-width: 55%;
    }

    .question--line .fill-line {
      flex: 1;
      min-width: 20mm;
      border-bottom: 1px solid var(--color-text);
      min-height: 3mm;
    }

    .fill-line {
      display: block;
      border-bottom: 1px solid var(--color-text);
      min-height: 3mm;
    }

    .closing-block {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 8mm;
      padding: 4mm 0;
      margin-top: 2mm;
      border-top: 1px solid var(--color-border);
      min-height: 0;
    }

    .signatures {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 12mm;
      width: 72%;
      max-width: 145mm;
    }

    .signature-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      gap: 1.5mm;
    }

    .signature-item__line {
      display: block;
      width: 100%;
      border-bottom: 1px solid var(--color-text);
      min-height: 7mm;
    }

    .signature-item__label {
      font-size: 7.5pt;
      text-align: center;
      color: var(--color-text-muted);
    }

    .stay-dates {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      align-items: baseline;
      gap: 2mm 6mm;
      width: 100%;
      margin-top: 4mm;
    }

    .stay-dates__sep {
      color: var(--color-text-muted);
      font-size: 8pt;
    }

    .stay-dates__item {
      display: inline-flex;
      align-items: baseline;
      gap: 2mm;
      font-size: 7.5pt;
    }

    .stay-dates__label {
      font-size: 6.5pt;
      font-weight: 700;
      color: var(--color-text-muted);
      text-transform: uppercase;
      white-space: nowrap;
    }

    .stay-dates__label::after {
      content: ':';
      margin-left: 0.5mm;
    }

    .date-field {
      font-size: 8.5pt;
      font-weight: 600;
    }

    .date-box {
      display: inline-block;
      min-width: 6mm;
      text-align: center;
      border-bottom: 1px solid var(--color-text);
    }

    .date-box--year {
      min-width: 10mm;
    }

    .print-footer {
      text-align: center;
      font-size: 6.5pt;
      color: var(--color-text-muted);
      flex-shrink: 0;
      padding-top: 1mm;
    }

    @media print {
      body { background: #fff; }

      .print-sheet {
        width: auto;
        min-height: auto;
        margin: 0;
      }

      .print-page {
        width: auto;
        min-height: 277mm;
        height: 277mm;
        padding: 0;
        box-shadow: none;
        page-break-after: avoid;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="print-sheet">
    <div class="print-page">
      ${buildLetterheadHtml()}
      <div class="print-page__body">
        ${buildPatientDataHtml(client)}
        ${buildQuestionnaireHtml()}
        ${buildDatesAndSignaturesHtml(client)}
        <footer class="print-footer">
          CTAD — Comunidade Terapêutica Amparados por Deus
        </footer>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  async function resolvePhotoDataUrl(photoPath) {
    if (!photoPath) return null;
    try {
      const res = await fetch(`/uploads/${photoPath}`, { credentials: 'include' });
      if (!res.ok) return null;
      const blob = await res.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  }

  function openPrintWindow(html) {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');

    if (!printWindow) {
      URL.revokeObjectURL(url);
      window.alert('Permita pop-ups neste site para imprimir a ficha do paciente.');
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

  async function open(client) {
    if (!client) return;
    const photoDataUrl = await resolvePhotoDataUrl(client.photoPath);
    openPrintWindow(buildPrintDocument({ ...client, photoDataUrl }));
  }

  return { open };
})();

window.PatientPrint = PatientPrint;
