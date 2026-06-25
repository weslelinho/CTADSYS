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

  function tableRow(labelText, value) {
    return `
      <tr>
        <th>${escapeHtml(labelText)}</th>
        <td>${escapeHtml(value ?? '—')}</td>
      </tr>`;
  }

  function tableRowWide(labelText, value) {
    return `
      <tr class="data-table__row--wide">
        <th>${escapeHtml(labelText)}</th>
        <td>${escapeHtml(value ?? '—')}</td>
      </tr>`;
  }

  function tableRowPair(label1, value1, label2, value2) {
    return `
      <tr class="data-table__row--pair">
        <th>${escapeHtml(label1)}</th>
        <td>${escapeHtml(value1 ?? '—')}</td>
        <th>${escapeHtml(label2)}</th>
        <td>${escapeHtml(value2 ?? '—')}</td>
      </tr>`;
  }

  function yesNoOptions() {
    return '<span class="yn-option">(&nbsp;) Sim</span><span class="yn-option">(&nbsp;) Não</span>';
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

  function buildPatientTablesHtml(client) {
    const filhos =
      client.numeroFilhos !== null && client.numeroFilhos !== undefined ? client.numeroFilhos : '—';

    return `
      <div class="data-sections">
        <table class="data-table">
          <caption>Documentação</caption>
          <tbody>
            ${tableRow('CPF', client.cpf)}
            ${tableRow('RG', client.rg)}
            ${tableRow('Órgão expedidor', client.orgaoExpedidor)}
            ${tableRow('Data de emissão (RG)', formatDate(client.dataEmissao))}
            ${tableRow('Título de eleitor', client.tituloEleitor)}
          </tbody>
        </table>

        <table class="data-table">
          <caption>Dados pessoais</caption>
          <tbody>
            ${tableRow('Data de nascimento', formatDate(client.birthDate))}
            ${tableRow('Sexo', label(client.sexo, SEXO_LABELS))}
            ${tableRow('Naturalidade', client.naturalidade)}
            ${tableRow('Estado civil', label(client.estadoCivil, ESTADO_CIVIL_LABELS))}
            ${tableRow('Escolaridade', label(client.escolaridade, ESCOLARIDADE_LABELS))}
            ${tableRow('Profissão', client.profissao)}
            ${tableRow('Trabalha', boolLabel(client.trabalha))}
            ${tableRow('Número de filhos', filhos)}
          </tbody>
        </table>

        <table class="data-table data-table--full">
          <caption>Filiação</caption>
          <tbody>
            ${tableRowWide('Pai', client.filiacaoPai)}
            ${tableRowWide('Mãe', client.filiacaoMae)}
          </tbody>
        </table>

        <table class="data-table data-table--full">
          <caption>Contato e endereço</caption>
          <tbody>
            ${tableRowPair('Telefone', client.phone, 'E-mail', client.email)}
            ${tableRowWide('Endereço', client.address)}
            ${tableRowPair('Cidade', client.city, 'Estado', client.state)}
          </tbody>
        </table>
      </div>`;
  }

  function buildQuestionnaireBlock(items) {
    return items
      .map((item) => {
        if (item.type === 'yn') return questionYesNo(item.text);
        return questionLine(item.text);
      })
      .join('');
  }

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

  function buildQuestionnaireHtml(items) {
    return `
      <section class="questionnaire">
        <h2 class="section-title">Questionário</h2>
        <ol class="question-list">
          ${buildQuestionnaireBlock(items)}
        </ol>
      </section>`;
  }

  function buildDatesAndSignaturesHtml(client) {
    const arrival = formatDateParts(client.admissionDate);
    const exit = formatDateParts(client.exitDate);

    return `
      <div class="closing-block">
        <div class="stay-dates">
          <p class="stay-dates__item">
            <span class="stay-dates__label">Data de chegada</span>
            <span class="date-field">
              <span class="date-box">${escapeHtml(arrival.day)}</span> /
              <span class="date-box">${escapeHtml(arrival.month)}</span> /
              <span class="date-box date-box--year">${escapeHtml(arrival.year)}</span>
            </span>
          </p>
          <p class="stay-dates__item">
            <span class="stay-dates__label">Data de saída</span>
            <span class="date-field">
              <span class="date-box">${escapeHtml(exit.day)}</span> /
              <span class="date-box">${escapeHtml(exit.month)}</span> /
              <span class="date-box date-box--year">${escapeHtml(exit.year)}</span>
            </span>
          </p>
        </div>

        <div class="signatures">
          <p class="signature-line"><span>Ass. do aluno</span><span class="fill-line"></span></p>
          <p class="signature-line"><span>Ass. do responsável</span><span class="fill-line"></span></p>
          <p class="signature-line"><span>Ass. do obreiro CTAD</span><span class="fill-line"></span></p>
        </div>
      </div>`;
  }

  function buildLetterheadHtml(client, compact) {
    const logoUrl = `${window.location.origin}/images/logo.png`;
    const generatedAt = new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    if (compact) {
      return `
        <header class="letterhead letterhead--compact">
          <img src="${logoUrl}" alt="CTAD" class="letterhead__logo">
          <div class="letterhead__content">
            <p class="letterhead__org">Comunidade Terapêutica Amparados por Deus</p>
            <h1 class="letterhead__title">Ficha de Cadastro — continuação</h1>
          </div>
        </header>`;
    }

    return `
      <header class="letterhead">
        <img src="${logoUrl}" alt="CTAD" class="letterhead__logo">
        <p class="letterhead__org">Comunidade Terapêutica Amparados por Deus</p>
        <h1 class="letterhead__title">Ficha de Cadastro do Paciente</h1>
        <div class="letterhead__meta">
          <p>Documento gerado em ${escapeHtml(generatedAt)}</p>
        </div>
      </header>`;
  }

  function buildPrintDocument(client) {
    const page1Questions = QUESTIONNAIRE_ITEMS.slice(0, 4);
    const page2Questions = QUESTIONNAIRE_ITEMS.slice(4);

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
      --color-bg-muted: #f2f7f5;
      --page-height: 277mm;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    @page {
      size: A4 portrait;
      margin: 10mm 12mm 10mm;
    }

    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      color: var(--color-text);
      line-height: 1.4;
      font-size: 10pt;
      background: #e8ecea;
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

    .print-sheet {
      width: 210mm;
      margin: 0 auto;
    }

    .print-page {
      width: 210mm;
      min-height: var(--page-height);
      background: #fff;
      padding: 0 12mm 10mm;
      display: flex;
      flex-direction: column;
      page-break-after: always;
      break-after: page;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      margin-bottom: 12px;
    }

    .print-page:last-child {
      page-break-after: auto;
      break-after: auto;
      margin-bottom: 0;
    }

    .print-page__body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }

    .print-page__fill {
      flex: 1;
      min-height: 0.5rem;
    }

    /* Letterhead */
    .letterhead {
      text-align: center;
      padding: 4mm 0 3mm;
      border-bottom: 2.5px solid var(--color-primary);
      margin-bottom: 3mm;
      flex-shrink: 0;
    }

    .letterhead--compact {
      display: flex;
      align-items: center;
      gap: 3mm;
      text-align: left;
      padding: 3mm 0 2.5mm;
    }

    .letterhead--compact .letterhead__logo {
      width: 48px;
      margin: 0;
    }

    .letterhead--compact .letterhead__title {
      font-size: 0.95rem;
      margin-bottom: 0;
    }

    .letterhead__logo {
      width: 72px;
      height: auto;
      margin: 0 auto 1.5mm;
      display: block;
    }

    .letterhead__org {
      font-size: 8pt;
      color: var(--color-text-muted);
      margin-bottom: 1mm;
    }

    .letterhead__title {
      font-size: 13pt;
      font-weight: 800;
      color: var(--color-primary-dark);
      margin-bottom: 2mm;
    }

    .letterhead__meta {
      font-size: 8pt;
      color: var(--color-text-muted);
    }

    .letterhead__meta p + p {
      margin-top: 0.5mm;
    }

    /* Patient hero */
    .patient-hero {
      display: flex;
      gap: 4mm;
      align-items: stretch;
      padding: 3mm;
      background: var(--color-bg-muted);
      border: 1px solid var(--color-border);
      border-radius: 3px;
    }

    .patient-photo {
      width: 28mm;
      height: 36mm;
      object-fit: cover;
      border: 1.5px solid var(--color-border);
      border-radius: 2px;
      flex-shrink: 0;
      background: #fff;
    }

    .patient-photo--empty {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 7.5pt;
      color: var(--color-text-muted);
      text-align: center;
      line-height: 1.3;
    }

    .patient-hero__info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2mm;
    }

    .patient-hero__name {
      font-size: 12pt;
      font-weight: 800;
      color: var(--color-primary-dark);
      line-height: 1.2;
    }

    /* Data tables */
    .data-sections {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2.5mm;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
      border: 1px solid var(--color-border);
    }

    .data-table--full {
      grid-column: 1 / -1;
    }

    .data-table caption {
      caption-side: top;
      text-align: left;
      font-size: 8pt;
      font-weight: 700;
      color: var(--color-primary-dark);
      padding: 1.5mm 2mm;
      background: #e8f2ef;
      border: 1px solid var(--color-border);
      border-bottom: none;
    }

    .data-table th,
    .data-table td {
      border: 1px solid var(--color-border);
      padding: 1.8mm 2.5mm;
      vertical-align: top;
      text-align: left;
    }

    .data-table th {
      width: 38%;
      font-weight: 600;
      color: var(--color-text-muted);
      background: #fafcfc;
      font-size: 7.5pt;
    }

    .data-table td {
      font-weight: 500;
      word-break: break-word;
    }

    .data-table__row--wide th {
      width: 18%;
    }

    .data-table__row--pair th {
      width: 14%;
    }

    .data-table__row--pair td {
      width: 36%;
    }

    /* Questionnaire */
    .section-title {
      font-size: 10pt;
      font-weight: 700;
      color: var(--color-primary-dark);
      padding: 1.5mm 0;
      border-bottom: 1.5px solid var(--color-primary);
      margin-bottom: 2mm;
    }

    .questionnaire {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .questionnaire--page2 {
      flex: 1;
    }

    .question-list {
      list-style: none;
      counter-reset: question;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1mm;
    }

    .question {
      counter-increment: question;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 2mm;
      padding: 2.5mm 0;
      border-bottom: 1px dotted var(--color-border);
      font-size: 9.5pt;
      min-height: 9mm;
    }

    .question::before {
      content: counter(question) ".";
      font-weight: 700;
      color: var(--color-primary-dark);
      min-width: 5mm;
      align-self: flex-start;
      padding-top: 0.5mm;
    }

    .question__text {
      flex: 1;
      min-width: 40%;
      align-self: flex-start;
      padding-top: 0.5mm;
    }

    .question--yn {
      align-items: center;
    }

    .question--yn .question__text {
      flex: 1;
    }

    .question__options {
      display: flex;
      gap: 5mm;
      white-space: nowrap;
      margin-left: auto;
    }

    .yn-option {
      font-size: 9pt;
    }

    .question--line {
      flex-direction: row;
      align-items: flex-end;
    }

    .question--line .question__text {
      flex: 0 1 auto;
      max-width: 55%;
    }

    .question--line .fill-line {
      flex: 1;
      min-width: 30mm;
    }

    .questionnaire--page2 .question {
      min-height: 11mm;
      padding: 3mm 0;
    }

    .questionnaire--page2 .question--line .fill-line {
      min-height: 7mm;
      border-bottom: 1px solid var(--color-text);
    }

    .fill-line {
      display: block;
      border-bottom: 1px solid var(--color-text);
      min-height: 5mm;
    }

    /* Dates & signatures */
    .closing-block {
      margin-top: auto;
      padding-top: 4mm;
      flex-shrink: 0;
    }

    .stay-dates {
      display: flex;
      justify-content: space-between;
      gap: 6mm;
      padding: 4mm;
      margin-bottom: 6mm;
      border: 1px solid var(--color-border);
      background: var(--color-bg-muted);
      border-radius: 3px;
    }

    .stay-dates__item {
      flex: 1;
      font-size: 9.5pt;
    }

    .stay-dates__label {
      display: block;
      font-size: 7.5pt;
      font-weight: 700;
      color: var(--color-text-muted);
      text-transform: uppercase;
      margin-bottom: 2mm;
    }

    .date-field {
      font-size: 11pt;
      font-weight: 600;
    }

    .date-box {
      display: inline-block;
      min-width: 8mm;
      text-align: center;
      border-bottom: 1.5px solid var(--color-text);
      padding: 0 1mm;
    }

    .date-box--year {
      min-width: 14mm;
    }

    .signatures {
      display: flex;
      flex-direction: column;
      gap: 10mm;
      padding-top: 2mm;
    }

    .signature-line {
      display: flex;
      align-items: flex-end;
      gap: 3mm;
      font-size: 9.5pt;
    }

    .signature-line > span:first-child {
      white-space: nowrap;
      min-width: 38mm;
    }

    .signature-line .fill-line {
      flex: 1;
      min-height: 8mm;
    }

    .print-footer {
      margin-top: 4mm;
      padding-top: 2mm;
      border-top: 1px solid var(--color-border);
      text-align: center;
      font-size: 7pt;
      color: var(--color-text-muted);
      flex-shrink: 0;
    }

    @media print {
      body {
        background: #fff;
        font-size: 9.5pt;
      }

      .print-actions { display: none !important; }

      .print-sheet { width: auto; margin: 0; }

      .print-page {
        width: auto;
        min-height: var(--page-height);
        padding: 0;
        margin: 0;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <!--div class="print-actions">
    <button type="button" onclick="window.print()">Imprimir</button>
    <button type="button" onclick="window.close()">Fechar</button>
  </div-->

  <div class="print-sheet">
    <!-- Página 1: dados do paciente + início do questionário -->
    <div class="print-page">
      ${buildLetterheadHtml(client, false)}

      <div class="print-page__body">
        <div class="patient-hero">
          ${buildPhotoHtml(client)}
          <div class="patient-hero__info">
            <p class="patient-hero__name">${escapeHtml(client.fullName)}</p>
          </div>
        </div>

        ${buildPatientTablesHtml(client)}

        ${buildQuestionnaireHtml(page1Questions)}
      </div>
    </div>

    <!-- Página 2: questionário (continuação) + datas e assinaturas -->
    <div class="print-page">
      ${buildLetterheadHtml(client, true)}

      <div class="print-page__body">
        <div class="questionnaire questionnaire--page2">
          <h2 class="section-title">Questionário (continuação)</h2>
          <ol class="question-list" style="counter-reset: question 4">
            ${buildQuestionnaireBlock(page2Questions)}
          </ol>
        </div>

        <div class="print-page__fill"></div>

        ${buildDatesAndSignaturesHtml(client)}

        <footer class="print-footer">
          CTAD — Comunidade Terapêutica Amparados por Deus · Ficha de cadastro do paciente
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
      const logos = printWindow.document.querySelectorAll('.letterhead__logo');
      const pending = Array.from(logos).filter((logo) => !logo.complete);
      if (pending.length === 0) {
        setTimeout(triggerPrint, 300);
        return;
      }
      let loaded = 0;
      const onLogoDone = () => {
        loaded += 1;
        if (loaded >= pending.length) triggerPrint();
      };
      pending.forEach((logo) => {
        logo.addEventListener('load', onLogoDone, { once: true });
        logo.addEventListener('error', onLogoDone, { once: true });
      });
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
