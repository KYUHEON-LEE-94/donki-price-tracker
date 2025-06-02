// src/app/components/common/AreaSelector.tsx

interface Props {
    areas: string[];
    selectedArea: string;
    onChange: (value: string) => void;
  }
  
  export default function AreaSelector({ areas, selectedArea, onChange }: Props) {
    return (
      <select
        value={selectedArea}
        onChange={(e) => onChange(e.target.value)}
        className="border px-3 py-1 rounded-lg shadow"
      >
        {areas.map((area) => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
      </select>
    );
  }
  