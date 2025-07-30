'use client';

import { useState } from 'react';
import { useProductSearch } from '@/app/hooks/useProductSearch';
import { useAreas } from '@/app/hooks/useAreas';
import { usePriceReports } from '@/app/hooks/usePriceReports';
import Header from '@/app/components/common/Header';
import AreaSelector from '@/app/components/common/AreaSelector';
import LimitSelector from '@/app/components/common/LimitSelector';
import AutoCompleteSearchInput from '@/app/components/common/AutoCompleteSearchInput';
import PriceTable from '@/app/components/common/PriceTable';
import VerifyModal from '@/app/components/modals/VerifyModal';
import Footer from '@/app/components/common/Footer';
import { Star } from 'lucide-react';

export default function SubmitPage() {
  const [searchInput, setSearchInput] = useState('');
  const suggestions = useProductSearch(searchInput);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const areas = useAreas();
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedArea, setSelectedArea] = useState('오사카');
  const [limit, setLimit] = useState(10);
  const priceReports = usePriceReports(selectedProduct, selectedArea, limit);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Header selectedArea={selectedArea} />
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400" />
            
            <AreaSelector
              areas={areas}
              selectedArea={selectedArea}
              onChange={(value) => setSelectedArea(value)}
            />

            <LimitSelector
              limit={limit}
              onChange={(value) => setLimit(value)}
            />
          </div>
        </div>

        <AutoCompleteSearchInput
          searchInput={searchInput}
          setSearchInput={(v) => {
            setSearchInput(v);
            setShowSuggestions(true);
          }}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          onSelect={(selected) => {
            setSearchInput(selected);
            setSelectedProduct(selected);
            setShowSuggestions(false); 
          }}
        />

        <PriceTable data={priceReports} selectedProduct={selectedProduct} />

        <div className="mt-6 flex justify-end">
          <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg">
            ✅ 최저가 인증 신청
          </button>
        </div>

        <VerifyModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </div>
      <Footer />
    </div>
  )
}
