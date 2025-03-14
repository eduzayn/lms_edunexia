-- Create assessment feedback table
CREATE TABLE IF NOT EXISTS assessment_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES academic.student_submissions(id) ON DELETE CASCADE,
  assessment_id UUID NOT NULL REFERENCES academic.assessments(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES academic.assessment_questions(id) ON DELETE CASCADE,
  feedback TEXT NOT NULL,
  strengths TEXT[] NOT NULL DEFAULT '{}',
  areas_for_improvement TEXT[] NOT NULL DEFAULT '{}',
  score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(submission_id, question_id)
);

-- Enable Row Level Security
ALTER TABLE assessment_feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Assessment feedback is viewable by their owners and admins/instructors"
  ON assessment_feedback
  FOR SELECT
  USING (
    auth.uid() = student_id OR
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Assessment feedback can be created by the system"
  ON assessment_feedback
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Assessment feedback can be updated by the system"
  ON assessment_feedback
  FOR UPDATE
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_assessment_feedback_student_id ON assessment_feedback(student_id);
CREATE INDEX idx_assessment_feedback_submission_id ON assessment_feedback(submission_id);
CREATE INDEX idx_assessment_feedback_assessment_id ON assessment_feedback(assessment_id);
CREATE INDEX idx_assessment_feedback_question_id ON assessment_feedback(question_id);
