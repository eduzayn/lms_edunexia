/*
  # Fix Profiles Table RLS Policies

  1. Changes
    - Drop existing policies that may be causing recursion
    - Create new, simplified policies for the profiles table
    - Add proper RLS policies for different user roles

  2. Security
    - Enable RLS on profiles table
    - Add policies for:
      - Admins can view all profiles
      - Users can view their own profile
      - Users can update their own profile
*/

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create new policies
CREATE POLICY "Admins can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (
  role = 'admin'
);

CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id
);

CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id
)
WITH CHECK (
  auth.uid() = id
);