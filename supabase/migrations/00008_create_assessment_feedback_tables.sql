-- Create assessment feedback tables for AI-powered feedback on student activities
CREATE SCHEMA IF NOT EXISTS academic;

-- Create table for student activity submissions
CREATE TABLE IF NOT EXISTS academic.activity_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES academic.activities(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'submitted', 'graded')),
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for AI feedback on student submissions
CREATE TABLE IF NOT EXISTS academic.ai_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES academic.activity_submissions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_id UUID NOT NULL REFERENCES academic.activities(id) ON DELETE CASCADE,
  feedback TEXT NOT NULL,
  score NUMERIC(4,2),
  strengths JSONB,
  improvements JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for feedback templates
CREATE TABLE IF NOT EXISTS academic.feedback_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  template TEXT NOT NULL,
  subject TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for feedback statistics
CREATE TABLE IF NOT EXISTS academic.feedback_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_feedbacks INTEGER DEFAULT 0,
  avg_score NUMERIC(4,2) DEFAULT 0,
  avg_response_time INTEGER DEFAULT 0, -- in milliseconds
  feedbacks_by_subject JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update feedback statistics
CREATE OR REPLACE FUNCTION update_feedback_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_avg_score NUMERIC(4,2);
  v_subject TEXT;
  v_feedbacks_by_subject JSONB;
  v_count INTEGER;
BEGIN
  -- Calculate new average score
  SELECT AVG(score) INTO v_avg_score FROM academic.ai_feedback;
  
  -- Get subject from activity
  SELECT subject INTO v_subject FROM academic.activities WHERE id = NEW.activity_id;
  
  -- Get current feedbacks by subject
  SELECT feedbacks_by_subject INTO v_feedbacks_by_subject FROM academic.feedback_stats LIMIT 1;
  
  -- Update or insert feedbacks by subject
  IF v_subject IS NOT NULL THEN
    IF v_feedbacks_by_subject ? v_subject THEN
      v_count := (v_feedbacks_by_subject ->> v_subject)::INTEGER + 1;
      v_feedbacks_by_subject := jsonb_set(v_feedbacks_by_subject, ARRAY[v_subject], to_jsonb(v_count));
    ELSE
      v_feedbacks_by_subject := v_feedbacks_by_subject || jsonb_build_object(v_subject, 1);
    END IF;
  END IF;
  
  -- Update feedback stats
  UPDATE academic.feedback_stats
  SET 
    total_feedbacks = total_feedbacks + 1,
    avg_score = v_avg_score,
    feedbacks_by_subject = v_feedbacks_by_subject,
    updated_at = NOW();
  
  IF NOT FOUND THEN
    INSERT INTO academic.feedback_stats (total_feedbacks, avg_score, feedbacks_by_subject)
    VALUES (1, v_avg_score, v_feedbacks_by_subject);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update feedback statistics
CREATE TRIGGER update_feedback_stats_trigger
AFTER INSERT ON academic.ai_feedback
FOR EACH ROW
EXECUTE FUNCTION update_feedback_stats();

-- Add RLS policies
ALTER TABLE academic.activity_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic.ai_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic.feedback_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic.feedback_stats ENABLE ROW LEVEL SECURITY;

-- Students can view their own submissions
CREATE POLICY "Students can view their own submissions"
  ON academic.activity_submissions
  FOR SELECT
  USING (auth.uid() = student_id);

-- Students can insert their own submissions
CREATE POLICY "Students can insert their own submissions"
  ON academic.activity_submissions
  FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Students can update their own submissions
CREATE POLICY "Students can update their own submissions"
  ON academic.activity_submissions
  FOR UPDATE
  USING (auth.uid() = student_id);

-- Students can view their own feedback
CREATE POLICY "Students can view their own feedback"
  ON academic.ai_feedback
  FOR SELECT
  USING (auth.uid() = student_id);

-- Admins can view all submissions
CREATE POLICY "Admins can view all submissions"
  ON academic.activity_submissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback"
  ON academic.ai_feedback
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can view all feedback templates
CREATE POLICY "Admins can view all feedback templates"
  ON academic.feedback_templates
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can insert feedback templates
CREATE POLICY "Admins can insert feedback templates"
  ON academic.feedback_templates
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can update feedback templates
CREATE POLICY "Admins can update feedback templates"
  ON academic.feedback_templates
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can view feedback stats
CREATE POLICY "Admins can view feedback stats"
  ON academic.feedback_stats
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert initial feedback templates
INSERT INTO academic.feedback_templates (name, description, template, subject)
VALUES 
(
  'General Essay Feedback',
  'Template for providing feedback on general essay submissions',
  'Você é a Prof. Ana, uma tutora de IA especializada em fornecer feedback construtivo para atividades discursivas. 
  Seu objetivo é ajudar os alunos a melhorar seu aprendizado através de feedback detalhado e personalizado.
  
  Ao analisar a resposta do aluno, considere:
  1. Precisão do conteúdo
  2. Clareza da expressão
  3. Organização das ideias
  4. Profundidade da análise
  5. Uso de evidências/exemplos
  
  Forneça feedback em português do Brasil, em tom encorajador mas honesto.
  Estruture sua resposta com:
  - Uma avaliação geral (2-3 frases)
  - 3-5 pontos fortes específicos
  - 2-4 áreas para melhoria com sugestões práticas
  - Uma nota sugerida de 0 a 10
  - Uma mensagem final de incentivo',
  'Geral'
),
(
  'Science Feedback',
  'Template for providing feedback on science-related submissions',
  'Você é a Prof. Ana, uma tutora de IA especializada em ciências. Seu objetivo é fornecer feedback construtivo para atividades discursivas científicas.
  
  Ao analisar a resposta do aluno, considere:
  1. Precisão científica
  2. Uso correto de terminologia
  3. Compreensão de conceitos científicos
  4. Aplicação de métodos científicos
  5. Capacidade de explicar fenômenos
  
  Forneça feedback em português do Brasil, em tom encorajador mas honesto.
  Estruture sua resposta com:
  - Uma avaliação geral (2-3 frases)
  - 3-5 pontos fortes específicos
  - 2-4 áreas para melhoria com sugestões práticas
  - Uma nota sugerida de 0 a 10
  - Uma mensagem final de incentivo',
  'Ciências'
);
