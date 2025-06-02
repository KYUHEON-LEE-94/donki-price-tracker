// src/app/components/common/PriceTable.tsx

import { Trophy, Calendar, MapPin, CheckCircle, XCircle } from 'lucide-react';

interface PriceReport {
  id: number;
  product_name: string;
  price: number;
  report_date: string;
  stores: {
    store_name: string;
    store_area: string;
    google_url: string;
    store_url: string;
  };
  is_verified?: string;
}

interface Props {
  data: PriceReport[];
  selectedProduct: string;
}

export default function PriceTable({ data, selectedProduct }: Props) {

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Trophy className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{index + 1}</span>;
    }
  };

  if (data.length === 0) return null;

  return (
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
            <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">인증</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm">
          {data.map((item, index) => (
            <tr key={item.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4">{getRankIcon(index)}</td>
              <td className="px-6 py-4">
                <a href={item.stores.store_url}>{item.stores.store_name}</a>
              </td>
              <td className="px-6 py-4 font-semibold text-green-600">
                ¥{item.price.toLocaleString()}
                {index === 0 && (
                  <span className="ml-2 text-sm text-red-500">최저가!</span>
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
                  <MapPin className="w-4 h-4" />
                </a>
              </td>
              <td className="px-6 py-4">
                {item.is_verified ? (
                  <div className="inline-flex items-center gap-1 text-green-600 font-medium">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 text-gray-600 font-medium">
                    <XCircle className="w-4 h-4" />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
