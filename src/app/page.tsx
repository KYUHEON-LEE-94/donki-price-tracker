'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, MapPin, Calendar, Trophy, Star } from 'lucide-react';

interface PriceReport {
  id: number;
  product_name: string;
  price: number;
  report_date: string;
  stores: {
    store_name: string;
    google_url: string;
  };
}

export default function SubmitListPage() {
  const [data, setData] = useState<PriceReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState('기노코');

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
      .from('price_reports')
      .select('*, stores(*)')
      .like('product_name', `%${selectedProduct}%`)
      .order('report_date', { ascending: false })
      .limit(10);

      if (error) {
        setError(error.message);
      } else {
        setData(data || []);
      }
    };

    fetchData();
  }, [selectedProduct]);

  const getRankIcon = (index: number) => {
    switch(index) {
      case 0: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1: return <Trophy className="w-5 h-5 text-gray-400" />;
      case 2: return <Trophy className="w-5 h-5 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-500">#{index + 1}</span>;
    }
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (index === 1) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (index === 2) return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
    return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800';
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* 헤더 섹션 */}
        <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 transform rotate-12 translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400 to-red-500 rounded-full opacity-10 transform -rotate-12 -translate-x-12 translate-y-12"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                돈키호테 오사카 최저가 비교
              </h1>
              <p className="text-gray-600 text-lg">실시간 가격 정보로 똑똑한 쇼핑하세요!</p>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <select className="bg-white border-2 border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium shadow-sm hover:border-blue-300 transition-colors focus:ring-2 focus:ring-blue-100 focus:border-blue-400">
                <option>🏙️ 오사카</option>
              </select>
            </div>
          </div>
        </div>

        {/* 검색 섹션 */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              placeholder="원하는 상품명을 입력하세요 (예: 포카리스웨트, 킷캣)"
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl text-lg shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 placeholder-gray-400"
            />
          </div>
        </div>

        {/* 테이블 섹션 */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              가격 순위표
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">순위</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">지점명</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">가격</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">제보일자</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">지도</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
                  >
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${getRankBadge(index)} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                        {getRankIcon(index)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                        {item.stores.store_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-2xl font-bold text-green-600">
                        ¥{item.price.toLocaleString()}
                      </div>
                      {index === 0 && (
                        <div className="text-sm text-green-500 font-medium">최저가!</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(item.report_date).toLocaleDateString('ko-KR')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={item.stores.google_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        <MapPin className="w-4 h-4" />
                        지도 보기
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 푸터 정보 */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <p className="text-gray-600 mb-2">💡 <strong>팁:</strong> 가격은 실시간으로 업데이트되며, 재고 상황에 따라 달라질 수 있습니다.</p>
            <p className="text-sm text-gray-500">마지막 업데이트: 2025-05-29</p>
          </div>
        </div>
      </div>
    </div>
  );
}
