// src/app/hooks/useProductSearch.ts

import { useState, useEffect } from 'react';
import { supabase } from  '@/lib/supabase';

export function useProductSearch(searchInput: string) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetch = async () => {
      if (!searchInput) {
        setSuggestions([]);
        return;
      }

      const { data, error } = await supabase
        .from('price_reports')
        .select('product_name')
        .ilike('product_name', `%${searchInput}%`)
        .neq('product_name', null)
        .limit(10);

      if (!error && data) {
        const uniqueNames = [...new Set(data.map(d => d.product_name))];
        setSuggestions(uniqueNames);
      }
    };

    fetch();
  }, [searchInput]);

  return suggestions;
}
