'use client';

import { useState } from 'react';

interface VerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VerifyModal({ isOpen, onClose }: VerifyModalProps) {
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
        <h2 className="text-xl font-bold mb-4">📝 최저가 인증 신청</h2>
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
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-4"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">
            취소
          </button>
          <button
            onClick={() => {
              // TODO: Supabase로 제출 처리
              console.log('제출됨:', { price, imageUrl });
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            제출하기
          </button>
        </div>
      </div>
    </div>
  );
}
