const fs = require('fs');
const path = require('path');
const https = require('https');

const SUPABASE_URL = 'https://uasnyifizdjxogowijip.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs';

async function executeMigration() {
  try {
    // Lê o arquivo SQL
    const migrationPath = path.join(__dirname, '../supabase/migrations/00001_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Prepara a requisição
    const options = {
      hostname: 'uasnyifizdjxogowijip.supabase.co',
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`
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
          if (res.statusCode === 200) {
            console.log('✅ Migrações aplicadas com sucesso!');
            resolve(data);
          } else {
            console.error('❌ Erro ao aplicar migrações:', data);
            reject(new Error(data));
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ Erro na requisição:', error);
        reject(error);
      });

      // Envia os dados
      const payload = JSON.stringify({ sql });
      req.write(payload);
      req.end();
    });
  } catch (error) {
    console.error('❌ Erro ao executar migrações:', error);
    throw error;
  }
}

// Executa as migrações
console.log('🚀 Iniciando migrações...');
executeMigration()
  .then(() => {
    console.log('✨ Processo de migração concluído!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Falha no processo de migração:', error);
    process.exit(1);
  }); 