# 돈키호테 최저가 트래커 (Donki Price Tracker)

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https.img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)

돈키호테 이용자들과 함께 만들어나가는 상품 최저가 정보 공유 플랫폼입니다.

## 🎯 프로젝트 목표

일본 '돈키호테'의 여러 지점에서 판매되는 상품들의 가격 정보를 사용자들이 직접 공유하고, 이를 통해 누구나 원하는 상품을 가장 저렴한 가격에 구매할 수 있도록 돕는 것을 목표로 합니다.

## ✨ 주요 기능

- **가격 정보 등록**: 사용자가 영수증이나 상품 사진을 업로드하여 각 지점의 가격 정보를 손쉽게 등록할 수 있습니다.
- **최저가 비교**: 등록된 데이터를 바탕으로 상품별 최저가를 한눈에 비교하고 확인할 수 있습니다.
- **신뢰성 있는 정보**: 관리자가 사용자가 올린 정보를 검토하고 승인하는 절차를 거쳐 데이터의 신뢰도를 확보합니다.

## 🛠️ 기술 스택

- **프론트엔드**: Next.js, React, TypeScript, Tailwind CSS
- **백엔드 & 데이터베이스**: Supabase
- **주요 라이브러리**: `lucide-react` (아이콘), `date-fns` (날짜 유틸리티)

## 🚀 시작 가이드

1.  **프로젝트 클론**
    ```bash
    git clone <your-repository-url>
    cd donki-price-tracker
    ```

2.  **의존성 설치**
    ```bash
    npm install
    ```

3.  **환경 변수 설정**
    프로젝트의 루트 디렉토리에 `.env.local` 파일을 생성하고, Supabase 프로젝트 URL과 Anon Key를 입력해주세요.
    ```env
    NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    ```

4.  **개발 서버 실행**
    ```bash
    npm run dev
    ```
    이제 브라우저에서 `http://localhost:3000`으로 접속하여 프로젝트를 확인할 수 있습니다.

5. **배포 서버**
    https://donki-price-tracker.vercel.app/

## 🔮 향후 개선 계획

- **AI OCR 기반 영수증 분석**: AI 기술을 도입하여 영수증 이미지를 자동으로 분석하고, 상품명과 가격 정보를 추출하여 데이터 등록 과정을 자동화하고 관리자의 부담을 줄일 계획입니다.