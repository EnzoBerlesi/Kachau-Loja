import { useMemo } from 'react';

// Hook personalizado para formatação de preço (memoizado)
export const useFormatPrice = () => {
  return useMemo(() => (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }, []);
};

// Hook personalizado para filtros de produtos
export const useProductFilters = <T extends Record<string, unknown>>(
  products: T[],
  filters: Record<string, unknown>
) => {
  return useMemo(() => {
    return products.filter(product => {
      // Lógica genérica de filtros que pode ser reutilizada
      for (const [key, value] of Object.entries(filters)) {
        if (key === 'busca' && value) {
          const productName = (product as { nome?: string }).nome;
          if (!productName?.toLowerCase().includes(String(value).toLowerCase())) {
            return false;
          }
        } else if (key === 'precoMax' && typeof value === 'number' && value > 0) {
          const productPrice = (product as { preco?: number }).preco;
          if (productPrice && productPrice > value) {
            return false;
          }
        } else if (key === 'freteGratis' && value) {
          const productFrete = (product as { freteGratis?: boolean }).freteGratis;
          if (!productFrete) {
            return false;
          }
        }
        // Adicione mais lógicas conforme necessário
      }
      return true;
    });
  }, [products, filters]);
};

// Constantes compartilhadas
export const SCREEN_BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

export const COMMON_COLORS = {
  primary: {
    red: 'red',
    blue: 'blue',
    green: 'green',
    purple: 'purple',
    pink: 'pink'
  }
} as const;
