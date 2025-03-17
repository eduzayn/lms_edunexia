const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres:EDUNEXIA2028@db.uasnyifizdjxogowijip.supabase.co:5432/postgres';

async function executeMigrations() {
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('🔌 Conectando ao banco de dados...');
    await client.connect();
    console.log('✅ Conexão estabelecida!');

    // Lê o arquivo de migração
    const migrationPath = path.join(__dirname, '../supabase/migrations/00001_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📦 Executando migrações...');
    await client.query(migrationSQL);
    console.log('✅ Migrações aplicadas com sucesso!');

  } catch (error) {
    console.error('❌ Erro durante a migração:', error.message);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Conexão encerrada');
  }
}

// Executa as migrações
console.log('🚀 Iniciando processo de migração...');
executeMigrations()
  .then(() => {
    console.log('✨ Processo de migração concluído com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Falha no processo de migração:', error);
    process.exit(1);
  }); 