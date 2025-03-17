const fs = require('fs')
const path = require('path')
const https = require('https')

const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs'

async function applyMigrations() {
  try {
    // Lê o arquivo de migração
    const migrationPath = path.join(__dirname, '../supabase/migrations/00001_initial_schema.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    // Prepara a requisição
    const options = {
      hostname: 'uasnyifizdjxogowijip.supabase.co',
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    }

    // Faz a requisição
    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('Migrações aplicadas com sucesso!')
          process.exit(0)
        } else {
          console.error('Erro ao aplicar migrações:', data)
          process.exit(1)
        }
      })
    })

    req.on('error', (error) => {
      console.error('Erro na requisição:', error)
      process.exit(1)
    })

    // Envia os dados
    req.write(JSON.stringify({
      query: migrationSQL
    }))
    req.end()

  } catch (error) {
    console.error('Erro ao executar migrações:', error)
    process.exit(1)
  }
}

applyMigrations() 