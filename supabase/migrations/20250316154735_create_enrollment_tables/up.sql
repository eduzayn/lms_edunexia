-- Create enrollment tables
CREATE SCHEMA IF NOT EXISTS enrollment;

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollment.enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES academic.courses(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  progress NUMERIC(5,2) NOT NULL DEFAULT 0,
  lytex_enrollment_id TEXT,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Enrollment metadata
CREATE TABLE IF NOT EXISTS enrollment.metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID NOT NULL REFERENCES enrollment.enrollments(id) ON DELETE CASCADE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for enrollment tables
ALTER TABLE enrollment.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment.metadata ENABLE ROW LEVEL SECURITY;

-- Admin can see all enrollments
CREATE POLICY admin_select_enrollments ON enrollment.enrollments
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Admin can insert/update/delete all enrollments
CREATE POLICY admin_insert_enrollments ON enrollment.enrollments
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

CREATE POLICY admin_update_enrollments ON enrollment.enrollments
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

CREATE POLICY admin_delete_enrollments ON enrollment.enrollments
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Students can see their own enrollments
CREATE POLICY student_select_enrollments ON enrollment.enrollments
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Teachers can see enrollments for their courses
CREATE POLICY teacher_select_enrollments ON enrollment.enrollments
  FOR SELECT USING (
    course_id IN (SELECT id FROM public.courses WHERE instructor_id = auth.uid())
  );

-- Similar policies for metadata
CREATE POLICY admin_select_metadata ON enrollment.metadata
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

CREATE POLICY admin_insert_metadata ON enrollment.metadata
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

CREATE POLICY admin_update_metadata ON enrollment.metadata
  FOR UPDATE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

CREATE POLICY admin_delete_metadata ON enrollment.metadata
  FOR DELETE USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Students can see their own metadata
CREATE POLICY student_select_metadata ON enrollment.metadata
  FOR SELECT USING (
    enrollment_id IN (
      SELECT id FROM enrollment.enrollments WHERE user_id = auth.uid()
    )
  );

-- Teachers can see metadata for their courses
CREATE POLICY teacher_select_metadata ON enrollment.metadata
  FOR SELECT USING (
    enrollment_id IN (
      SELECT e.id FROM enrollment.enrollments e
      JOIN public.courses c ON e.course_id = c.id
      WHERE c.instructor_id = auth.uid()
    )
  );
