'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface Store {
  id: string;
  store_name: string;
  store_area: string;
  store_url?: string;
  google_url?: string;
  created_at?: string;
}

export default function StoreAdminPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState('전체');

  const [newStore, setNewStore] = useState<Omit<Store, 'id'>>({
    store_name: '',
    store_area: '',
    store_url: '',
    google_url: '',
  });

  const fetchStores = async () => {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setStores(data);
      setFilteredStores(data);
      const uniqueAreas = Array.from(new Set(data.map((s) => s.store_area).filter(Boolean)));
      setAreas(['전체', ...uniqueAreas]);
    }
  };

  const handleFilter = (area: string) => {
    setSelectedArea(area);
    if (area === '전체') {
      setFilteredStores(stores);
    } else {
      setFilteredStores(stores.filter((s) => s.store_area === area));
    }
  };

  const handleCreate = async () => {
    if (!newStore.store_name || !newStore.store_area) {
      alert('지점명과 지역명은 필수입니다.');
      return;
    }

    const { error } = await supabase.from('stores').insert({
      id: uuidv4(),
      ...newStore,
      created_at: new Date().toISOString(),
    });

    if (!error) {
      setNewStore({ store_name: '', store_area: '', store_url: '', google_url: '' });
      fetchStores();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const { error } = await supabase.from('stores').delete().eq('id', id);
      if (!error) fetchStores();
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🏬 돈키호테 지점 관리</h1>

      {/* 지역 필터 */}
      <div className="mb-4">
        <label className="font-medium mr-2">지역 필터:</label>
        <select
          value={selectedArea}
          onChange={(e) => handleFilter(e.target.value)}
          className="border px-3 py-1 rounded-md"
        >
          {areas.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>

      {/* 등록 폼 */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 space-y-2">
        <h2 className="text-lg font-bold mb-4 text-purple-700 flex items-center gap-2">
          <span className="text-purple-500">➕</span> 지점 등록
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">지점명 *</label>
            <input
              type="text"
              value={newStore.store_name}
              onChange={(e) => setNewStore({ ...newStore, store_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100"
              placeholder="예: 미노오점"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">지역명 *</label>
            <input
              type="text"
              value={newStore.store_area}
              onChange={(e) => setNewStore({ ...newStore, store_area: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-100"
              placeholder="예: 오사카"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">지점 웹 URL (선택)</label>
            <input
              type="url"
              value={newStore.store_url}
              onChange={(e) => setNewStore({ ...newStore, store_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              placeholder="https://www.donki.com/store/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Google 지도 URL (선택)</label>
            <input
              type="url"
              value={newStore.google_url}
              onChange={(e) => setNewStore({ ...newStore, google_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              placeholder="https://maps.google.com/..."
            />
          </div>
        </div>

        {/* 등록 버튼 */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleCreate}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow"
          >
            등록
          </button>
        </div>
        
      </div>

      {/* 지점 목록 */}
      <table className="w-full bg-white rounded-xl shadow overflow-hidden text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">지점명</th>
            <th className="p-3">지역</th>
            <th className="p-3">URL</th>
            <th className="p-3">지도</th>
            <th className="p-3">관리</th>
          </tr>
        </thead>
        <tbody>
          {filteredStores.map((store) => (
            <tr key={store.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{store.store_name}</td>
              <td className="p-3">{store.store_area}</td>
              <td className="p-3">
                {store.store_url && <a href={store.store_url} className="text-blue-500" target="_blank">바로가기</a>}
              </td>
              <td className="p-3">
                {store.google_url && <a href={store.google_url} className="text-blue-500" target="_blank">지도</a>}
              </td>
              <td className="p-3">
                <button onClick={() => handleDelete(store.id)} className="text-red-500 text-sm">삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
