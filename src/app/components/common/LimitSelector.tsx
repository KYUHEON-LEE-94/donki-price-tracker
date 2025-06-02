// src/app/components/common/LimitSelector.tsx

interface Props {
    limit: number;
    onChange: (value: number) => void;
  }
  
  export default function LimitSelector({ limit, onChange }: Props) {
    return (
      <select
        value={limit}
        onChange={(e) => onChange(Number(e.target.value))}
        className="border px-3 py-1 rounded-lg shadow"
      >
        <option value={10}>10개</option>
        <option value={20}>20개</option>
        <option value={50}>50개</option>
      </select>
    );
  }
  