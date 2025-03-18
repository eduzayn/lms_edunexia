-- Alterar a tabela users para usar UUID
ALTER TABLE users
ALTER COLUMN id TYPE UUID USING (uuid_generate_v4());

-- Tabela de Avaliações
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('quiz', 'exam', 'assignment')),
    due_date TIMESTAMP WITH TIME ZONE,
    max_score DECIMAL(5,2),
    passing_score DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Submissões
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT,
    score DECIMAL(5,2),
    feedback TEXT,
    status TEXT NOT NULL CHECK (status IN ('draft', 'submitted', 'graded')),
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Materiais do Curso
CREATE TABLE IF NOT EXISTS course_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('document', 'video', 'audio', 'link')),
    content_url TEXT,
    file_path TEXT,
    file_size BIGINT,
    duration INTEGER, -- em minutos para vídeos/áudios
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Mensagens do Chat
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Feedback
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('course', 'lesson', 'material', 'assessment')),
    target_id UUID NOT NULL, -- ID do item específico (curso, aula, material ou avaliação)
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Acompanhamento de Progresso
CREATE TABLE IF NOT EXISTS progress_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    material_id UUID REFERENCES course_materials(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_assessments_course_id ON assessments(course_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assessment_id ON submissions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_course_id ON course_materials(course_id);
CREATE INDEX IF NOT EXISTS idx_course_materials_lesson_id ON course_materials(lesson_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_course_id ON chat_messages(course_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_feedback_course_id ON feedback(course_id);
CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_user_id ON progress_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_course_id ON progress_tracking(course_id);

-- Políticas de Segurança (RLS)
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_tracking ENABLE ROW LEVEL SECURITY;

-- Políticas para Assessments
CREATE POLICY "Professores podem gerenciar avaliações"
    ON assessments FOR ALL
    USING (auth.uid() IN (
        SELECT user_id FROM profiles WHERE role = 'teacher'
    ));

CREATE POLICY "Alunos podem ver avaliações dos seus cursos"
    ON assessments FOR SELECT
    USING (course_id IN (
        SELECT course_id FROM enrollments WHERE user_id = auth.uid()
    ));

-- Políticas para Submissões
CREATE POLICY "Usuários podem ver suas próprias submissões"
    ON submissions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Usuários podem criar suas próprias submissões"
    ON submissions FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Professores podem avaliar submissões"
    ON submissions FOR UPDATE
    USING (auth.uid() IN (
        SELECT user_id FROM profiles WHERE role = 'teacher'
    ));

-- Políticas para Materiais do Curso
CREATE POLICY "Professores podem gerenciar materiais"
    ON course_materials FOR ALL
    USING (auth.uid() IN (
        SELECT user_id FROM profiles WHERE role = 'teacher'
    ));

CREATE POLICY "Alunos podem ver materiais dos seus cursos"
    ON course_materials FOR SELECT
    USING (course_id IN (
        SELECT course_id FROM enrollments WHERE user_id = auth.uid()
    ));

-- Políticas para Mensagens do Chat
CREATE POLICY "Usuários podem ver mensagens dos seus cursos"
    ON chat_messages FOR SELECT
    USING (course_id IN (
        SELECT course_id FROM enrollments WHERE user_id = auth.uid()
    ));

CREATE POLICY "Usuários podem enviar mensagens"
    ON chat_messages FOR INSERT
    WITH CHECK (sender_id = auth.uid());

-- Políticas para Feedback
CREATE POLICY "Usuários podem ver seus próprios feedbacks"
    ON feedback FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Usuários podem criar feedbacks"
    ON feedback FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Políticas para Acompanhamento de Progresso
CREATE POLICY "Usuários podem ver seu próprio progresso"
    ON progress_tracking FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Usuários podem atualizar seu próprio progresso"
    ON progress_tracking FOR UPDATE
    USING (user_id = auth.uid()); 