# LMS EdunexIA

Sistema de Gestão de Aprendizagem com Inteligência Artificial

## Variáveis de Ambiente

O projeto requer as seguintes variáveis de ambiente:

```env
# Supabase (Obrigatório)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Next Auth (Obrigatório)
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Database (Obrigatório)
DATABASE_URL=

# OpenAI (Opcional)
OPENAI_API_KEY=
```

Certifique-se de configurar todas as variáveis obrigatórias no seu ambiente local e no ambiente de produção.

## Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Construir para produção
pnpm build

# Iniciar servidor de produção
pnpm start
```

## Configuração do Ambiente

1. Configure as variáveis de ambiente no arquivo `.env`
2. Configure as mesmas variáveis no Vercel para deploy
3. Certifique-se que os nomes das variáveis estão exatamente iguais

## Tecnologias

- [Next.js 14](https://nextjs.org/)
- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Supabase](https://supabase.com/)

## Requisitos

- Node.js 18+
- npm ou yarn

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/edunexia-lms.git
cd edunexia-lms
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env.local
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

5. Acesse [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

```
src/
  ├── app/                # Rotas e páginas
  ├── components/         # Componentes React
  ├── contexts/          # Contextos React
  ├── lib/              # Utilitários e configurações
  └── types/            # Tipos TypeScript
```

## Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

## Licença

Este projeto está licenciado sob a licença MIT - consulte o arquivo [LICENSE](LICENSE) para obter detalhes.

## Deployment

Este projeto está configurado para deploy automático no Vercel.
