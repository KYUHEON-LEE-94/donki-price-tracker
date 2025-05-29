'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, MapPin, Calendar, Trophy, Star, Image as ImageIcon } from 'lucide-react';

interface PriceReport {
  id: number;
  product_name: string;
  price: number;
  report_date: string;
  stores: {
    store_name: string;
    store_area: string;
    google_url: string;
  };
  photo_url?: string;
}

export default function SubmitListPage() {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('오사카');
  const [storeAreas, setStoreAreas] = useState<string[]>([]);
  const [data, setData] = useState<PriceReport[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 상품명 자동완성
  useEffect(() => {
    const fetchProductNames = async () => {
      if (searchInput.trim() === '') {
        setSuggestions([]);
        return;
      }

      const { data, error } = await supabase
        .from('price_reports')
        .select('product_name')
        .ilike('product_name', `%${searchInput}%`)
        .neq('product_name', null)
        .limit(30);

      if (!error && data) {
        const uniqueNames = Array.from(
          new Set(data.map((item) => item.product_name))
        );
        setSuggestions(uniqueNames);
      }
    };

    fetchProductNames();
  }, [searchInput]);

  // 지역 목록 가져오기
  useEffect(() => {
    const fetchAreas = async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('store_area')
        .neq('store_area', null);

      if (!error && data) {
        const uniqueAreas = Array.from(new Set(data.map((s) => s.store_area)));
        setStoreAreas(uniqueAreas);
      }
    };

    fetchAreas();
  }, []);

  // 가격 데이터 조회
  useEffect(() => {
    const fetchPriceData = async () => {
      if (!selectedProduct) {
        setData([]);
        return;
      }

      const { data, error } = await supabase
        .from('price_reports')
        .select('*, stores(*)')
        .eq('product_name', selectedProduct)
        .order('price', { ascending: true })
        .limit(100);

      if (error) {
        setError(error.message);
      } else {
        const filtered = data?.filter(
          (item) => item.stores.store_area === selectedArea
        );
        setData(filtered?.slice(0, 10) || []);
      }
    };

    fetchPriceData();
  }, [selectedProduct, selectedArea]);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Trophy className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            돈키호테 {selectedArea} 최저가 비교
          </h1>
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400" />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="border px-3 py-1 rounded-lg shadow"
            >
              {storeAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 검색 입력 */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setSelectedProduct(null);
            }}
            placeholder="상품명을 입력하세요 (예: 기노코)"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {suggestions.length > 0 && (
            <ul className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-xl shadow-md mt-2 z-10 max-h-60 overflow-y-auto">
              {suggestions.map((name) => (
                <li
                  key={name}
                  onClick={() => {
                    setSelectedProduct(name);
                    setSearchInput(name);
                    setSuggestions([]);
                  }}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 가격 리스트 */}
        {selectedProduct && (
          <>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-t-xl shadow font-bold flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              가격 순위표 - {selectedProduct}
            </div>
            <table className="w-full bg-white rounded-b-xl shadow overflow-hidden">
              <thead className="text-sm text-gray-600 bg-gray-100">
                <tr>
                  <th className="text-left px-6 py-3">순위</th>
                  <th className="text-left px-6 py-3">지점명</th>
                  <th className="text-left px-6 py-3">가격</th>
                  <th className="text-left px-6 py-3">제보일자</th>
                  <th className="text-left px-6 py-3">지도</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">사진</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">{getRankIcon(index)}</td>
                    <td className="px-6 py-4">{item.stores.store_name}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      ¥{item.price.toLocaleString()}
                      {index === 0 && (
                        <span className="ml-2 text-sm text-green-500">최저가!</span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.report_date).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={item.stores.google_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <MapPin className="w-4 h-4" /> 지도 보기
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      {item.photo_url ? (
                        <a href={item.photo_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
                          <ImageIcon className="w-4 h-4" /> 인증 사진
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
