'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export default function SupabaseTest() {
  const supabase = createClient(supabaseUrl, supabaseKey)

  const fetchTables = async () => {
    try {
      const { data, error } = await supabase.from('your_table').select('*')
      if (error) throw error
      console.log('Data:', data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Test</h1>
      <button
        onClick={fetchTables}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Fetch Tables
      </button>
    </div>
  )
} 