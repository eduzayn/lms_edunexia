# Guia de Implantação do Edunexia LMS no Vercel

Este guia fornece instruções passo a passo para implantar o Edunexia LMS no Vercel.

## Pré-requisitos

- Conta no Vercel
- Acesso ao repositório GitHub do Edunexia LMS
- Node.js 18+ instalado localmente (para testes)

## Passos para Implantação

### 1. Instalar Dependências Faltantes

Certifique-se de que todas as dependências necessárias estão instaladas:

```bash
npm install lucide-react @radix-ui/react-tabs
```

### 2. Configurar Variáveis de Ambiente

As variáveis de ambiente já estão configuradas no arquivo `vercel.json`:

```json
{
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "https://uasnyifizdjxogowijip.supabase.co",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "DATABASE_URL": "postgresql://postgres:EDUNEXIA2028@db.uasnyifizdjxogowijip.supabase.co:5432/postgres",
    "OPENAI_API_KEY": "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"
  }
}
```

### 3. Implantar no Vercel

#### Opção 1: Implantação via Interface do Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "Add New" > "Project"
3. Importe o repositório GitHub do Edunexia LMS
4. Na configuração do projeto:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
5. Clique em "Deploy"

#### Opção 2: Implantação via CLI do Vercel

1. Instale a CLI do Vercel:
   ```bash
   npm install -g vercel
   ```

2. Faça login na sua conta Vercel:
   ```bash
   vercel login
   ```

3. Na raiz do projeto, execute:
   ```bash
   vercel
   ```

4. Siga as instruções na tela para configurar o projeto

### 4. Verificar a Implantação

Após a implantação, o Vercel fornecerá um URL para acessar o aplicativo implantado. Verifique se:

- A página inicial carrega corretamente
- O login/registro funciona
- A funcionalidade de tutoria de IA está operacional
- Os módulos financeiros estão funcionando

### 5. Configurar Domínio Personalizado (Opcional)

1. No painel do Vercel, vá para o projeto implantado
2. Clique em "Settings" > "Domains"
3. Adicione seu domínio personalizado e siga as instruções

## Solução de Problemas

### Erros de Compilação

Se encontrar erros de compilação relacionados a TypeScript ou ESLint:

1. Verifique se o arquivo `.eslintrc.json` está configurado corretamente:
   ```json
   {
     "extends": "next/core-web-vitals",
     "rules": {
       "@typescript-eslint/no-empty-object-type": "off",
       "@typescript-eslint/no-explicit-any": "warn",
       "react-hooks/exhaustive-deps": "warn",
       "react/no-unescaped-entities": "warn",
       "@next/next/no-img-element": "warn"
     }
   }
   ```

2. Execute `npm run lint` localmente para identificar e corrigir problemas antes da implantação

### Erros de Dependências

Se encontrar erros relacionados a dependências faltantes:

1. Verifique se todas as dependências estão listadas no `package.json`
2. Execute `npm install` para garantir que todas as dependências estão instaladas

## Recursos Adicionais

- [Documentação do Vercel](https://vercel.com/docs)
- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Supabase](https://supabase.io/docs)
