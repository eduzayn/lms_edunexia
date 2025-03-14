-- Create table for video generation job queue
CREATE TABLE IF NOT EXISTS content.video_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  result JSONB,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE content.video_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can view their own jobs
CREATE POLICY "Users can view their own jobs"
  ON content.video_jobs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all jobs
CREATE POLICY "Admins can view all jobs"
  ON content.video_jobs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- System can insert jobs
CREATE POLICY "System can insert jobs"
  ON content.video_jobs
  FOR INSERT
  WITH CHECK (true);

-- System can update jobs
CREATE POLICY "System can update jobs"
  ON content.video_jobs
  FOR UPDATE
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_video_jobs_user_id ON content.video_jobs(user_id);
CREATE INDEX idx_video_jobs_status ON content.video_jobs(status);
