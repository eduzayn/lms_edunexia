-- Create certificates schema
CREATE SCHEMA IF NOT EXISTS certificates;

-- Certificate templates
CREATE TABLE IF NOT EXISTS certificates.templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  html_template TEXT NOT NULL,
  css_style TEXT,
  background_image_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Issued certificates
CREATE TABLE IF NOT EXISTS certificates.issued_certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES academic.courses(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES certificates.templates(id) ON DELETE RESTRICT,
  certificate_number TEXT NOT NULL UNIQUE,
  verification_hash TEXT NOT NULL UNIQUE,
  issue_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Certificate verification logs
CREATE TABLE IF NOT EXISTS certificates.verification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_id UUID REFERENCES certificates.issued_certificates(id) ON DELETE CASCADE,
  verification_hash TEXT NOT NULL,
  verified_by TEXT,
  verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  is_valid BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT
);

-- Create gamification schema
CREATE SCHEMA IF NOT EXISTS gamification;

-- Achievements
CREATE TABLE IF NOT EXISTS gamification.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  achievement_type TEXT NOT NULL CHECK (achievement_type IN ('course_completion', 'assessment_score', 'login_streak', 'content_creation', 'forum_participation', 'custom')),
  criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements
CREATE TABLE IF NOT EXISTS gamification.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES gamification.achievements(id) ON DELETE CASCADE,
  achieved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Points transactions
CREATE TABLE IF NOT EXISTS gamification.points_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('achievement', 'course_completion', 'assessment_completion', 'login_streak', 'content_creation', 'forum_participation', 'custom')),
  reference_id UUID,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Levels
CREATE TABLE IF NOT EXISTS gamification.levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_number INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  icon TEXT,
  benefits JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User levels
CREATE TABLE IF NOT EXISTS gamification.user_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level_id UUID NOT NULL REFERENCES gamification.levels(id) ON DELETE CASCADE,
  current_points INTEGER NOT NULL DEFAULT 0,
  level_achieved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE certificates.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates.issued_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates.verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification.points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification.levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification.user_levels ENABLE ROW LEVEL SECURITY;

-- RLS policies for certificates.templates
CREATE POLICY "Templates are viewable by all authenticated users"
  ON certificates.templates
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Templates can be created by admins and teachers"
  ON certificates.templates
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Templates can be updated by admins and teachers"
  ON certificates.templates
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'teacher')
    )
  );

-- RLS policies for certificates.issued_certificates
CREATE POLICY "Certificates are viewable by their owners and admins/teachers"
  ON certificates.issued_certificates
  FOR SELECT
  USING (
    auth.uid() = student_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'teacher')
    )
  );

CREATE POLICY "Certificates can be created by the system"
  ON certificates.issued_certificates
  FOR INSERT
  WITH CHECK (true);

-- RLS policies for certificates.verification_logs
CREATE POLICY "Verification logs are viewable by admins"
  ON certificates.verification_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Verification logs can be created by anyone"
  ON certificates.verification_logs
  FOR INSERT
  WITH CHECK (true);

-- RLS policies for gamification.achievements
CREATE POLICY "Achievements are viewable by all authenticated users"
  ON gamification.achievements
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Achievements can be created by admins"
  ON gamification.achievements
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Achievements can be updated by admins"
  ON gamification.achievements
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS policies for gamification.user_achievements
CREATE POLICY "User achievements are viewable by their owners and admins"
  ON gamification.user_achievements
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "User achievements can be created by the system"
  ON gamification.user_achievements
  FOR INSERT
  WITH CHECK (true);

-- RLS policies for gamification.points_transactions
CREATE POLICY "Points transactions are viewable by their owners and admins"
  ON gamification.points_transactions
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Points transactions can be created by the system"
  ON gamification.points_transactions
  FOR INSERT
  WITH CHECK (true);

