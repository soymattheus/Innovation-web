# Code Web

Aplicação web em Next.js para autenticação e navegação de catálogo de produtos com paginação infinita, ordenação, favoritos e detalhe em modal.

## Arquitetura

### Visão em camadas

1. Apresentação (`src/app`, `src/components`)

- Páginas App Router (`/`, `/login`, `/produtos`).
- Componentes de UI reutilizáveis (inputs, botão, checkbox, toast).
- Componentes específicos de domínio em `src/app/produtos`.

2. Estado e orquestração (`src/store`, `src/hook`, `src/app/providers.tsx`)

- `zustand` para estado global de usuário autenticado.
- `useAuth` para fluxo de login/logout e feedback de erro.
- `React Query` para cache, retry controlado, paginação e sincronização de dados.

3. Backend interno BFF (`src/app/api/**`)

- Rotas API do próprio Next (`/api/auth/login`, `/api/auth/logout`, `/api/produtos`).
- Controle de autenticação via cookie `httpOnly`.

4. Proteção de rotas (`src/proxy.ts`)

- Intercepta acesso a `/produtos/**`.
- Redireciona para `/login` quando não há token.

### Fluxo principal

1. Usuário acessa `/login`.
2. `POST /api/auth/login` valida credenciais e grava cookie de sessão.
3. App salva dados do usuário no store e navega para `/produtos`.
4. `/produtos` busca dados com paginação infinita (`useInfiniteQuery`).
5. Modal de detalhes é carregado sob demanda (code splitting).

## Tecnologias usadas e por que foram escolhidas

- `Next.js 16 (App Router)`: unifica frontend e API no mesmo projeto, simplifica deploy e manutenção.
- `React 19`: base de UI moderna com componentes e hooks.
- `TypeScript`: reduz erros em tempo de desenvolvimento e melhora evolução do código.
- `@tanstack/react-query`: resolve cache, loading, retry e infinite loading com menos código manual.
- `Zustand`: estado global simples e leve para dados de sessão do usuário.
- `react-hook-form` + `zod`: validação declarativa e tipada no formulário de login.
- `Tailwind CSS 4`: produtividade alta para estilização consistente e fácil manutenção.
- `ESLint`: padronização e prevenção de bugs comuns.
- `Docker` (multi-stage): build reproduzível, imagem menor e execução consistente em qualquer ambiente.

## Decisões de engenharia importantes

- **Code splitting**
  - `productDetailsModal` é carregado via `dynamic import` em `src/app/produtos/page.tsx`.
  - Benefício: reduz payload inicial da tela de produtos.

- **Modularização da tela de produtos**
  - Extração de componentes: `productsToolbar`, `productsSkeletonGrid`, `productsErrorState`.
  - Extração de utilitários/tipos: `products.utils.ts`, `products.types.ts`.
  - Benefício: menor acoplamento e manutenção mais simples.

- **Docker para produção**
  - `next.config.ts` com `output: "standalone"`.
  - `Dockerfile` multi-stage com runtime mínimo e usuário não-root.

## Estrutura de pastas

```txt
src/
  app/
    api/
      auth/
      produtos/
    login/
    produtos/
      page.tsx
      productCard.tsx
      productDetailsModal.tsx
      productsToolbar.tsx
      productsSkeletonGrid.tsx
      productsErrorState.tsx
      products.utils.ts
      products.types.ts
    providers.tsx
  components/
    toast/
  hook/
    auth.tsx
  store/
    user.ts
  proxy.ts
```

## Como rodar

### Local

```bash
npm npm install
npm run dev
```

Acesse: `http://localhost:3000`

### Docker

```bash
docker build -t code-web .
docker run --rm -p 3000:3000 code-web
```

## Status dos requisitos

### Atendidos

- Arquitetura em camadas com separação clara de responsabilidades.
- Login com proteção de rota privada.
- Listagem de produtos com paginação infinita.
- Ordenação e filtro de favoritos.
- Modal de detalhes do produto.
- Code splitting aplicado na tela de produtos.
- Dockerização da aplicação com imagem de produção.
- Código refatorado para maior legibilidade e manutenção.

### Pendente (conforme solicitado)

Os únicos requisitos não implementados são testes automatizados:

- 1–2 testes unitários (Vitest/Jest + React Testing Library) para componentes de UI.
- 1 smoke E2E (Playwright) que valide fluxo: login → ver grid.

## Scripts

- `npm run dev`: desenvolvimento.
- `npm run build`: build de produção.
- `npm run start`: sobe aplicação de produção.
- `npm run lint`: análise estática.
