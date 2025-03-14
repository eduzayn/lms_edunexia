-- Create AI stats tables for tracking user interactions with AI features
CREATE SCHEMA IF NOT EXISTS ai;

-- Create table for tracking user AI statistics
CREATE TABLE IF NOT EXISTS ai.user_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  questions_answered INTEGER DEFAULT 0,
  materials_generated INTEGER DEFAULT 0,
  time_saved INTEGER DEFAULT 0, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for AI conversations
CREATE TABLE IF NOT EXISTS ai.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for AI messages within conversations
CREATE TABLE IF NOT EXISTS ai.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES ai.conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for AI-generated content
CREATE TABLE IF NOT EXISTS ai.generated_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('summary', 'mindmap', 'flashcards', 'explanation', 'study_material')),
  course_id UUID,
  lesson_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stored procedure to increment user AI stats
CREATE OR REPLACE FUNCTION increment_ai_stats(
  p_user_id UUID,
  p_stat_type TEXT,
  p_increment_value INTEGER DEFAULT 1
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert a new record if one doesn't exist
  INSERT INTO ai.user_stats (user_id, questions_answered, materials_generated, time_saved)
  VALUES (p_user_id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Update the appropriate stat
  IF p_stat_type = 'questions_answered' THEN
    UPDATE ai.user_stats
    SET questions_answered = questions_answered + p_increment_value,
        updated_at = NOW()
    WHERE user_id = p_user_id;
  ELSIF p_stat_type = 'materials_generated' THEN
    UPDATE ai.user_stats
    SET materials_generated = materials_generated + p_increment_value,
        updated_at = NOW()
    WHERE user_id = p_user_id;
  ELSIF p_stat_type = 'time_saved' THEN
    UPDATE ai.user_stats
    SET time_saved = time_saved + p_increment_value,
        updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
END;
$$;

-- Add RLS policies
ALTER TABLE ai.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai.generated_content ENABLE ROW LEVEL SECURITY;

-- Users can view their own stats
CREATE POLICY "Users can view their own AI stats"
  ON ai.user_stats
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view their own conversations
CREATE POLICY "Users can view their own AI conversations"
  ON ai.conversations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own conversations
CREATE POLICY "Users can insert their own AI conversations"
  ON ai.conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can view messages from their own conversations
CREATE POLICY "Users can view messages from their own AI conversations"
  ON ai.messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ai.conversations
      WHERE ai.conversations.id = ai.messages.conversation_id
      AND ai.conversations.user_id = auth.uid()
    )
  );

-- Users can insert messages into their own conversations
CREATE POLICY "Users can insert messages into their own AI conversations"
  ON ai.messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai.conversations
      WHERE ai.conversations.id = ai.messages.conversation_id
      AND ai.conversations.user_id = auth.uid()
    )
  );

-- Users can view their own generated content
CREATE POLICY "Users can view their own AI generated content"
  ON ai.generated_content
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own generated content
CREATE POLICY "Users can insert their own AI generated content"
  ON ai.generated_content
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all AI stats
CREATE POLICY "Admins can view all AI stats"
  ON ai.user_stats
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can view all AI conversations
CREATE POLICY "Admins can view all AI conversations"
  ON ai.conversations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can view all AI messages
CREATE POLICY "Admins can view all AI messages"
  ON ai.messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can view all AI generated content
CREATE POLICY "Admins can view all AI generated content"
  ON ai.generated_content
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
