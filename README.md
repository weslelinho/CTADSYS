# CTAD Sys 🏥

Client register of drug addict clinic called Comunidade Terapêutica Amparados por Deus.

## 📦 Instalação

```bash
npm install
npm run dev
```

## 🚀 Estrutura do Projeto

```
ctad_sys/
├── src/
│   ├── config/           # Configurações (DB, Auth)
│   ├── controllers/      # Controle de rotas
│   ├── middleware/       # Middleware (auth, error)
│   ├── models/           # Modelos de dados
│   ├── routes/           # Rotas API
│   ├── services/         # Lógica de negócio
│   └── repositories/     # Acesso ao DB SQLite
├── database.sqlite
└── server.js
```

## 🔐 Autenticação

- Google OAuth 2.0 (administradores)
- Role: `admin` / `user`
- Sessões JWT

## 🛠️ Deploy Local

```bash
npm install
cp .env.example .env
# Configure as variáveis .env
npm run dev
```

---