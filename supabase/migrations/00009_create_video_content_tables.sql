-- Create video content tables for AI-powered video generation
CREATE SCHEMA IF NOT EXISTS content;

-- Create table for video content
CREATE TABLE IF NOT EXISTS content.videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL, -- in seconds
  thumbnail_url TEXT,
  video_url TEXT NOT NULL,
  script_text TEXT NOT NULL,
  subtitles_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES academic.courses(id) ON DELETE SET NULL,
  lesson_id UUID REFERENCES academic.lessons(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for video generation history
CREATE TABLE IF NOT EXISTS content.video_generation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID REFERENCES content.videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  settings JSONB NOT NULL,
  processing_time INTEGER, -- in milliseconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for video usage statistics
CREATE TABLE IF NOT EXISTS content.video_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL REFERENCES content.videos(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  completions INTEGER DEFAULT 0,
  average_watch_time INTEGER DEFAULT 0, -- in seconds
  engagement_rate NUMERIC(5,2) DEFAULT 0, -- percentage
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update video statistics
CREATE OR REPLACE FUNCTION update_video_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update video stats
  UPDATE content.video_stats
  SET 
    views = views + 1,
    updated_at = NOW()
  WHERE video_id = NEW.id;
  
  IF NOT FOUND THEN
    INSERT INTO content.video_stats (video_id, views)
    VALUES (NEW.id, 1);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update video statistics
CREATE TRIGGER update_video_stats_trigger
AFTER INSERT ON content.videos
FOR EACH ROW
EXECUTE FUNCTION update_video_stats();

-- Add RLS policies
ALTER TABLE content.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE content.video_generation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE content.video_stats ENABLE ROW LEVEL SECURITY;

-- Users can view videos they created
CREATE POLICY "Users can view videos they created"
  ON content.videos
  FOR SELECT
  USING (auth.uid() = created_by);

-- Users can view videos in courses they're enrolled in
CREATE POLICY "Users can view videos in courses they're enrolled in"
  ON content.videos
  FOR SELECT
  USING (
    course_id IN (
      SELECT course_id FROM academic.enrollments
      WHERE student_id = auth.uid()
    )
  );

-- Users can insert their own videos
CREATE POLICY "Users can insert their own videos"
  ON content.videos
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update their own videos
CREATE POLICY "Users can update their own videos"
  ON content.videos
  FOR UPDATE
  USING (auth.uid() = created_by);

-- Users can delete their own videos
CREATE POLICY "Users can delete their own videos"
  ON content.videos
  FOR DELETE
  USING (auth.uid() = created_by);

-- Admins can view all videos
CREATE POLICY "Admins can view all videos"
  ON content.videos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can update all videos
CREATE POLICY "Admins can update all videos"
  ON content.videos
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can delete all videos
CREATE POLICY "Admins can delete all videos"
  ON content.videos
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Users can view their own video generation history
CREATE POLICY "Users can view their own video generation history"
  ON content.video_generation_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all video generation history
CREATE POLICY "Admins can view all video generation history"
  ON content.video_generation_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can view all video stats
CREATE POLICY "Admins can view all video stats"
  ON content.video_stats
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Users can view stats for their own videos
CREATE POLICY "Users can view stats for their own videos"
  ON content.video_stats
  FOR SELECT
  USING (
    video_id IN (
      SELECT id FROM content.videos
      WHERE created_by = auth.uid()
    )
  );
