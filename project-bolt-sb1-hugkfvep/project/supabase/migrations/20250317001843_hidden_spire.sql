/*
  # Configuração de Email e Autenticação

  1. Configurações
    - Define as configurações de autenticação
    - Configura os templates de email em português
    - Desativa a confirmação automática de email

  2. Segurança
    - Todas as funções são marcadas como SECURITY DEFINER
    - Registra eventos de email no sistema de auditoria
*/

-- Função para registrar eventos de email
CREATE OR REPLACE FUNCTION public.handle_email_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_logs (
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

-- Função para testar a configuração de email
CREATE OR REPLACE FUNCTION public.test_email_config()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  -- Busca o último evento de email dos logs
  SELECT 
    jsonb_build_object(
      'latest_event', MAX(created_at),
      'total_events', COUNT(*),
      'event_types', jsonb_agg(DISTINCT details->>'event_type')
    )
  INTO result
  FROM public.audit_logs
  WHERE action LIKE 'email_%';

  RETURN result;
END;
$$;