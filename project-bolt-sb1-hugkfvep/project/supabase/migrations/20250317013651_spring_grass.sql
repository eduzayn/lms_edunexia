/*
  # Criação do Enum de Roles

  1. Mudanças
    - Cria o tipo enum user_role com todos os papéis do sistema
    
  2. Notas
    - Enum é criado apenas se não existir
    - Inclui todos os papéis necessários para o sistema
*/

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM (
        'admin',
        'student',
        'teacher',
        'polo_manager',
        'partner',
        'operator'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;