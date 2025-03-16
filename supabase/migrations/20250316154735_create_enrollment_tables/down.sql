-- Drop RLS policies for enrollment tables
DROP POLICY IF EXISTS admin_select_enrollments ON enrollment.enrollments;
DROP POLICY IF EXISTS admin_insert_enrollments ON enrollment.enrollments;
DROP POLICY IF EXISTS admin_update_enrollments ON enrollment.enrollments;
DROP POLICY IF EXISTS admin_delete_enrollments ON enrollment.enrollments;
DROP POLICY IF EXISTS student_select_enrollments ON enrollment.enrollments;
DROP POLICY IF EXISTS teacher_select_enrollments ON enrollment.enrollments;

DROP POLICY IF EXISTS admin_select_metadata ON enrollment.metadata;
DROP POLICY IF EXISTS admin_insert_metadata ON enrollment.metadata;
DROP POLICY IF EXISTS admin_update_metadata ON enrollment.metadata;
DROP POLICY IF EXISTS admin_delete_metadata ON enrollment.metadata;
DROP POLICY IF EXISTS student_select_metadata ON enrollment.metadata;
DROP POLICY IF EXISTS teacher_select_metadata ON enrollment.metadata;

-- Drop enrollment tables
DROP TABLE IF EXISTS enrollment.metadata;
DROP TABLE IF EXISTS enrollment.enrollments;

-- Drop enrollment schema
DROP SCHEMA IF EXISTS enrollment;
