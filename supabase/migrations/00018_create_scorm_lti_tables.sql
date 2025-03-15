-- Create SCORM packages table
CREATE TABLE IF NOT EXISTS public.scorm_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  version TEXT NOT NULL CHECK (version IN ('1.2', '2004')),
  package_url TEXT NOT NULL,
  manifest_url TEXT NOT NULL,
  entry_point TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create SCORM tracking data table
CREATE TABLE IF NOT EXISTS public.scorm_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  scorm_package_id UUID NOT NULL REFERENCES public.scorm_packages(id) ON DELETE CASCADE,
  lesson_status TEXT,
  completion_status TEXT CHECK (completion_status IN ('not attempted', 'incomplete', 'completed')),
  success_status TEXT CHECK (success_status IN ('unknown', 'passed', 'failed')),
  score_raw NUMERIC,
  score_min NUMERIC,
  score_max NUMERIC,
  score_scaled NUMERIC,
  total_time TEXT,
  session_time TEXT,
  suspend_data TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, content_id)
);

-- Create LTI tools table
CREATE TABLE IF NOT EXISTS public.lti_tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  version TEXT NOT NULL DEFAULT '1.3',
  name TEXT NOT NULL,
  description TEXT,
  launch_url TEXT NOT NULL,
  client_id TEXT NOT NULL,
  deployment_id TEXT NOT NULL,
  platform_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create LTI sessions table
CREATE TABLE IF NOT EXISTS public.lti_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  lti_tool_id UUID NOT NULL REFERENCES public.lti_tools(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(user_id, content_id, session_token)
);

-- Create LTI progress tracking table
CREATE TABLE IF NOT EXISTS public.lti_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  lti_tool_id UUID NOT NULL REFERENCES public.lti_tools(id) ON DELETE CASCADE,
  completion_status TEXT CHECK (completion_status IN ('not attempted', 'incomplete', 'completed')),
  score NUMERIC,
  time_spent INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, content_id)
);

-- Add RLS policies for SCORM packages
ALTER TABLE public.scorm_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers and admins can create SCORM packages"
  ON public.scorm_packages FOR INSERT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers and admins can update SCORM packages"
  ON public.scorm_packages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers, admins, and students can view SCORM packages"
  ON public.scorm_packages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers and admins can delete SCORM packages"
  ON public.scorm_packages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

-- Add RLS policies for SCORM tracking
ALTER TABLE public.scorm_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own SCORM tracking data"
  ON public.scorm_tracking FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Users can update their own SCORM tracking data"
  ON public.scorm_tracking FOR INSERT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own SCORM tracking data"
  ON public.scorm_tracking FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Add RLS policies for LTI tools
ALTER TABLE public.lti_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers and admins can create LTI tools"
  ON public.lti_tools FOR INSERT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers and admins can update LTI tools"
  ON public.lti_tools FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Teachers, admins, and students can view LTI tools"
  ON public.lti_tools FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Teachers and admins can delete LTI tools"
  ON public.lti_tools FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

-- Add RLS policies for LTI sessions
ALTER TABLE public.lti_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own LTI sessions"
  ON public.lti_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Users can create their own LTI sessions"
  ON public.lti_sessions FOR INSERT
  TO authenticated
  USING (user_id = auth.uid());

-- Add RLS policies for LTI progress
ALTER TABLE public.lti_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own LTI progress"
  ON public.lti_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

CREATE POLICY "Users can update their own LTI progress"
  ON public.lti_progress FOR INSERT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own LTI progress"
  ON public.lti_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Add analytics tracking for SCORM and LTI content views
ALTER TABLE analytics.content_views
ADD COLUMN IF NOT EXISTS content_type TEXT;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_scorm_packages_content_id ON public.scorm_packages(content_id);
CREATE INDEX IF NOT EXISTS idx_scorm_tracking_user_content ON public.scorm_tracking(user_id, content_id);
CREATE INDEX IF NOT EXISTS idx_lti_tools_content_id ON public.lti_tools(content_id);
CREATE INDEX IF NOT EXISTS idx_lti_sessions_user_content ON public.lti_sessions(user_id, content_id);
CREATE INDEX IF NOT EXISTS idx_lti_progress_user_content ON public.lti_progress(user_id, content_id);
