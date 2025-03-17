/*
  # Fix RLS policies and type definitions

  1. Changes
    - Drop and recreate all policies with proper type casting
    - Ensure consistent type usage across tables and policies
    - Fix role comparisons in RLS policies

  2. Security
    - Maintain existing RLS restrictions
    - Update policies to use proper type casting
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage permissions" ON public.permissions;
DROP POLICY IF EXISTS "Admins can manage role permissions" ON public.role_permissions;

-- Recreate policies with proper type casting and checks
CREATE POLICY "Admins can manage permissions"
ON public.permissions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role::text = 'admin'
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
    AND profiles.role::text = 'admin'
  )
);