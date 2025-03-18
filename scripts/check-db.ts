import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function checkDatabase() {
  try {
    console.log('Verificando tabelas do banco de dados...')
    
    // Lista de tabelas necessárias
    const requiredTables = [
      'users',
      'profiles',
      'courses',
      'lessons',
      'assessments',
      'submissions',
      'enrollments',
      'course_materials',
      'notifications',
      'chat_messages',
      'feedback',
      'progress_tracking'
    ]

    // Verificar cada tabela individualmente
    const existingTables: string[] = []
    const missingTables: string[] = []

    for (const table of requiredTables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1)

      if (error) {
        console.log(`Tabela ${table} não existe`)
        missingTables.push(table)
      } else {
        console.log(`Tabela ${table} existe`)
        existingTables.push(table)
      }
    }

    console.log('\nResumo:')
    console.log('\nTabelas existentes:')
    existingTables.forEach(table => console.log(`- ${table}`))
    
    if (missingTables.length > 0) {
      console.log('\nTabelas faltantes:')
      missingTables.forEach(table => console.log(`- ${table}`))
      console.log('\n⚠️  Aviso: Existem tabelas faltando no banco de dados!')
    } else {
      console.log('\n✅ Todas as tabelas necessárias existem no banco de dados!')
    }

  } catch (error) {
    console.error('Erro ao verificar banco de dados:', error)
  }
}

checkDatabase() 