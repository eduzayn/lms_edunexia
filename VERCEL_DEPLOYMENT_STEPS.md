# Edunexia LMS - Passos para Implantação no Vercel

Este guia fornece instruções passo a passo para implantar a plataforma Edunexia LMS no Vercel usando a integração com GitHub.

## Pré-requisitos

Antes de implantar, certifique-se de ter:

1. Uma conta no Vercel (cadastre-se em https://vercel.com se necessário)
2. Acesso ao repositório GitHub (https://github.com/eduzayn/lms_edunexia)
3. Projeto Supabase com as tabelas e configurações necessárias
4. Chaves de API necessárias para serviços de terceiros

## Passos para Implantação

### 1. Conectar o Repositório GitHub ao Vercel

1. Faça login na sua conta do Vercel
2. Clique em "Add New" > "Project"
3. Selecione o repositório GitHub "eduzayn/lms_edunexia"
4. Clique em "Import"

### 2. Configurar as Definições do Projeto

1. Preset de Framework: Selecione "Next.js"
2. Diretório Raiz: Deixe como padrão (/)
3. Comando de Build: Use o padrão (`npm run build`)
4. Diretório de Saída: Use o padrão (`.next`)
5. Comando de Instalação: Use o padrão (`npm install`)

### 3. Configurar Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente:

```
NEXT_PUBLIC_SUPABASE_URL=https://uasnyifizdjxogowijip.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpanlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2NzY0NTcsImV4cCI6MjAzMTI1MjQ1N30.Gy8Uj8Ck-Hs9Ij9HFLPmAU9EgxEjCnYKdYtKD_8-Yjc
DATABASE_URL=postgresql://postgres:EDUNEXIA2028@db.uasnyifizdjxogowijip.supabase.co:5432/postgres
OPENAI_API_KEY=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
```

### 4. Implantar

1. Clique em "Deploy"
2. Aguarde a conclusão da implantação
3. Após a implantação, o Vercel fornecerá uma URL para acessar sua aplicação

## Testando a Implantação

Após a implantação, você deve testar as seguintes funcionalidades:

1. **Autenticação**
   - Registro de usuário
   - Login de usuário
   - Redefinição de senha

2. **Portal do Aluno**
   - Acesso ao curso
   - Acompanhamento de progresso
   - Interação com o tutor de IA
   - Gestão financeira

3. **Portal do Administrador**
   - Gerenciamento de usuários
   - Gerenciamento de cursos
   - Criação de conteúdo
   - Painel de análise

4. **Integração de Vídeo**
   - Geração de vídeo
   - Associação de curso/aula
   - Mecanismo de feedback
   - Processamento em segundo plano

## Solução de Problemas

Se você encontrar problemas durante a implantação:

1. Verifique os logs de build para erros
2. Verifique se todas as variáveis de ambiente estão configuradas corretamente
3. Certifique-se de que o projeto Supabase esteja configurado corretamente
4. Verifique se todas as chaves de API são válidas e têm as permissões necessárias

## Implantação Contínua

O Vercel implanta automaticamente as alterações quando novos commits são enviados para a branch principal. Para acionar manualmente uma implantação:

1. Vá para o painel do projeto no Vercel
2. Clique em "Deployments"
3. Clique em "Redeploy" na implantação que você deseja reconstruir

## Configuração de Domínio Personalizado

Para configurar um domínio personalizado:

1. Vá para as configurações do projeto no Vercel
2. Clique em "Domains"
3. Adicione seu domínio personalizado
4. Siga as instruções para verificar a propriedade do domínio e configurar as definições de DNS
