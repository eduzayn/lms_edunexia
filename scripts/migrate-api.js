const fs = require('fs');
const path = require('path');
const https = require('https');

const SUPABASE_URL = 'https://uasnyifizdjxogowijip.supabase.co';
const ACCESS_TOKEN = 'sbp_057451a19b2fcdc89fc94ac28289e321ffc6e6a0';

async function executeSQLMigration() {
  try {
    // Lê o arquivo de migração
    const migrationPath = path.join(__dirname, '../supabase/migrations/00001_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Configura a requisição
    const options = {
      hostname: 'uasnyifizdjxogowijip.supabase.co',
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'apikey': ACCESS_TOKEN
      }
    };

    // Faz a requisição
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.success) {
              console.log('✅ Migrações aplicadas com sucesso!');
              resolve(response);
            } else {
              console.error('❌ Erro ao aplicar migrações:', response.error);
              reject(new Error(response.error));
            }
          } catch (error) {
            console.error('❌ Erro ao processar resposta:', error);
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ Erro na requisição:', error);
        reject(error);
      });

      // Envia o SQL para execução
      req.write(JSON.stringify({
        sql: migrationSQL
      }));
      
      req.end();
    });
  } catch (error) {
    console.error('❌ Erro ao executar migrações:', error);
    throw error;
  }
}

// Executa as migrações
console.log('🚀 Iniciando migrações...');
executeSQLMigration()
  .then(() => {
    console.log('✨ Processo de migração concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Falha no processo de migração:', error);
    process.exit(1);
  }); 