'use client'

import { createClient } from '@/lib/supabase/client'

export default function SupabaseTest() {
  const supabase = createClient()

  const fetchTables = async () => {
    try {
      const { data, error } = await supabase.from('profiles').select('*')
      if (error) throw error
      console.log('Data:', data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teste de Conexão Supabase</h1>
      <button
        onClick={fetchTables}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Buscar Perfis
      </button>
    </div>
  )
} 