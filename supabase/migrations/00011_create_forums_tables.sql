-- Create forums schema
CREATE SCHEMA IF NOT EXISTS forums;

-- Create forums table
CREATE TABLE IF NOT EXISTS forums.forums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  course_id UUID REFERENCES academic.courses(id) ON DELETE CASCADE,
  is_global BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum topics table
CREATE TABLE IF NOT EXISTS forums.forum_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  forum_id UUID NOT NULL REFERENCES forums.forums(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  view_count INTEGER NOT NULL DEFAULT 0,
  reply_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum posts table
CREATE TABLE IF NOT EXISTS forums.forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES forums.forum_topics(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES forums.forum_posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_answer BOOLEAN NOT NULL DEFAULT FALSE,
  like_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum post likes table to track which users liked which posts
CREATE TABLE IF NOT EXISTS forums.forum_post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES forums.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create forum topic subscriptions table to track which users are subscribed to which topics
CREATE TABLE IF NOT EXISTS forums.forum_topic_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES forums.forum_topics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(topic_id, user_id)
);

-- Create forum topic views table to track which users viewed which topics
CREATE TABLE IF NOT EXISTS forums.forum_topic_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id UUID NOT NULL REFERENCES forums.forum_topics(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  view_count INTEGER NOT NULL DEFAULT 1,
  last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(topic_id, user_id)
);

-- Create function to increment topic view count
CREATE OR REPLACE FUNCTION forums.increment_topic_views(topic_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Increment the topic's view count
  UPDATE forums.forum_topics
  SET view_count = view_count + 1
  WHERE id = topic_id;
  
  -- Record the view in the topic views table if auth.uid() is available
  IF auth.uid() IS NOT NULL THEN
    INSERT INTO forums.forum_topic_views (topic_id, user_id, view_count, last_viewed_at)
    VALUES (topic_id, auth.uid(), 1, NOW())
    ON CONFLICT (topic_id, user_id)
    DO UPDATE SET 
      view_count = forum_topic_views.view_count + 1,
      last_viewed_at = NOW();
  END IF;
END;
$$;

-- Create function to increment counter (for likes, replies, etc.)
CREATE OR REPLACE FUNCTION forums.increment_counter(row_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_count INTEGER;
BEGIN
  RETURN 1; -- Placeholder, will be replaced by actual implementation
END;
$$;

-- Enable RLS on all tables
ALTER TABLE forums.forums ENABLE ROW LEVEL SECURITY;
ALTER TABLE forums.forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forums.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forums.forum_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE forums.forum_topic_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE forums.forum_topic_views ENABLE ROW LEVEL SECURITY;

-- Create policies for forums table
CREATE POLICY "Forums are viewable by all authenticated users"
  ON forums.forums
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Forums can be created by admins and instructors"
  ON forums.forums
  FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

CREATE POLICY "Forums can be updated by admins and instructors"
  ON forums.forums
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

-- Create policies for forum_topics table
CREATE POLICY "Topics are viewable by all authenticated users"
  ON forums.forum_topics
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Topics can be created by all authenticated users"
  ON forums.forum_topics
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Topics can be updated by their authors, admins, and instructors"
  ON forums.forum_topics
  FOR UPDATE
  USING (
    auth.uid() = author_id OR
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

-- Create policies for forum_posts table
CREATE POLICY "Posts are viewable by all authenticated users"
  ON forums.forum_posts
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Posts can be created by all authenticated users"
  ON forums.forum_posts
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Posts can be updated by their authors, admins, and instructors"
  ON forums.forum_posts
  FOR UPDATE
  USING (
    auth.uid() = author_id OR
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

-- Create policies for forum_post_likes table
CREATE POLICY "Post likes are viewable by all authenticated users"
  ON forums.forum_post_likes
  FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Post likes can be created by all authenticated users"
  ON forums.forum_post_likes
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Post likes can be deleted by their creators"
  ON forums.forum_post_likes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for forum_topic_subscriptions table
CREATE POLICY "Topic subscriptions are viewable by their owners"
  ON forums.forum_topic_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Topic subscriptions can be created by all authenticated users"
  ON forums.forum_topic_subscriptions
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Topic subscriptions can be deleted by their owners"
  ON forums.forum_topic_subscriptions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for forum_topic_views table
CREATE POLICY "Topic views are viewable by their owners and admins"
  ON forums.forum_topic_views
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (
      SELECT id FROM public.profiles
      WHERE role IN ('admin', 'instructor')
    )
  );

-- Create indexes for performance
CREATE INDEX idx_forum_topics_forum_id ON forums.forum_topics(forum_id);
CREATE INDEX idx_forum_posts_topic_id ON forums.forum_posts(topic_id);
CREATE INDEX idx_forum_posts_parent_id ON forums.forum_posts(parent_id);
CREATE INDEX idx_forum_post_likes_post_id ON forums.forum_post_likes(post_id);
CREATE INDEX idx_forum_post_likes_user_id ON forums.forum_post_likes(user_id);
CREATE INDEX idx_forum_topic_subscriptions_topic_id ON forums.forum_topic_subscriptions(topic_id);
CREATE INDEX idx_forum_topic_subscriptions_user_id ON forums.forum_topic_subscriptions(user_id);
CREATE INDEX idx_forum_topic_views_topic_id ON forums.forum_topic_views(topic_id);
CREATE INDEX idx_forum_topic_views_user_id ON forums.forum_topic_views(user_id);

-- Create global forums for general discussions
INSERT INTO forums.forums (title, description, is_global)
VALUES 
  ('Fórum Geral', 'Discussões gerais sobre a plataforma, dúvidas e sugestões.', TRUE),
  ('Suporte Técnico', 'Problemas técnicos, bugs e solicitações de ajuda.', TRUE),
  ('Comunidade', 'Compartilhe experiências, materiais e conecte-se com outros estudantes.', TRUE);
