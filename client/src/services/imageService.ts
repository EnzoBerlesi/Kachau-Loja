// Serviço para lidar com imagens de produtos

// Função para obter uma imagem para um produto
export const getProductImage = (_productId: string, _categoryId?: string): string => {
  // Usar uma das imagens de promoção disponíveis 
  // (números de 1 a 6, conforme visto na estrutura do projeto)
  const randomPromoIndex = Math.floor(Math.random() * 6) + 1;
  return `/assets/promo${randomPromoIndex}.png`;
};

// Função para obter uma imagem placeholder local (sem usar serviços externos)
export const getPlaceholderImage = (_name: string): string => {
  // Usar uma imagem padrão local
  return '/assets/vite.svg'; // Imagem padrão do projeto Vite como fallback
};

export default {
  getProductImage,
  getPlaceholderImage
};
