import './globals.css';

// app/layout.tsx
export const metadata = {
  title: 'Donki Price Tracker',
  description: '도톤보리 최저가 비교 사이트',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-sans bg-gray-50 text-gray-800">{children}</body>
    </html>
  );
}
