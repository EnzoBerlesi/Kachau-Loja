import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchAndFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onToggleFilters: () => void;
  placeholder?: string;
  primaryColor?: string;
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchValue,
  onSearchChange,
  onToggleFilters,
  placeholder = "Buscar produtos...",
  primaryColor = "red"
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 mb-8">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={placeholder}
            className={`w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-${primaryColor}-500 focus:outline-none`}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button
          onClick={onToggleFilters}
          className={`px-6 py-3 bg-${primaryColor}-800/70 hover:bg-${primaryColor}-700/80 rounded-xl flex items-center gap-2 transition-colors`}
        >
          <SlidersHorizontal size={18} />
          <span>Filtros</span>
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilters;
