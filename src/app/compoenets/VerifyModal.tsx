'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface VerifyModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  

export default function VerifyModal({ isOpen, onClose }: VerifyModalProps) {
  const [price, setPrice] = useState('');
  const [store, setStore] = useState('');
  const [productName, setProductName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!file) {
      alert('사진을 업로드해주세요');
      return;
    }

    try {
      setIsUploading(true);

      // ① Supabase Storage 업로드
      const filePath = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('price-certifications')
        .upload(filePath, file);

        console.log(data?.fullPath);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from('price-certifications')
        .getPublicUrl(filePath);

      const photoUrl = publicUrlData.publicUrl;

      // ② 📌 여기!! Supabase DB insert 하는 부분
      const { error: insertError } = await supabase.from('price_reports').insert({
        product_name: productName,  // <-- 부모에서 받은 productName 사용
        price: parseInt(price),
        report_date: new Date().toISOString(),
        photo_url: photoUrl,
        store_id: null,  // (지점 선택이 붙으면 여기에 store_id 넣을 수 있음)
      });

      if (insertError) throw insertError;

      alert('인증 신청이 완료되었습니다!');
      onClose();
    } catch (err: unknown) {
        if (err instanceof Error) {
    alert('업로드 실패: ' + err.message);
  } else {
    alert('업로드 실패 (알 수 없는 오류)');
  }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
        <h2 className="text-xl font-bold mb-4">📝 최저가 인증 신청</h2>

        <p className="text-sm text-gray-600 mb-4">
          ✅ <strong>인증 사진 안내:</strong> <br/>
          가격표와 상품이 함께 나온 사진을 찍어주세요. <br/>
          영수증 사진도 가능합니다.
        </p>

        <label className="block mb-2 font-medium">지점명</label>
        <input
          type="text"
          value={store}
          onChange={(e) => setStore(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-4"
        />

        <label className="block mb-2 font-medium">상품명</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-4"
        />


        <label className="block mb-2 font-medium">가격 (엔)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-4"
        />

        <label className="block mb-2 font-medium">인증 사진 업로드</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full px-4 py-2 border rounded-md mb-4"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            {isUploading ? '업로드 중...' : '제출하기'}
          </button>
        </div>
      </div>
    </div>
  );
}