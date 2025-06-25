// imageService.ts

// 1. Configuração base
const BASE_PATH = '/assets'; // Caminho relativo a partir de public

// 2. Mapeamento direto ID → Nome do arquivo (sem o caminho completo)
const productImageMap: Record<string, string> = {
  // IDs como strings (mesmo que sejam números no BD)
  "1": "carrossel/fonegamer.jpg",
  "2": "carrossel/MouseGamer.jpg",
  "3": "carrossel/notebookfoda.jpg",
  // ... complete com todos os produtos
  "101": "escritorio/caderiaazul.jpg",
  "201": "gamer/CAdeiraGamer.jpg",
  "301": "notebook/Notebook.jpg",
  "401": "perifericos/Monitoracer.jpg"
};

// 3. Função principal à prova de erros
export const getProductImage = (productId: string | number): string => {
  const idString = String(productId);
  
  // Verifica se o ID existe no mapeamento
  if (!productImageMap[idString]) {
    console.error(`❌ ID não mapeado: ${idString}`);
    return `${BASE_PATH}/vite.svg`; // Fallback
  }

  const imagePath = `${BASE_PATH}/${productImageMap[idString]}`;
  
  // Debug no desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log(`🖼 Tentando carregar: ${imagePath}`);
    // Teste assíncrono para verificar se o arquivo existe
    fetch(imagePath)
      .then(response => {
        if (!response.ok) {
          console.error(`⚠ Imagem não encontrada: ${imagePath}`);
        }
      })
      .catch(() => {
        console.error(`🚨 Erro ao acessar: ${imagePath}`);
      });
  }

  return imagePath;
};