import React from 'react';

interface ProductGridProps {
  children: React.ReactNode;
  emptyMessage?: string;
  onClearFilters?: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  children, 
  emptyMessage = "Nenhum produto encontrado",
  onClearFilters 
}) => {
  const childrenArray = React.Children.toArray(children);
  
  return (
    <main className="max-w-7xl mx-auto px-4 pb-12">
      {childrenArray.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {children}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl text-gray-400 mb-4">
            {emptyMessage}
          </p>
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}
    </main>
  );
};

export default ProductGrid;
