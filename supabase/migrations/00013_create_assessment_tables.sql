-- Create assessment schema
CREATE SCHEMA IF NOT EXISTS assessment;

-- Assessment Types
CREATE TABLE IF NOT EXISTS assessment.assessment_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments
CREATE TABLE IF NOT EXISTS assessment.assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  type_id UUID NOT NULL REFERENCES assessment.assessment_types(id) ON DELETE CASCADE,
  course_id UUID REFERENCES academic.courses(id) ON DELETE CASCADE,
  module_id UUID REFERENCES academic.modules(id) ON DELETE CASCADE,
  due_date TIMESTAMP WITH TIME ZONE,
  points INTEGER NOT NULL DEFAULT 100,
  passing_score INTEGER NOT NULL DEFAULT 70,
  time_limit_minutes INTEGER,
  attempts_allowed INTEGER,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessment Questions
CREATE TABLE IF NOT EXISTS assessment.assessment_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessment.assessments(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'essay', 'matching', 'fill_blank', 'code')),
  points INTEGER NOT NULL DEFAULT 10,
  correct_answer TEXT,
  feedback TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Question Options (for multiple choice, matching, etc.)
CREATE TABLE IF NOT EXISTS assessment.question_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID NOT NULL REFERENCES assessment.assessment_questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  feedback TEXT,
  order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Student Submissions
CREATE TABLE IF NOT EXISTS assessment.student_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessment.assessments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  passed BOOLEAN,
  time_spent_seconds INTEGER,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  feedback TEXT,
  status TEXT NOT NULL CHECK (status IN ('in_progress', 'submitted', 'graded', 'needs_review')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assessment_id, student_id, attempt_number)
);

-- Submission Answers
CREATE TABLE IF NOT EXISTS assessment.submission_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES assessment.student_submissions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES assessment.assessment_questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  is_correct BOOLEAN,
  points_awarded INTEGER,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(submission_id, question_id)
);

-- Proctoring Sessions
CREATE TABLE IF NOT EXISTS assessment.proctoring_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES assessment.student_submissions(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'flagged', 'reviewed')),
  flags JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE assessment.assessment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment.question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment.student_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment.submission_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment.proctoring_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Assessment Types
CREATE POLICY "Assessment types are viewable by all authenticated users"
  ON assessment.assessment_types
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Assessment types can be created by admins and instructors"
  ON assessment.assessment_types
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Assessment types can be updated by admins and instructors"
  ON assessment.assessment_types
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

-- Assessments
CREATE POLICY "Assessments are viewable by all authenticated users"
  ON assessment.assessments
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Assessments can be created by admins and instructors"
  ON assessment.assessments
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Assessments can be updated by admins and instructors"
  ON assessment.assessments
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Assessments can be deleted by admins and instructors"
  ON assessment.assessments
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

-- Assessment Questions
CREATE POLICY "Assessment questions are viewable by all authenticated users"
  ON assessment.assessment_questions
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Assessment questions can be created by admins and instructors"
  ON assessment.assessment_questions
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Assessment questions can be updated by admins and instructors"
  ON assessment.assessment_questions
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Assessment questions can be deleted by admins and instructors"
  ON assessment.assessment_questions
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

-- Question Options
CREATE POLICY "Question options are viewable by all authenticated users"
  ON assessment.question_options
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Question options can be created by admins and instructors"
  ON assessment.question_options
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Question options can be updated by admins and instructors"
  ON assessment.question_options
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Question options can be deleted by admins and instructors"
  ON assessment.question_options
  FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

-- Student Submissions
CREATE POLICY "Student submissions are viewable by their owners and instructors/admins"
  ON assessment.student_submissions
  FOR SELECT
  USING (
    auth.uid() = student_id OR
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Student submissions can be created by authenticated users"
  ON assessment.student_submissions
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    auth.uid() = student_id
  );

CREATE POLICY "Student submissions can be updated by their owners and instructors/admins"
  ON assessment.student_submissions
  FOR UPDATE
  USING (
    auth.uid() = student_id OR
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

-- Submission Answers
CREATE POLICY "Submission answers are viewable by their owners and instructors/admins"
  ON assessment.submission_answers
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT student_id FROM assessment.student_submissions
      WHERE id = submission_id
    ) OR
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Submission answers can be created by authenticated users"
  ON assessment.submission_answers
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    auth.uid() IN (
      SELECT student_id FROM assessment.student_submissions
      WHERE id = submission_id
    )
  );

CREATE POLICY "Submission answers can be updated by their owners and instructors/admins"
  ON assessment.submission_answers
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT student_id FROM assessment.student_submissions
      WHERE id = submission_id
    ) OR
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

-- Proctoring Sessions
CREATE POLICY "Proctoring sessions are viewable by their owners and instructors/admins"
  ON assessment.proctoring_sessions
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT student_id FROM assessment.student_submissions
      WHERE id = submission_id
    ) OR
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Proctoring sessions can be created by instructors/admins"
  ON assessment.proctoring_sessions
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Proctoring sessions can be updated by instructors/admins"
  ON assessment.proctoring_sessions
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

-- Create indexes for performance
CREATE INDEX idx_assessments_course_id ON assessment.assessments(course_id);
CREATE INDEX idx_assessments_module_id ON assessment.assessments(module_id);
CREATE INDEX idx_assessment_questions_assessment_id ON assessment.assessment_questions(assessment_id);
CREATE INDEX idx_question_options_question_id ON assessment.question_options(question_id);
CREATE INDEX idx_student_submissions_assessment_id ON assessment.student_submissions(assessment_id);
CREATE INDEX idx_student_submissions_student_id ON assessment.student_submissions(student_id);
CREATE INDEX idx_submission_answers_submission_id ON assessment.submission_answers(submission_id);
CREATE INDEX idx_submission_answers_question_id ON assessment.submission_answers(question_id);
CREATE INDEX idx_proctoring_sessions_submission_id ON assessment.proctoring_sessions(submission_id);

-- Insert default assessment types
INSERT INTO assessment.assessment_types (name, description, icon, settings)
VALUES 
  ('Quiz', 'Avaliação rápida com questões de múltipla escolha e verdadeiro/falso', 'clipboard-check', '{"time_limit": true, "randomize_questions": true}'),
  ('Prova', 'Avaliação formal com diversos tipos de questões', 'file-text', '{"time_limit": true, "proctoring": true, "show_results": false}'),
  ('Tarefa', 'Atividade para entrega com questões dissertativas', 'book-open', '{"time_limit": false, "late_submission": true}'),
  ('Projeto', 'Projeto prático para avaliação de habilidades', 'code', '{"time_limit": false, "peer_review": true}'),
  ('Autoavaliação', 'Avaliação para prática e feedback imediato', 'refresh-cw', '{"time_limit": false, "show_answers": true, "multiple_attempts": true}');
