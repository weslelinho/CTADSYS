const DEFAULT_PAGE_CONTENT = [
  { key: 'meta.description', section: 'Meta', label: 'Descrição (SEO)', content: 'CTAD - Comunidade Terapêutica Amparados por Deus. Tratamento e acolhimento para dependência química.' },
  { key: 'page.title', section: 'Meta', label: 'Título da página', content: 'CTAD — Comunidade Terapêutica Amparados por Deus' },

  { key: 'hero.badge', section: 'Hero', label: 'Badge', content: 'Comunidade Terapêutica' },
  { key: 'hero.titleLine1', section: 'Hero', label: 'Título (linha 1)', content: 'Amparados por Deus,' },
  { key: 'hero.titleLine2', section: 'Hero', label: 'Título (linha 2 — destaque)', content: 'restaurando vidas' },
  { key: 'hero.subtitle', section: 'Hero', label: 'Subtítulo', content: 'A CTAD é uma comunidade terapêutica dedicada ao acolhimento, tratamento e reintegração de pessoas em recuperação da dependência química — com amor, disciplina e fé.' },
  { key: 'hero.ctaPrimary', section: 'Hero', label: 'Botão primário', content: 'Conheça a CTAD' },
  { key: 'hero.ctaSecondary', section: 'Hero', label: 'Botão secundário', content: 'Fale Conosco' },
  { key: 'hero.stat1.number', section: 'Hero', label: 'Estatística 1 — valor', content: '24h' },
  { key: 'hero.stat1.label', section: 'Hero', label: 'Estatística 1 — legenda', content: 'Acolhimento contínuo' },
  { key: 'hero.stat2.number', section: 'Hero', label: 'Estatística 2 — valor', content: '100%' },
  { key: 'hero.stat2.label', section: 'Hero', label: 'Estatística 2 — legenda', content: 'Compromisso com a vida' },
  { key: 'hero.stat3.number', section: 'Hero', label: 'Estatística 3 — valor', content: '∞' },
  { key: 'hero.stat3.label', section: 'Hero', label: 'Estatística 3 — legenda', content: 'Esperança renovada' },

  { key: 'login.title', section: 'Login', label: 'Título do card', content: 'Sistema de Cadastro' },
  { key: 'login.text', section: 'Login', label: 'Texto do card', content: 'Área restrita para equipe autorizada. Informe usuário e senha para acessar o cadastro de clientes.' },
  { key: 'login.footer', section: 'Login', label: 'Rodapé do card', content: 'Apenas administradores e equipe autorizada têm acesso ao sistema interno.' },

  { key: 'about.quote', section: 'Sobre', label: 'Citação bíblica', content: '"Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz e não de mal, para vos dar o fim que esperais."' },
  { key: 'about.quoteCite', section: 'Sobre', label: 'Referência da citação', content: '— Jeremias 29:11' },
  { key: 'about.label', section: 'Sobre', label: 'Rótulo da seção', content: 'Quem Somos' },
  { key: 'about.title', section: 'Sobre', label: 'Título', content: 'Comunidade Terapêutica Amparados por Deus' },
  { key: 'about.paragraph1', section: 'Sobre', label: 'Parágrafo 1', content: 'A CTAD nasceu da convicção de que toda vida tem valor e que a recuperação é possível quando há acolhimento, estrutura e amor incondicional.' },
  { key: 'about.paragraph2', section: 'Sobre', label: 'Parágrafo 2', content: 'Oferecemos um ambiente seguro e disciplinado, onde cada pessoa é tratada com dignidade e recebe o suporte necessário para reconstruir sua história.' },
  { key: 'about.list1', section: 'Sobre', label: 'Lista — item 1', content: 'Acolhimento 24 horas' },
  { key: 'about.list2', section: 'Sobre', label: 'Lista — item 2', content: 'Tratamento baseado em comunidade terapêutica' },
  { key: 'about.list3', section: 'Sobre', label: 'Lista — item 3', content: 'Acompanhamento espiritual e emocional' },
  { key: 'about.list4', section: 'Sobre', label: 'Lista — item 4', content: 'Reintegração social e familiar' },

  { key: 'services.label', section: 'Serviços', label: 'Rótulo da seção', content: 'Nossos Serviços' },
  { key: 'services.title', section: 'Serviços', label: 'Título', content: 'Cuidado integral na recuperação' },
  { key: 'services.desc', section: 'Serviços', label: 'Descrição introdutória', content: 'Trabalhamos de forma multidisciplinar para garantir que cada pessoa receba o suporte necessário em todas as dimensões da vida.' },
  { key: 'services.feature1.title', section: 'Serviços', label: 'Card 1 — título', content: 'Acolhimento' },
  { key: 'services.feature1.text', section: 'Serviços', label: 'Card 1 — texto', content: 'Recepção imediata e ambiente seguro para quem busca uma nova chance de vida.' },
  { key: 'services.feature2.title', section: 'Serviços', label: 'Card 2 — título', content: 'Tratamento Terapêutico' },
  { key: 'services.feature2.text', section: 'Serviços', label: 'Card 2 — texto', content: 'Programa estruturado com rotina, responsabilidades compartilhadas e autoconhecimento.' },
  { key: 'services.feature3.title', section: 'Serviços', label: 'Card 3 — título', content: 'Apoio Espiritual' },
  { key: 'services.feature3.text', section: 'Serviços', label: 'Card 3 — texto', content: 'Fortalecimento da fé como pilar fundamental no processo de transformação pessoal.' },
  { key: 'services.feature4.title', section: 'Serviços', label: 'Card 4 — título', content: 'Reintegração Familiar' },
  { key: 'services.feature4.text', section: 'Serviços', label: 'Card 4 — texto', content: 'Trabalho conjunto com famílias para restaurar vínculos e construir uma rede de apoio.' },
  { key: 'services.feature5.title', section: 'Serviços', label: 'Card 5 — título', content: 'Capacitação Profissional' },
  { key: 'services.feature5.text', section: 'Serviços', label: 'Card 5 — texto', content: 'Desenvolvimento de habilidades e preparação para o retorno ao mercado de trabalho.' },
  { key: 'services.feature6.title', section: 'Serviços', label: 'Card 6 — título', content: 'Acompanhamento Pós-Alta' },
  { key: 'services.feature6.text', section: 'Serviços', label: 'Card 6 — texto', content: 'Suporte contínuo após a alta para manter a sobriedade e prevenir recaídas.' },

  { key: 'cta.title', section: 'Chamada', label: 'Título', content: 'Precisa de ajuda?' },
  { key: 'cta.text', section: 'Chamada', label: 'Texto', content: 'Não espere mais. Entre em contato conosco e dê o primeiro passo em direção à sua recuperação.' },
  { key: 'cta.button', section: 'Chamada', label: 'Texto do botão', content: 'Entrar em Contato' },

  { key: 'footer.desc', section: 'Rodapé', label: 'Descrição', content: 'Comunidade Terapêutica Amparados por Deus — dedicada ao acolhimento e tratamento de pessoas em recuperação da dependência química.' },
  { key: 'footer.email', section: 'Rodapé', label: 'E-mail de contato', content: 'contato@ctad.org.br' },
  { key: 'footer.phone', section: 'Rodapé', label: 'Telefone de contato', content: '(00) 0000-0000' },
  { key: 'footer.copyright', section: 'Rodapé', label: 'Copyright', content: '© 2026 CTAD — Comunidade Terapêutica Amparados por Deus. Todos os direitos reservados.' },
];

function initializePageContentTable(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS page_contents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_key TEXT UNIQUE NOT NULL,
      section TEXT NOT NULL,
      label TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      updated_by INTEGER,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (updated_by) REFERENCES users(id)
    );
  `);

  const insert = db.prepare(`
    INSERT OR IGNORE INTO page_contents (content_key, section, label, content)
    VALUES (@key, @section, @label, @content)
  `);

  const insertMany = db.transaction((items) => {
    items.forEach((item) => insert.run(item));
  });

  insertMany(DEFAULT_PAGE_CONTENT);
}

module.exports = { initializePageContentTable, DEFAULT_PAGE_CONTENT };
