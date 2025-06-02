// src/app/hooks/usePriceReports.ts

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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

export function usePriceReports(selectedProduct: string, selectedArea: string, limit: number) {
  const [data, setData] = useState<PriceReport[]>([]);

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
        .limit(limit);

      if (!error && data) {
        const filtered = data.filter(
          (item) => item.stores.store_area === selectedArea
        );
        setData(filtered);
      }
    };

    fetchPriceData();
  }, [selectedProduct, selectedArea, limit]);

  return data;
}
