// src/app/components/common/Header.tsx

export default function Header({ selectedArea }: { selectedArea: string }) {
    return (
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        돈키호테 {selectedArea} 최저가 비교
      </h1>
    );
  }
  