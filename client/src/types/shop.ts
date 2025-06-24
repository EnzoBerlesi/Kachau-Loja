export interface Notebook {
  id: number;
  nome: string;
  preco: number;
  precoOriginal?: number;
  imagem: string;
  freteGratis: boolean;
  avaliacao: number;
  marca: string;
  processador: string;
  ram: string;
  armazenamento: string;
  tela: string;
  desconto?: number;
  categoria: string;
  numeroAvaliacoes: number;
}

export interface Hardware {
  id: number;
  nome: string;
  preco: number;
  precoOriginal?: number;
  imagem: string;
  freteGratis: boolean;
  avaliacao: number;
  marca: string;
  tipo: 'GPU' | 'CPU' | 'RAM' | 'Armazenamento' | 'Cooler';
  especificacoes: {
    modelo: string;
    clock?: string;
    capacidade?: string;
    rgb?: boolean;
  };
  numeroAvaliacoes: number;
}

export interface ProdutoEscritorio {
  id: number;
  nome: string;
  preco: number;
  precoOriginal?: number;
  imagem: string;
  freteGratis: boolean;
  avaliacao: number;
  marca: string;
  especificacoes: {
    bateria: string;
    peso: string;
    tela: string;
  };
  numeroAvaliacoes: number;
}

export interface Periferico {
  id: number;
  nome: string;
  preco: number;
  precoOriginal?: number;
  imagem: string;
  freteGratis: boolean;
  avaliacao: number;
  marca: string;
  tipo: 'Teclado' | 'Mouse' | 'Headset' | 'Mousepad';
  especificacoes: {
    tipo: string;
    rgb: boolean;
    conexao: string;
  };
  numeroAvaliacoes: number;
}

export
  interface Product {
  id: number;
  nome: string;
  preco: number;
  precoOriginal?: number;
  imagem: string;
  freteGratis: boolean;
  avaliacao: number;
  marca: string;
  especificacoes: {
    processador: string;
    ram: string;
    placaVideo: string;
  };
  categoria: string;
  numeroAvaliacoes: number;
}
