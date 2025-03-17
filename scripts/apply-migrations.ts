import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'https://uasnyifizdjxogowijip.supabase.co'
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhc255aWZpemRqeG9nb3dpamlwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTU4NjMyMiwiZXhwIjoyMDU3MTYyMzIyfQ.MAp_vHBYhYj32rL3ALKFA919bY2EL-9fAmpI6-qg0bs'

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function applyMigrations() {
  try {
    // Lê o arquivo de migração
    const migrationPath = path.join(__dirname, '../supabase/migrations/00001_initial_schema.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    // Executa a migração
    const { error } = await supabase.rpc('exec_sql', {
      query: migrationSQL
    })

    if (error) {
      console.error('Erro ao aplicar migrações:', error)
      process.exit(1)
    }

    console.log('Migrações aplicadas com sucesso!')
    process.exit(0)
  } catch (error) {
    console.error('Erro ao executar migrações:', error)
    process.exit(1)
  }
}

applyMigrations() 