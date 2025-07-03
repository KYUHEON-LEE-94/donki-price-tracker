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

      let query = supabase
        .from('price_reports')
        .select('*, stores!inner(*)')
        .eq('product_name', selectedProduct);

      if (selectedArea && selectedArea !== '전체') {
        query = query.eq('stores.store_area', selectedArea);
      }

      const { data, error } = await query
        .order('price', { ascending: true })
        .limit(limit);

      if (error) {
        console.error('Error fetching price reports:', error);
        setData([]);
      } else {
        setData(data || []);
      }
    };

    fetchPriceData();
  }, [selectedProduct, selectedArea, limit]);

  return data;
}
