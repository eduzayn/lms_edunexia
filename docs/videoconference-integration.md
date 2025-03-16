# Integração de Videoconferência

Este documento descreve a implementação da funcionalidade de videoconferência no LMS Edunexia, incluindo a integração com Zoom, Microsoft Teams e BigBlueButton, bem como recursos de agendamento de aulas, gravação e controle de presença.

## Visão Geral

A integração de videoconferência permite que professores e alunos participem de aulas virtuais síncronas, com suporte para:

- Múltiplas plataformas (Zoom, Microsoft Teams, BigBlueButton)
- Agendamento de aulas únicas ou recorrentes
- Gravação automática de aulas
- Controle de presença dos participantes
- Associação de videoconferências a cursos específicos

## Estrutura do Banco de Dados

A funcionalidade de videoconferência utiliza as seguintes tabelas no banco de dados:

### Tabela `videoconference_platforms`

Armazena informações sobre as plataformas de videoconferência disponíveis.

```sql
CREATE TABLE videoconference_platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  api_key TEXT,
  api_secret TEXT,
  additional_config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela `videoconference_meetings`

Armazena informações sobre as reuniões/aulas agendadas.

```sql
CREATE TABLE videoconference_meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  platform_id UUID REFERENCES videoconference_platforms(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meeting_id VARCHAR(255),
  meeting_url TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern VARCHAR(50),
  status VARCHAR(50) DEFAULT 'scheduled',
  password VARCHAR(255),
  additional_settings JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela `videoconference_recordings`

Armazena informações sobre as gravações das aulas.

```sql
CREATE TABLE videoconference_recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES videoconference_meetings(id) ON DELETE CASCADE,
  title VARCHAR(255),
  url TEXT NOT NULL,
  platform_recording_id VARCHAR(255),
  duration INTEGER,
  size BIGINT,
  format VARCHAR(50),
  status VARCHAR(50) DEFAULT 'available',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabela `videoconference_attendance`

Armazena informações sobre a presença dos participantes nas aulas.

```sql
CREATE TABLE videoconference_attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES videoconference_meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  join_time TIMESTAMP WITH TIME ZONE,
  leave_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  status VARCHAR(50) DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Serviço de Videoconferência

O serviço de videoconferência (`videoconference-service.ts`) implementa a lógica para interagir com as diferentes plataformas de videoconferência. O serviço segue o padrão Singleton e fornece métodos para:

- Listar plataformas disponíveis
- Criar, atualizar e excluir reuniões
- Iniciar e encerrar reuniões
- Gerenciar gravações
- Rastrear presença dos participantes

### Integração com Zoom

A integração com o Zoom utiliza o SDK oficial do Zoom para Node.js (`@zoom/videosdk`) e a API REST do Zoom. A autenticação é feita usando JWT (JSON Web Token) com a chave API e o segredo fornecidos nas configurações da plataforma.

### Integração com Microsoft Teams

A integração com o Microsoft Teams utiliza o Microsoft Graph API Client (`@microsoft/microsoft-graph-client`) para interagir com a API do Microsoft Graph. A autenticação é feita usando OAuth 2.0 com as credenciais do aplicativo Microsoft registrado.

### Integração com BigBlueButton

A integração com o BigBlueButton utiliza a biblioteca `bigbluebutton-js` para interagir com a API do BigBlueButton. A autenticação é feita usando a chave secreta compartilhada configurada no servidor BigBlueButton.

## API Endpoints

A funcionalidade de videoconferência expõe os seguintes endpoints de API:

### Plataformas

- `GET /api/videoconference/platforms` - Lista todas as plataformas de videoconferência disponíveis

### Reuniões

- `GET /api/videoconference/meetings` - Lista todas as reuniões
- `POST /api/videoconference/meetings` - Cria uma nova reunião
- `GET /api/videoconference/meetings/:id` - Obtém detalhes de uma reunião específica
- `PUT /api/videoconference/meetings/:id` - Atualiza uma reunião existente
- `DELETE /api/videoconference/meetings/:id` - Exclui uma reunião

### Gravações

- `GET /api/videoconference/recordings` - Lista todas as gravações
- `GET /api/videoconference/recordings/:meetingId` - Lista gravações de uma reunião específica

### Presença

- `GET /api/videoconference/attendance/:meetingId` - Lista registros de presença para uma reunião específica
- `POST /api/videoconference/attendance` - Registra a presença de um participante

## Componentes de Interface

A funcionalidade de videoconferência inclui os seguintes componentes de interface:

### Para Professores

- Lista de videoconferências agendadas
- Formulário de criação/edição de videoconferência
- Detalhes da videoconferência
- Visualização de gravações
- Relatório de presença

### Para Alunos

- Lista de videoconferências disponíveis
- Detalhes da videoconferência
- Acesso às gravações
- Visualização do próprio registro de presença

## Fluxo de Trabalho

### Agendamento de Aulas

1. O professor acessa a página de videoconferências
2. Clica em "Criar Nova Videoconferência"
3. Preenche o formulário com título, descrição, plataforma, curso (opcional), data/hora de início e término
4. Opcionalmente, configura a reunião como recorrente e seleciona o padrão de recorrência
5. Salva a videoconferência

### Participação em Aulas

1. O professor ou aluno acessa a página de videoconferências
2. Visualiza a lista de videoconferências agendadas
3. Quando a videoconferência estiver disponível (status "em andamento"), clica em "Participar"
4. É redirecionado para a URL da reunião na plataforma selecionada

### Acesso às Gravações

1. Após a conclusão da videoconferência, as gravações são processadas automaticamente
2. O professor ou aluno acessa a página de detalhes da videoconferência
3. Clica em "Ver Gravações"
4. Visualiza a lista de gravações disponíveis e pode reproduzi-las diretamente na plataforma

### Controle de Presença

1. Durante a videoconferência, a presença dos participantes é registrada automaticamente
2. O professor pode acessar o relatório de presença na página de detalhes da videoconferência
3. O professor pode editar o status de presença dos participantes (presente, ausente, atrasado, justificado)
4. Os alunos podem visualizar seu próprio registro de presença

## Considerações de Segurança

- As credenciais das plataformas de videoconferência são armazenadas de forma segura no banco de dados
- O acesso às reuniões é controlado por políticas de Row Level Security (RLS) no Supabase
- As senhas das reuniões são opcionais para maior segurança
- Os links de reunião são gerados dinamicamente e incluem tokens de autenticação quando necessário

## Limitações e Considerações Futuras

- A integração atual suporta apenas as funcionalidades básicas de cada plataforma
- Funcionalidades avançadas como salas simultâneas (breakout rooms) podem ser implementadas no futuro
- A integração com outras plataformas de videoconferência pode ser adicionada posteriormente
- O suporte para transmissão ao vivo (streaming) pode ser implementado em versões futuras
