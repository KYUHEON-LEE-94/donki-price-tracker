'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

interface Certification {
  id: string;
  submitted_at: string;
  product_name: string;
  price: number;
  store_id: string;
  image_url: string;
  is_verified: boolean;
  certification_type: 'receipt' | 'photo';
  stores?: {
    store_area: string;
  };
}

export default function CertificationAdminPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [filtered, setFiltered] = useState<Certification[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState('전체');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('price_certifications')
      .select('*, stores(store_area)')
      .order('submitted_at', { ascending: false });

    if (!error && data) {
      const areaList = Array.from(
        new Set(data.map((item) => item.stores?.store_area).filter(Boolean))
      );
      setAreas(['전체', ...areaList]);
      setCertifications(data);
      setFiltered(data);
    }

    setLoading(false);
  };

  const handleFilter = (area: string) => {
    setSelectedArea(area);
    if (area === '전체') {
      setFiltered(certifications);
    } else {
      const result = certifications.filter(
        (c) => c.stores?.store_area === area
      );
      setFiltered(result);
    }
  };

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('price_certifications')
      .update({
        is_verified: true,
        verified_at: new Date().toISOString(),
        verified_by: 'admin@donki.com',
      })
      .eq('id', id);

    if (!error) {
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📮 최저가 인증 요청 관리</h1>

      {/* 지역 필터 */}
      <div className="mb-4">
        <label className="font-medium mr-2">지역 필터:</label>
        <select
          value={selectedArea}
          onChange={(e) => handleFilter(e.target.value)}
          className="border px-3 py-1 rounded-md"
        >
          {areas.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <table className="w-full bg-white shadow rounded-xl overflow-hidden text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">제출일</th>
              <th className="p-3 text-left">상품명</th>
              <th className="p-3 text-left">가격</th>
              <th className="p-3 text-left">지역</th>
              <th className="p-3 text-left">유형</th>
              <th className="p-3 text-left">이미지</th>
              <th className="p-3 text-left">상태</th>
              <th className="p-3 text-left">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  {format(new Date(item.submitted_at), 'yyyy-MM-dd HH:mm')}
                </td>
                <td className="p-3">{item.product_name}</td>
                <td className="p-3">¥{item.price.toLocaleString()}</td>
                <td className="p-3">{item.stores?.store_area ?? '-'}</td>
                <td className="p-3">{item.certification_type}</td>
                <td className="p-3">
                  <a
                    href={item.image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    보기
                  </a>
                </td>
                <td className="p-3">
                  {item.is_verified ? (
                    <span className="text-green-600 font-semibold">
                      ✅ 인증됨
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      ❌ 미인증
                    </span>
                  )}
                </td>
                <td className="p-3">
                  {!item.is_verified && (
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-xs"
                    >
                      인증 승인
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
