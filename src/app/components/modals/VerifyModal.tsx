'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface VerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PriceReportInsert {
    product_name?: string;
    price?: number;
    store_name?: string;
    report_date: string;
    photo_url: string;
    is_verified: boolean;
    submitted_at: string;
    certification_type: string;
  }

const PRIE_CERTIFICATIONS_STORAGE = 'price-certifications';
const PRIE_CERTIFICATIONS_TABLE = 'price_certifications'

export default function VerifyModal({ isOpen, onClose }: VerifyModalProps) {
  const [verifyType, setVerifyType] = useState<'receipt' | 'photo'>('receipt');
  const [price, setPrice] = useState('');
  const [store, setStore] = useState('');
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
  
  
      // payload 준비
      const insertPayload: PriceReportInsert = {
        submitted_at: new Date().toISOString(),
        photo_url: publicUrlData.publicUrl,
        is_verified: verifyType === 'receipt',
        certification_type: verifyType,
        report_date: new Date().toISOString()
      };
  
      if (verifyType === 'photo') {
        insertPayload.product_name = productName;
        insertPayload.price = parseInt(price);
        insertPayload.store_name = store;
        insertPayload.is_verified = false;
        insertPayload.certification_type = verifyType
      }
  
      console.log(insertPayload);

      const { error: insertError } = await supabase
        .from(PRIE_CERTIFICATIONS_TABLE)
        .insert(insertPayload);

      if (insertError) throw insertError;
  
      alert('인증 신청이 완료되었습니다!');
      onClose();
    } catch (err: unknown) {
      alert('업로드 실패: ' + (err instanceof Error ? err.message : '알 수 없는 오류'));
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
        - <strong>영수증</strong>으로 인증 시만 인증처리됩니다.<br />
        - 일반 사진 인증은 <strong>미인증 처리</strong>됩니다.<br />
        - 제출된 <strong>영수증 및 인증 사진은 외부에 공개되지 않습니다</strong>.
        </div>
        <div className="mb-4">
          <label className="font-medium block mb-2">인증 방식 선택</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="receipt"
                checked={verifyType === 'receipt'}
                onChange={() => setVerifyType('receipt')}
              />
              영수증 인증
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="photo"
                checked={verifyType === 'photo'}
                onChange={() => setVerifyType('photo')}
              />
              일반 사진 인증
            </label>
          </div>
        </div>

        {verifyType === 'photo' && (
          <>
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
          </>
        )}

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
