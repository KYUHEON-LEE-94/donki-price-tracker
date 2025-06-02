// src/app/hooks/useAreas.ts

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useAreas() {
  const [areas, setAreas] = useState<string[]>([]);

  useEffect(() => {
    const fetchAreas = async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('store_area')
        .neq('store_area', null);

      if (!error && data) {
        const uniqueAreas = Array.from(new Set(data.map((s) => s.store_area)));
        setAreas(uniqueAreas);
      }
    };

    fetchAreas();
  }, []);

  return areas;
}
