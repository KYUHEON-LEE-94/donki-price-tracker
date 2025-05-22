'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Store = {
  id: number;
  store_name: string;
  store_area: string;
  store_address: string;
  store_url: string;
  google_url: string;
  created_at: string;
}

export default function SupaTestPage() {
  const [stores, setStores] = useState<Store[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStores = async () => {
      const { data, error } = await supabase.from('stores').select('*')
      if (error) setError(error.message)
      else setStores(data)
    }

    fetchStores()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">📦 Supabase 연결 테스트</h1>

      {error && <p className="text-red-600">오류: {error}</p>}

      {stores.length === 0 ? (
        <p>지점 데이터를 불러오는 중...</p>
      ) : (
        <ul className="list-disc pl-5">
          {stores.map((store) => (
            <li key={store.id}>
              {store.store_name} ({store.store_area})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
