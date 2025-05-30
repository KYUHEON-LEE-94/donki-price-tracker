'use client';

import { useState } from 'react';

interface VerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VerifyModal({ isOpen, onClose }: VerifyModalProps) {
  const [price, setPrice] = useState('');
  const [store, setStore] = useState('');
  const [file, setFile] = useState<File | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl relative">
        <h2 className="text-xl font-bold mb-4">📝 최저가 인증 신청</h2>

        <p className="text-sm text-gray-600 mb-4">
          ✅ <strong>인증 사진 안내:</strong> <br/>
          가격표와 상품이 함께 나온 사진을 찍어주세요. <br/>
          (예: 진열대에서 가격표와 상품명이 같이 보이게)
        </p>

        <label className="block mb-2 font-medium">가격 (엔)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full px-4 py-2 border rounded-md mb-4"
        />

        <label className="block mb-2 font-medium">지점명</label>
        <input
          type="text"
          value={store}
          onChange={(e) => setStore(e.target.value)}
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
            onClick={() => {
              console.log('제출됨:', { price, file });
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
