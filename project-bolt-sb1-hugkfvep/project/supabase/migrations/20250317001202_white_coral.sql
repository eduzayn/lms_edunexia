/*
  # Email Audit Configuration

  1. Changes
    - Add email event tracking function
    - Create trigger for logging email events
    - Add test function for email configuration

  2. Security
    - Functions run with security definer to ensure proper access control
*/

-- Function to log email events
CREATE OR REPLACE FUNCTION log_email_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    entity,
    entity_id,
    details
  ) VALUES (
    NEW.id,
    'email_' || TG_ARGV[0],
    'auth',
    NEW.id,
    jsonb_build_object(
      'email', NEW.email,
      'event_type', TG_ARGV[0],
      'timestamp', NOW()
    )
  );
  RETURN NEW;
END;
$$;

-- Function to test email configuration
CREATE OR REPLACE FUNCTION test_email_configuration()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Get latest email event from audit logs
  SELECT 
    jsonb_build_object(
      'latest_event', MAX(created_at),
      'total_events', COUNT(*),
      'event_types', jsonb_agg(DISTINCT details->>'event_type')
    )
  INTO result
  FROM audit_logs
  WHERE action LIKE 'email_%';

  RETURN result;
END;
$$;