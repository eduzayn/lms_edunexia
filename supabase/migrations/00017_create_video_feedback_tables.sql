-- Create table for video feedback
CREATE TABLE IF NOT EXISTS content.video_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL REFERENCES content.videos(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE content.video_feedback ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Users can view their own feedback
CREATE POLICY "Users can view their own feedback"
  ON content.video_feedback
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all feedback
CREATE POLICY "Admins can view all feedback"
  ON content.video_feedback
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Users can insert their own feedback
CREATE POLICY "Users can insert their own feedback"
  ON content.video_feedback
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_video_feedback_video_id ON content.video_feedback(video_id);
CREATE INDEX idx_video_feedback_user_id ON content.video_feedback(user_id);
CREATE INDEX idx_video_feedback_rating ON content.video_feedback(rating);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION content.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON content.video_feedback
FOR EACH ROW
EXECUTE FUNCTION content.set_updated_at();

-- Create view for video feedback statistics
CREATE OR REPLACE VIEW content.video_feedback_stats AS
SELECT 
  video_id,
  COUNT(*) as total_ratings,
  AVG(rating) as average_rating,
  COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_count,
  COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star_count,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star_count,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star_count,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star_count
FROM content.video_feedback
GROUP BY video_id;
