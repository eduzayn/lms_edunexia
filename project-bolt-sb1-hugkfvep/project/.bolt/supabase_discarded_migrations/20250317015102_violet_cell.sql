/*
  # Clean and recreate permissions system
  
  1. Changes
    - Drop all existing permissions tables
    - Drop user_role enum type
    - Recreate user_role enum type
    - Create permissions table with proper constraints
    - Create role_permissions table with proper foreign keys
    - Add RLS policies
    - Insert default permissions and admin role assignments

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Drop existing tables and types
DROP TABLE IF EXISTS public.role_permissions CASCADE;
DROP TABLE IF EXISTS public.permissions CASCADE;
DROP TYPE IF EXISTS public.user_role CASCADE;

-- Recreate user_role type
CREATE TYPE public.user_role AS ENUM (
  'admin',
  'student',
  'teacher',
  'polo_manager',
  'partner',
  'operator'
);

-- Create permissions table
CREATE TABLE public.permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  module text NOT NULL CHECK (module IN ('users', 'courses', 'students', 'financial')),
  created_at timestamptz DEFAULT now()
);

-- Create role_permissions table
CREATE TABLE public.role_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL,
  permission_id uuid NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role, permission_id)
);

-- Enable RLS
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Create admin policies
CREATE POLICY "Admins can manage permissions"
ON public.permissions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'::text
  )
);

CREATE POLICY "Admins can manage role permissions"
ON public.role_permissions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'::text
  )
);

-- Insert default permissions
INSERT INTO public.permissions (code, name, description, module) VALUES
-- Users module
('users.view', 'Visualizar usuários', 'Permite visualizar lista de usuários', 'users'),
('users.create', 'Criar usuários', 'Permite criar novos usuários', 'users'),
('users.edit', 'Editar usuários', 'Permite editar usuários existentes', 'users'),
('users.delete', 'Excluir usuários', 'Permite excluir usuários', 'users'),

-- Courses module
('courses.view', 'Visualizar cursos', 'Permite visualizar lista de cursos', 'courses'),
('courses.create', 'Criar cursos', 'Permite criar novos cursos', 'courses'),
('courses.edit', 'Editar cursos', 'Permite editar cursos existentes', 'courses'),
('courses.delete', 'Excluir cursos', 'Permite excluir cursos', 'courses'),

-- Students module
('students.view', 'Visualizar alunos', 'Permite visualizar lista de alunos', 'students'),
('students.create', 'Criar alunos', 'Permite criar novos alunos', 'students'),
('students.edit', 'Editar alunos', 'Permite editar alunos existentes', 'students'),
('students.delete', 'Excluir alunos', 'Permite excluir alunos', 'students'),

-- Financial module
('financial.view', 'Visualizar financeiro', 'Permite visualizar informações financeiras', 'financial'),
('financial.create', 'Criar registros financeiros', 'Permite criar novos registros financeiros', 'financial'),
('financial.edit', 'Editar registros financeiros', 'Permite editar registros financeiros', 'financial'),
('financial.delete', 'Excluir registros financeiros', 'Permite excluir registros financeiros', 'financial');

-- Insert default role permissions for admin
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin'::user_role, id 
FROM public.permissions;