-- RLS policies for gamification.levels
CREATE POLICY "Levels are viewable by all authenticated users"
  ON gamification.levels
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Levels can be created by admins"
  ON gamification.levels
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Levels can be updated by admins"
  ON gamification.levels
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS policies for gamification.user_levels
CREATE POLICY "User levels are viewable by their owners and admins"
  ON gamification.user_levels
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "User levels can be created by the system"
  ON gamification.user_levels
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "User levels can be updated by the system"
  ON gamification.user_levels
  FOR UPDATE
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_issued_certificates_student_id ON certificates.issued_certificates(student_id);
CREATE INDEX idx_issued_certificates_course_id ON certificates.issued_certificates(course_id);
CREATE INDEX idx_issued_certificates_verification_hash ON certificates.issued_certificates(verification_hash);
CREATE INDEX idx_verification_logs_certificate_id ON certificates.verification_logs(certificate_id);
CREATE INDEX idx_verification_logs_verification_hash ON certificates.verification_logs(verification_hash);
CREATE INDEX idx_user_achievements_user_id ON gamification.user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON gamification.user_achievements(achievement_id);
CREATE INDEX idx_points_transactions_user_id ON gamification.points_transactions(user_id);
CREATE INDEX idx_user_levels_user_id ON gamification.user_levels(user_id);
CREATE INDEX idx_user_levels_level_id ON gamification.user_levels(level_id);

-- Insert default certificate template
INSERT INTO certificates.templates (name, description, html_template, css_style, is_default)
VALUES (
  'Template Padrão',
  'Template padrão para certificados de conclusão de curso',
  '<div class="certificate">
    <div class="header">
      <img src="{{logo_url}}" alt="Logo" class="logo" />
      <h1>CERTIFICADO DE CONCLUSÃO</h1>
    </div>
    <div class="content">
      <p class="recipient">Certificamos que <strong>{{student_name}}</strong></p>
      <p class="achievement">concluiu com êxito o curso <strong>{{course_name}}</strong></p>
      <p class="details">com carga horária de <strong>{{course_hours}} horas</strong>, concluído em <strong>{{completion_date}}</strong>.</p>
    </div>
    <div class="footer">
      <div class="signature">
        <img src="{{signature_url}}" alt="Assinatura" class="signature-img" />
        <p>{{signatory_name}}</p>
        <p>{{signatory_title}}</p>
      </div>
      <div class="verification">
        <p>Verificar autenticidade em:</p>
        <p>{{verification_url}}</p>
        <p>Código: {{certificate_number}}</p>
      </div>
    </div>
  </div>',
  '.certificate {
    width: 100%;
    max-width: 800px;
    padding: 40px;
    margin: 0 auto;
    border: 10px solid #3B82F6;
    font-family: "Arial", sans-serif;
    color: #333;
    background-color: #fff;
    position: relative;
  }
  .header {
    text-align: center;
    margin-bottom: 40px;
  }
  .logo {
    max-width: 150px;
    margin-bottom: 20px;
  }
  h1 {
    font-size: 28px;
    margin: 0;
    color: #3B82F6;
  }
  .content {
    text-align: center;
    margin-bottom: 40px;
    font-size: 18px;
    line-height: 1.6;
  }
  .recipient {
    font-size: 24px;
    margin-bottom: 20px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    margin-top: 60px;
  }
  .signature {
    text-align: center;
    flex: 1;
  }
  .signature-img {
    max-width: 150px;
    margin-bottom: 10px;
  }
  .verification {
    text-align: right;
    font-size: 12px;
    flex: 1;
  }',
  TRUE
);

-- Insert default levels
INSERT INTO gamification.levels (level_number, name, description, points_required, icon)
VALUES 
  (1, 'Iniciante', 'Primeiros passos na plataforma', 0, 'star-outline'),
  (2, 'Aprendiz', 'Começando a dominar o conteúdo', 100, 'star-half'),
  (3, 'Estudante', 'Progredindo consistentemente', 300, 'star'),
  (4, 'Avançado', 'Conhecimento sólido', 600, 'award'),
  (5, 'Especialista', 'Domínio completo do conteúdo', 1000, 'award-fill'),
  (6, 'Mestre', 'Nível máximo de conhecimento', 2000, 'trophy');

-- Insert default achievements
INSERT INTO gamification.achievements (name, description, icon, points, achievement_type, criteria)
VALUES 
  ('Primeiro Login', 'Realizou o primeiro acesso à plataforma', 'log-in', 10, 'login_streak', '{"logins": 1}'),
  ('Assiduidade', 'Acessou a plataforma por 7 dias consecutivos', 'calendar', 50, 'login_streak', '{"consecutive_days": 7}'),
  ('Primeiro Curso', 'Concluiu o primeiro curso', 'book', 100, 'course_completion', '{"courses": 1}'),
  ('Nota Máxima', 'Obteve nota máxima em uma avaliação', 'award', 50, 'assessment_score', '{"min_score": 100}'),
  ('Participativo', 'Participou ativamente nos fóruns', 'message-square', 30, 'forum_participation', '{"min_posts": 5}');
