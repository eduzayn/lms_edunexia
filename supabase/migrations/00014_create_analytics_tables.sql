-- Create analytics schema
CREATE SCHEMA IF NOT EXISTS analytics;

-- Analytics table to store pre-computed analytics data
CREATE TABLE IF NOT EXISTS analytics.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('course', 'student', 'assessment', 'content', 'platform')),
  entity_id UUID NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(type, entity_id)
);

-- Content views tracking
CREATE TABLE IF NOT EXISTS analytics.content_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES content.content_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  view_count INTEGER NOT NULL DEFAULT 1,
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  interaction_count INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_id, user_id)
);

-- Content feedback
CREATE TABLE IF NOT EXISTS analytics.content_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES content.content_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_id, user_id)
);

-- Student progress tracking
CREATE TABLE IF NOT EXISTS analytics.student_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES academic.courses(id) ON DELETE CASCADE,
  progress_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  score NUMERIC(5,2),
  time_spent_seconds INTEGER NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Module completions
CREATE TABLE IF NOT EXISTS analytics.module_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES academic.modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, module_id)
);

-- Enable Row Level Security
ALTER TABLE analytics.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.content_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.content_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics.module_completions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Analytics
CREATE POLICY "Analytics are viewable by admins and instructors"
  ON analytics.analytics
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Analytics can be created by the system"
  ON analytics.analytics
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Analytics can be updated by the system"
  ON analytics.analytics
  FOR UPDATE
  USING (true);

-- Content Views
CREATE POLICY "Content views are viewable by their owners and admins/instructors"
  ON analytics.content_views
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Content views can be created by authenticated users"
  ON analytics.content_views
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    auth.uid() = user_id
  );

CREATE POLICY "Content views can be updated by their owners"
  ON analytics.content_views
  FOR UPDATE
  USING (
    auth.uid() = user_id
  );

-- Content Feedback
CREATE POLICY "Content feedback is viewable by their owners and admins/instructors"
  ON analytics.content_feedback
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Content feedback can be created by authenticated users"
  ON analytics.content_feedback
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    auth.uid() = user_id
  );

CREATE POLICY "Content feedback can be updated by their owners"
  ON analytics.content_feedback
  FOR UPDATE
  USING (
    auth.uid() = user_id
  );

-- Student Progress
CREATE POLICY "Student progress is viewable by their owners and admins/instructors"
  ON analytics.student_progress
  FOR SELECT
  USING (
    auth.uid() = student_id OR
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Student progress can be created by the system"
  ON analytics.student_progress
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Student progress can be updated by the system"
  ON analytics.student_progress
  FOR UPDATE
  USING (true);

-- Module Completions
CREATE POLICY "Module completions are viewable by their owners and admins/instructors"
  ON analytics.module_completions
  FOR SELECT
  USING (
    auth.uid() = student_id OR
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Module completions can be created by the system"
  ON analytics.module_completions
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_content_views_content_id ON analytics.content_views(content_id);
CREATE INDEX idx_content_views_user_id ON analytics.content_views(user_id);
CREATE INDEX idx_content_feedback_content_id ON analytics.content_feedback(content_id);
CREATE INDEX idx_content_feedback_user_id ON analytics.content_feedback(user_id);
CREATE INDEX idx_student_progress_student_id ON analytics.student_progress(student_id);
CREATE INDEX idx_student_progress_course_id ON analytics.student_progress(course_id);
CREATE INDEX idx_module_completions_student_id ON analytics.module_completions(student_id);
CREATE INDEX idx_module_completions_module_id ON analytics.module_completions(module_id);
