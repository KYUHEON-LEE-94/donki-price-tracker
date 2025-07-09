'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface PriceReport {
  id: string;
  product_name: string;
  price: number;
  report_date: string;
  currency: string;
  reporter_nickname: string;
  is_verified: boolean;
  certification_id: string;
  store_id: string;
}

interface PriceReportWithStore extends PriceReport {
  stores?: {
    store_name: string;
    store_area: string;
  };
}

export default function ReportAdminPage() {
  const [reports, setReports] = useState<PriceReportWithStore[]>([]);
  const [filteredReports, setFilteredReports] = useState<PriceReportWithStore[]>([]);
  const [productNames, setProductNames] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('전체');
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('price_reports')
      .select('*, stores(store_name, store_area)')
      .order('report_date', { ascending: false });

    if (!error && data) {
      const typed = data as PriceReportWithStore[];

      const uniqueNames = Array.from(
        new Set(typed.map((r) => r.product_name).filter(Boolean))
      );
      setProductNames(['전체', ...uniqueNames]);
      setReports(typed);
      setFilteredReports(typed);
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      const { error } = await supabase.from('price_reports').delete().eq('id', id);
      if (!error) fetchReports();
    }
  };

  const handleFilter = (name: string) => {
    setSelectedProduct(name);
    if (name === '전체') {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter((r) => r.product_name === name));
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🏆 최저가 목록 관리</h1>

      {/* 상품 필터 */}
      <div className="mb-4">
        <label className="font-medium mr-2">상품명 필터:</label>
        <select
          value={selectedProduct}
          onChange={(e) => handleFilter(e.target.value)}
          className="border px-3 py-1 rounded-md"
        >
          {productNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <table className="w-full bg-white shadow rounded-xl overflow-hidden text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">상품명</th>
              <th className="p-3">가격</th>
              <th className="p-3">통화</th>
              <th className="p-3">지점</th>
              <th className="p-3">제보자</th>
              <th className="p-3">일자</th>
              <th className="p-3">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{item.product_name}</td>
                <td className="p-3 font-semibold text-green-700">¥{item.price.toLocaleString()}</td>
                <td className="p-3">{item.currency}</td>
                <td className="p-3">{item.stores?.store_name ?? '-'}</td>
                <td className="p-3">{item.reporter_nickname}</td>
                <td className="p-3">{new Date(item.report_date).toLocaleDateString('ko-KR')}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500 text-sm"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
