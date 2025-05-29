import './globals.css';

// app/layout.tsx
export const metadata = {
  title: '돈키호테 최저가 비교',
  description: '돈키호테 최저가 비교 사이트',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-sans bg-gray-50 text-gray-800">{children}</body>
    </html>
  );
}
