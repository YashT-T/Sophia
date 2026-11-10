import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Tiny CRUD helper: rows + insert/update/remove, reloads after each change.
export function useTable(table, order) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    let q = supabase.from(table).select('*')
    if (order) q = q.order(order, { ascending: true })
    const { data, error } = await q
    if (error) console.error(error)
    setRows(data || [])
    setLoading(false)
  }, [table, order])
  useEffect(() => { load() }, [load])

  const run = async (p) => { const { data, error } = await p; if (error) alert(error.message); await load(); return data }
  const insert = (row) => run(supabase.from(table).insert(row).select().single())
  const update = (id, patch) => run(supabase.from(table).update(patch).eq('id', id))
  const remove = (id) => run(supabase.from(table).delete().eq('id', id))
  return { rows, loading, load, insert, update, remove }
}
