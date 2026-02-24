# Code Web

Aplicação em Next.js (App Router) com autenticação, listagem de produtos e paginação infinita.

## Requisitos

- Node.js 22+
- npm 10+

## Rodando localmente

1. Instale dependências:
```bash
npm ci
```
2. Inicie em desenvolvimento:
```bash
npm run dev
```
3. Abra `http://localhost:3000`.

## Scripts

- `npm run dev`: sobe ambiente de desenvolvimento.
- `npm run lint`: executa lint.
- `npm run build`: gera build de produção.
- `npm run start`: inicia a aplicação em modo produção.

## Docker

### Build da imagem

```bash
docker build -t code-web .
```

### Rodar container

```bash
docker run --rm -p 3000:3000 --env-file .env.local code-web
```

A aplicação ficará disponível em `http://localhost:3000`.

## Estrutura relevante

- `src/app/produtos`: tela de produtos e componentes relacionados.
- `src/hook/auth.tsx`: fluxo de login/logout.
- `src/app/api`: rotas da API interna.
