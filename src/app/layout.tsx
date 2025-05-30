import './globals.css';

// app/layout.tsx
export const metadata = {
  title: '돈키호테 오사카 최저가 비교',
  description: '일본 돈키호테 오사카 지역의 인기 상품 최저가를 비교하고 실시간으로 확인하세요. 최저가 인증으로 더 많은 정보를 공유할 수 있습니다.',
  icons: {
    icon: '/favicon.ico',
  },
  keywords: '돈키호테, 오사카, 최저가 비교, 일본 쇼핑, 가격비교, 돈키호테 가격, 일본 여행 쇼핑, 돈키호테 세일, 돈키호테 할인',
  openGraph: {
    title: '돈키호테 오사카 최저가 비교',
    description: '오사카 돈키호테 인기 상품 실시간 최저가 비교 플랫폼',
    url: 'https://donki-price-tracker.vercel.app/',
    siteName: '돈키호테 최저가 비교',
    images: [
      {
        url: 'https://donki-price-tracker.vercel.app/favicon.ico',
        width: 1200,
        height: 630,
        alt: '돈키호테 최저가 비교 대표 이미지',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  robots: 'index, follow',
  charset: 'utf-8',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="font-sans bg-gray-50 text-gray-800">{children}</body>
    </html>
  );
}
