import React from 'react';

interface FilterOption {
  value: string | number;
  label: string;
}

interface FilterSelectProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: FilterOption[];
  color?: string;
}

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  onChange,
  options,
  color = "red"
}) => (
  <div>
    <label className={`block mb-3 text-${color}-400`}>{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  label,
  checked,
  onChange,
  color = "red"
}) => (
  <div className="flex items-center">
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`h-5 w-5 accent-${color}-500 rounded`}
      />
      <span className="text-gray-300">{label}</span>
    </label>
  </div>
);

interface FilterPanelProps {
  isVisible: boolean;
  children: React.ReactNode;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isVisible, children }) => {
  if (!isVisible) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 mb-8 bg-gray-800/50 rounded-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {children}
      </div>
    </div>
  );
};

export { FilterPanel, FilterSelect, FilterCheckbox };
