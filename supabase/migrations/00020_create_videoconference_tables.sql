-- Create videoconference tables
CREATE SCHEMA IF NOT EXISTS videoconference;

-- Create table for videoconference platforms
CREATE TABLE IF NOT EXISTS videoconference.platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL CHECK (name IN ('zoom', 'teams', 'bigbluebutton')),
  display_name TEXT NOT NULL,
  api_key TEXT,
  api_secret TEXT,
  base_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for videoconference meetings
CREATE TABLE IF NOT EXISTS videoconference.meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  course_id UUID REFERENCES academic.courses(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_id UUID NOT NULL REFERENCES videoconference.platforms(id) ON DELETE CASCADE,
  meeting_id TEXT NOT NULL,
  meeting_url TEXT NOT NULL,
  join_url TEXT NOT NULL,
  password TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for videoconference recordings
CREATE TABLE IF NOT EXISTS videoconference.recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES videoconference.meetings(id) ON DELETE CASCADE,
  recording_id TEXT NOT NULL,
  recording_url TEXT NOT NULL,
  recording_type TEXT NOT NULL CHECK (recording_type IN ('video', 'audio', 'chat', 'transcript')),
  duration INTEGER, -- in seconds
  size BIGINT, -- in bytes
  status TEXT NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for videoconference attendance
CREATE TABLE IF NOT EXISTS videoconference.attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID NOT NULL REFERENCES videoconference.meetings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  join_time TIMESTAMP WITH TIME ZONE,
  leave_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late', 'partial')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(meeting_id, user_id)
);

-- Add RLS policies for videoconference platforms
ALTER TABLE videoconference.platforms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage videoconference platforms"
  ON videoconference.platforms
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Teachers and admins can view videoconference platforms"
  ON videoconference.platforms
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

-- Add RLS policies for videoconference meetings
ALTER TABLE videoconference.meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can create meetings"
  ON videoconference.meetings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers can update their own meetings"
  ON videoconference.meetings
  FOR UPDATE
  USING (
    instructor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Teachers can delete their own meetings"
  ON videoconference.meetings
  FOR DELETE
  USING (
    instructor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Students can view meetings for their courses"
  ON videoconference.meetings
  FOR SELECT
  USING (
    course_id IN (
      SELECT course_id FROM academic.enrollments
      WHERE student_id = auth.uid()
    ) OR
    instructor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Add RLS policies for videoconference recordings
ALTER TABLE videoconference.recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage recordings for their meetings"
  ON videoconference.recordings
  USING (
    EXISTS (
      SELECT 1 FROM videoconference.meetings
      WHERE videoconference.meetings.id = videoconference.recordings.meeting_id
      AND videoconference.meetings.instructor_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Students can view recordings for their courses"
  ON videoconference.recordings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM videoconference.meetings
      JOIN academic.enrollments ON videoconference.meetings.course_id = academic.enrollments.course_id
      WHERE videoconference.meetings.id = videoconference.recordings.meeting_id
      AND academic.enrollments.student_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM videoconference.meetings
      WHERE videoconference.meetings.id = videoconference.recordings.meeting_id
      AND videoconference.meetings.instructor_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Add RLS policies for videoconference attendance
ALTER TABLE videoconference.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage attendance for their meetings"
  ON videoconference.attendance
  USING (
    EXISTS (
      SELECT 1 FROM videoconference.meetings
      WHERE videoconference.meetings.id = videoconference.attendance.meeting_id
      AND videoconference.meetings.instructor_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

CREATE POLICY "Students can view their own attendance"
  ON videoconference.attendance
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM videoconference.meetings
      WHERE videoconference.meetings.id = videoconference.attendance.meeting_id
      AND videoconference.meetings.instructor_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_meetings_course_id ON videoconference.meetings(course_id);
CREATE INDEX IF NOT EXISTS idx_meetings_instructor_id ON videoconference.meetings(instructor_id);
CREATE INDEX IF NOT EXISTS idx_recordings_meeting_id ON videoconference.recordings(meeting_id);
CREATE INDEX IF NOT EXISTS idx_attendance_meeting_id ON videoconference.attendance(meeting_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON videoconference.attendance(user_id);

-- Insert default platforms
INSERT INTO videoconference.platforms (name, display_name)
VALUES 
  ('zoom', 'Zoom'),
  ('teams', 'Microsoft Teams'),
  ('bigbluebutton', 'BigBlueButton');
