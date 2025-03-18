import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function executeSQL() {
  try {
    console.log('Lendo arquivo SQL...')
    const sqlFile = path.join(__dirname, 'create-tables.sql')
    const sql = fs.readFileSync(sqlFile, 'utf8')

    console.log('Executando SQL no Supabase...')
    const { error } = await supabase.rpc('exec_sql', { sql })

    if (error) {
      console.error('Erro ao executar SQL:', error.message)
      return
    }

    console.log('✅ SQL executado com sucesso!')
  } catch (error) {
    console.error('Erro ao executar script:', error)
  }
}

executeSQL() 