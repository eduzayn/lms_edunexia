'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function SupabaseTest() {
  const [tables, setTables] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTables() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from('pg_tables')
          .select('tablename')
          .eq('schemaname', 'public')
        
        if (error) {
          throw error
        }

        if (data) {
          setTables(data.map(table => table.tablename))
        }
      } catch (err) {
        console.error('Erro ao buscar tabelas:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      }
    }

    fetchTables()
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Teste de Conexão Supabase</h2>
      {error ? (
        <div className="text-red-500">
          <p>Erro na conexão:</p>
          <pre>{error}</pre>
        </div>
      ) : (
        <div>
          <p className="mb-2">Tabelas encontradas:</p>
          {tables.length > 0 ? (
            <ul className="list-disc pl-5">
              {tables.map(table => (
                <li key={table}>{table}</li>
              ))}
            </ul>
          ) : (
            <p>Nenhuma tabela encontrada</p>
          )}
        </div>
      )}
    </div>
  )
} 