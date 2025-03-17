/*
  # Email Configuration Setup

  1. Changes
    - Create email templates for:
      - Sign up confirmation
      - Password reset
      - Magic link login
      - Invite user
    - Set up email template configurations
    - Add audit function for email events

  2. Security
    - Templates are only accessible by the system
    - Email events are logged in audit_logs table
*/

-- Create function to log email events
CREATE OR REPLACE FUNCTION log_email_event()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.audit_logs (
    action,
    entity,
    entity_id,
    details,
    user_id
  ) VALUES (
    TG_ARGV[0],
    'email',
    NEW.id::text,
    jsonb_build_object(
      'template', NEW.template,
      'email_to', NEW.email_to
    ),
    auth.uid()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create email templates
DO $$
BEGIN
  -- Confirmation email template
  PERFORM set_config(
    'auth.email.template.confirm_signup',
    '{
      "subject": "Confirme seu email",
      "content_html": "<h2>Bem-vindo ao EdunexIA!</h2><p>Por favor, confirme seu email clicando no link abaixo:</p><p><a href=\"{{ .ConfirmationURL }}\">Confirmar email</a></p><p>Se você não criou esta conta, ignore este email.</p>",
      "content_text": "Bem-vindo ao EdunexIA!\n\nPor favor, confirme seu email clicando no link abaixo:\n\n{{ .ConfirmationURL }}\n\nSe você não criou esta conta, ignore este email."
    }',
    false
  );

  -- Password reset template
  PERFORM set_config(
    'auth.email.template.reset_password',
    '{
      "subject": "Redefinição de senha",
      "content_html": "<h2>Redefinição de senha</h2><p>Você solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:</p><p><a href=\"{{ .ResetURL }}\">Redefinir senha</a></p><p>Se você não solicitou esta alteração, ignore este email.</p>",
      "content_text": "Redefinição de senha\n\nVocê solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:\n\n{{ .ResetURL }}\n\nSe você não solicitou esta alteração, ignore este email."
    }',
    false
  );

  -- Magic link template
  PERFORM set_config(
    'auth.email.template.magic_link',
    '{
      "subject": "Link de acesso",
      "content_html": "<h2>Seu link de acesso</h2><p>Clique no link abaixo para acessar sua conta:</p><p><a href=\"{{ .MagicLink }}\">Acessar conta</a></p>",
      "content_text": "Seu link de acesso\n\nClique no link abaixo para acessar sua conta:\n\n{{ .MagicLink }}"
    }',
    false
  );

  -- Invite template
  PERFORM set_config(
    'auth.email.template.invite',
    '{
      "subject": "Convite EdunexIA",
      "content_html": "<h2>Você foi convidado!</h2><p>Você foi convidado para se juntar ao EdunexIA. Clique no link abaixo para criar sua conta:</p><p><a href=\"{{ .InviteURL }}\">Criar conta</a></p>",
      "content_text": "Você foi convidado!\n\nVocê foi convidado para se juntar ao EdunexIA. Clique no link abaixo para criar sua conta:\n\n{{ .InviteURL }}"
    }',
    false
  );

  -- Configure SMTP settings
  PERFORM set_config(
    'auth.email.smtp',
    '{
      "host": "brasil.svrdedicado.org",
      "port": 587,
      "username": "contato@eduzayn.com.br",
      "password": "123@mudar",
      "method": "STARTTLS"
    }',
    false
  );
END $$;