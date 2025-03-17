# Guia de Contribuição

Obrigado por considerar contribuir com o EdunexIA! Este documento fornece diretrizes para garantir um processo de contribuição eficiente e consistente.

## Fluxo de Trabalho

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. Faça commit das suas mudanças (`git commit -m 'feat(escopo): descrição'`)
4. Push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

## Padrões de Código

### Commits

Seguimos o padrão Conventional Commits:

- `feat(escopo): descrição` - Nova funcionalidade
- `fix(escopo): descrição` - Correção de bug
- `docs(escopo): descrição` - Documentação
- `style(escopo): descrição` - Formatação, ponto e vírgula, etc.
- `refactor(escopo): descrição` - Refatoração de código
- `test(escopo): descrição` - Testes
- `chore(escopo): descrição` - Tarefas de manutenção

### TypeScript

- Use tipos explícitos ao invés de `any`
- Defina interfaces para props de componentes
- Evite type assertions (`as`)
- Use enums para valores constantes

### React/Next.js

- Use componentes funcionais
- Evite uso excessivo de `use client`
- Prefira Server Components quando possível
- Use Suspense para carregamento
- Implemente tratamento de erros com Error Boundaries

### Estilização

- Use Tailwind CSS para estilos
- Siga o padrão mobile-first
- Mantenha classes organizadas e legíveis
- Use variáveis CSS para valores reutilizáveis

### Testes

- Escreva testes para novas funcionalidades
- Mantenha cobertura de testes existente
- Use mocks apropriadamente
- Teste casos de erro

## Revisão de Código

- Descreva claramente as mudanças no PR
- Inclua screenshots para mudanças visuais
- Responda a feedbacks prontamente
- Mantenha PRs focados e concisos

## Configuração de Desenvolvimento

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Recursos Úteis

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação do Supabase](https://supabase.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org)

## Dúvidas

Se tiver dúvidas, abra uma issue ou contate a equipe de desenvolvimento. 