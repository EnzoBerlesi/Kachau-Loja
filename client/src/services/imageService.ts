// imageService.ts

// 1. Configuração base
const BASE_PATH = '/Images'; // Caminho relativo a partir de public

// 2. Mapeamento automático baseado em palavras-chave
const imageKeywordMap: Record<string, string[]> = {
  // Notebooks
  "notebook/Notebook.jpg": ["notebook", "macbook", "laptop"],
  "notebook/notebookpromo.png": ["vaio", "acer nitro", "asus vivobook"],
  
  // Periféricos - Mouse
  "carrossel/MouseGamer.jpg": ["mouse gamer", "mouse logitech", "mouse sem fio"],
  "gamer/MouseGamer.jpg": ["mouse"],
  "perifericos/mousepadhx.jpg": ["mousepad", "mouse pad"],
  "perifericos/mousepadrazer.jpg": ["mousepad razer"],
  
  // Periféricos - Teclado
  "carrossel/tecladogamer.jpg": ["teclado", "keyboard", "kumara", "kit gamer"],
  
  // Periféricos - Headphone/Fone
  "carrossel/fonegamer.jpg": ["headphone", "fone", "havit"],
  "gamer/fonehxgamer.jpg": ["fone gamer", "headset gamer"],
  
  // Periféricos - Monitor e Webcam
  "perifericos/Monitoracer.jpg": ["monitor acer"],
  "perifericos/monitorbenq.jpg": ["monitor", "benq"],
  "perifericos/webcam.jpeg": ["webcam", "camera", "logitech c920"],
  
  // Gamer/PC
  "gamer/CAdeiraGamer.jpg": ["cadeira", "chair"],
  "gamer/pcGamer.jpeg": ["pc gamer", "computador gamer", "neologic", "gamer completo"],
  "carrossel/notebookfoda.jpg": ["pc barato", "kit gamer completo"],
  "gamer/placaDeVideo.jpeg": ["placa de vídeo", "rx 6600", "gpu", "radeon", "nvidia", "rtx", "gtx"],
  
  // Escritório
  "escritorio/cadeiraazul.jpg": ["cadeira azul"],
  "escritorio/mesapreta.jpg": ["mesa preta", "escrivaninha"],
  "escritorio/Mesaverde.jpg": ["mesa verde"],
  "escritorio/mesavermelha.jpg": ["mesa vermelha"],
};

// 3. Mapeamento direto para produtos específicos (cache)
const productImageMap: Record<string, string> = {};

// 4. Interface para produtos da API
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
}

// 5. Função para determinar imagem baseada no nome do produto
const getImageByKeywords = (productName: string): string => {
  const name = productName.toLowerCase();
  
  for (const [imagePath, keywords] of Object.entries(imageKeywordMap)) {
    for (const keyword of keywords) {
      if (name.includes(keyword.toLowerCase())) {
        return imagePath;
      }
    }
  }
  
  // Fallback baseado na categoria implícita
  if (name.includes('placa de vídeo') || name.includes('gpu') || name.includes('radeon') || name.includes('nvidia')) return "gamer/placaDeVideo.jpeg";
  if (name.includes('webcam') || name.includes('camera')) return "perifericos/webcam.jpeg";
  if (name.includes('mouse')) return "carrossel/MouseGamer.jpg";
  if (name.includes('teclado') || name.includes('keyboard')) return "carrossel/tecladogamer.jpg";
  if (name.includes('monitor')) return "perifericos/monitorbenq.jpg";
  if (name.includes('headphone') || name.includes('fone')) return "carrossel/fonegamer.jpg";
  if (name.includes('notebook') || name.includes('laptop')) return "notebook/Notebook.jpg";
  if (name.includes('pc') || name.includes('computador')) return "gamer/pcGamer.jpeg";
  if (name.includes('cadeira') || name.includes('chair')) return "gamer/CAdeiraGamer.jpg";
  if (name.includes('mesa')) return "escritorio/mesapreta.jpg";
  
  return "vite.svg"; // Fallback final
};

// 6. Função para carregar e mapear produtos da API
export const loadProductImages = async (): Promise<void> => {
  try {
    const response = await fetch('https://kachau-loja.onrender.com/products');
    const products: Product[] = await response.json();
    
    console.log(`🔄 Carregando ${products.length} produtos da API...`);
    
    // Mapeia cada produto para sua imagem correspondente
    products.forEach(product => {
      const imagePath = getImageByKeywords(product.name);
      productImageMap[product.id] = imagePath;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`📸 ${product.name} → ${imagePath}`);
      }
    });
    
    console.log(`✅ Mapeamento de ${products.length} produtos concluído!`);
    
  } catch (error) {
    console.error('❌ Erro ao carregar produtos da API:', error);
  }
};

// 7. Função principal à prova de erros
export const getProductImage = (productId: string | number): string => {
  const idString = String(productId);
  
  // Verifica se o ID existe no mapeamento
  if (!productImageMap[idString]) {
    console.warn(`⚠️ ID não mapeado: ${idString} - Execute loadProductImages() primeiro`);
    return `${BASE_PATH}/vite.svg`; // Fallback
  }

  const imagePath = `${BASE_PATH}/${productImageMap[idString]}`;
  
  // Debug no desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log(`🖼 Carregando imagem: ${imagePath}`);
  }
  
  return imagePath;
};

// 8. Função para obter informações de debug
export const getImageMappingInfo = () => {
  return {
    totalMapped: Object.keys(productImageMap).length,
    mappings: productImageMap,
    keywordMap: imageKeywordMap
  };
};

// 8.5. Função para detectar se é um kit e retornar múltiplas imagens
export const getKitImages = (productName: string): string[] => {
  const name = productName.toLowerCase();
  
  // Se for um kit, retorna múltiplas imagens
  if (name.includes('kit') || name.includes('combo')) {
    const images: string[] = [];
    
    // Verifica quais componentes o kit contém
    if (name.includes('teclado') || name.includes('keyboard')) {
      images.push(`${BASE_PATH}/carrossel/tecladogamer.jpg`);
    }
    if (name.includes('mouse')) {
      images.push(`${BASE_PATH}/carrossel/MouseGamer.jpg`);
    }
    if (name.includes('headphone') || name.includes('fone') || name.includes('headset')) {
      images.push(`${BASE_PATH}/carrossel/fonegamer.jpg`);
    }
    if (name.includes('mousepad')) {
      images.push(`${BASE_PATH}/perifericos/mousepadhx.jpg`);
    }
    
    // Se encontrou componentes, retorna as imagens
    if (images.length > 0) {
      return images;
    }
  }
  
  // Se não for kit, retorna imagem baseada no nome do produto
  const singleImage = getImageByKeywords(productName);
  return [`${BASE_PATH}/${singleImage}`];
};

// 8.7. Função para verificar se um produto é um kit
export const isKit = (productName: string): boolean => {
  const name = productName.toLowerCase();
  return name.includes('kit') || name.includes('combo') || name.includes(' + ');
};