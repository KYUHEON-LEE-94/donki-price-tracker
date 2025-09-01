'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface VerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PriceReportInsert {
  product_name?: string;
  image_url: string;
  is_verified: boolean;
  submitted_at: string;
  certification_type: string;
}

const PRIE_CERTIFICATIONS_STORAGE = 'price-certifications';
const PRIE_CERTIFICATIONS_TABLE = 'price_certifications';

export default function VerifyModal({ isOpen, onClose }: VerifyModalProps) {
  const [productName, setProductName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!file) return alert('사진을 업로드해주세요');

    try {
      setIsUploading(true);

      const fileExt = file.name.split('.').pop();
      const safeName = `${Date.now()}.${fileExt}`;
      const filePath = `public/${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(PRIE_CERTIFICATIONS_STORAGE)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(PRIE_CERTIFICATIONS_STORAGE)
        .getPublicUrl(filePath);

      const insertPayload: PriceReportInsert = {
        product_name: productName,
        submitted_at: new Date().toISOString(),
        image_url: publicUrlData.publicUrl,
        is_verified: true,
        certification_type: 'receipt'
      };

      console.log('Insert payload:', insertPayload);

      const { error: insertError } = await supabase
        .from(PRIE_CERTIFICATIONS_TABLE)
        .insert(insertPayload);

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error(`데이터베이스 오류: ${insertError.message}`);
      }

      alert('인증 신청이 완료되었습니다!');
      onClose();
    } catch (err: unknown) {
      console.error('Full error:', err);
      alert('업로드 실패: ' + (err instanceof Error ? err.message : JSON.stringify(err)));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
        <h2 className="text-xl font-bold mb-4">📝 최저가 인증 신청</h2>
        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-md mb-4 text-sm">
          ⚠ <strong>인증 안내</strong><br />
          - <strong>영수증</strong>으로 인증 시에만 인증처리됩니다.<br />
          - 제출된 <strong>영수증은 외부에 공개되지 않습니다</strong>.
        </div>

        <label className="block mb-2 font-medium">상품명 *</label>
        <input
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        className="w-full px-4 py-2 border rounded-md mb-4"
        placeholder="예: 기노코"
        />

        <label className="block mb-2 font-medium">영수증 사진 업로드</label>
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
