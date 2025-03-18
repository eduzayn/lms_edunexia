import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
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

    // Consulta para obter todas as tabelas existentes
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const existingTables = tables.map(table => table.table_name)
    const missingTables = requiredTables.filter(table => !existingTables.includes(table))

    return NextResponse.json({
      status: 'success',
      existingTables,
      missingTables,
      allRequiredTablesExist: missingTables.length === 0
    })
  } catch (error) {
    console.error('Error checking database tables:', error)
    return NextResponse.json(
      { error: 'Erro ao verificar tabelas do banco de dados' },
      { status: 500 }
    )
  }
} 