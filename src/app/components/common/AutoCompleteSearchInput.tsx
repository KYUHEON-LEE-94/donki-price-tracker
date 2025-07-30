// src/app/components/common/AutoCompleteSearchInput.tsx

import { Search } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';

interface Props {
  searchInput: string;
  setSearchInput: (v: string) => void;
  suggestions: string[];
  showSuggestions: boolean;
  setShowSuggestions: (v: boolean) => void;
  onSelect: (v: string) => void;
}

export default function AutoCompleteSearchInput({
  searchInput,
  setSearchInput,
  suggestions,
  showSuggestions,  
  setShowSuggestions, 
  onSelect
}: Props) {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0) {
        onSelect(suggestions[highlightedIndex]);
        setShowSuggestions(false); // ✅ 목록 닫기
        setHighlightedIndex(-1);
      } else {
        onSelect(searchInput);
      }
    }
  };

  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="상품명을 입력하세요 (예: 기노코)"
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-100"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white shadow-lg rounded-md border mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              onClick={() => {
                onSelect(suggestion);
                setShowSuggestions(false);
              }}
              className={`px-4 py-2 cursor-pointer ${
                highlightedIndex === index ? 'bg-blue-100 font-semibold' : ''
              }`}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
