import React, { useState } from 'react';
// Importe apenas os ícones disponíveis
// Importe apenas os ícones disponíveis
import { 
  Cpu,          // Para CPU/GPU
  HardDrive,    // Para armazenamento/RAM
  Star,         // Avaliação
  Heart,        // Favoritos
  ShoppingCart, // Carrinho
  Truck,        // Frete
  SlidersHorizontal, // Filtros
  Search        // Busca
} from 'lucide-react';


import Header from '../../components/layout/Header';

interface Hardware {
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
    clock?: string; // Para CPUs/GPUs
    capacidade?: string; // Para RAM/Armazenamento
    rgb?: boolean; // Luzinha colorida
  };
  numeroAvaliacoes: number;
}

// Mock de hardware
const mockHardware: Hardware[] = [
  {
    id: 1,
    nome: "RTX 4090 Ti",
    preco: 9999.99,
    imagem: "https://images.unsplash.com/photo-1591488320449-011701bb6704",
    freteGratis: true,
    avaliacao: 4.9,
    marca: "NVIDIA",
    tipo: "GPU",
    especificacoes: {
      modelo: "Founders Edition",
      clock: "2.8GHz Boost",
      rgb: true
    },
    numeroAvaliacoes: 789
  },
  {
    id: 2,
    nome: "Ryzen 9 7950X",
    preco: 4299.99,
    precoOriginal: 4999.99,
    imagem: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
    freteGratis: false,
    avaliacao: 5.0,
    marca: "AMD",
    tipo: "CPU",
    especificacoes: {
      modelo: "AM5",
      clock: "4.5GHz Base / 5.7GHz Boost"
    },
    numeroAvaliacoes: 654
  },
  // Adicione mais 5-7 itens...
];

export default function HardwarePage() {
  // Estados dos filtros
  const [precoRange, setPrecoRange] = useState([0, 15000]);
  const [tipoSelecionado, setTipoSelecionado] = useState<string>('Todos');
  const [termoBusca, setTermoBusca] = useState('');

  // Ícones para cada tipo
 const iconesPorTipo = {
  GPU: <Cpu className="text-blue-400" size={20} />,
  CPU: <Cpu className="text-red-400" size={20} />,  // Mesmo ícone, cor diferente
  RAM: <HardDrive className="text-yellow-400" size={20} />,  // Usando HardDrive como módulo
  Armazenamento: <HardDrive className="text-purple-400" size={20} />,
  Cooler: <HardDrive className="text-green-400" size={20} />  // Substitua por ventoinha se quiser
};

  // Filtros
  const hardwareFiltrado = mockHardware.filter(item => {
    // Filtro por preço
    if (item.preco < precoRange[0] || item.preco > precoRange[1]) return false;
    
    // Filtro por tipo
    if (tipoSelecionado !== 'Todos' && item.tipo !== tipoSelecionado) return false;
    
    // Filtro por busca
    if (termoBusca && !item.nome.toLowerCase().includes(termoBusca.toLowerCase())) return false;
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-28 pb-16 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Cpu className="text-blue-400" size={32} />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-300">
            HARDWARE
          </h1>
        </div>
        <p className="text-gray-300 max-w-2xl mx-auto">
          As melhores peças para montar seu PC dos sonhos. Compatibilidade garantida!
        </p>
      </div>

      {/* Barra de filtros */}
      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md border-b border-blue-900/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Pesquisar GPUs, CPUs..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>
          
          {/* Filtro por tipo */}
          <select
            onChange={(e) => setTipoSelecionado(e.target.value)}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
          >
            <option value="Todos">Todos</option>
            <option value="GPU">GPU</option>
            <option value="CPU">CPU</option>
            <option value="RAM">RAM</option>
            <option value="Armazenamento">Armazenamento</option>
          </select>
        </div>
      </div>

      {/* Listagem */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hardwareFiltrado.map(item => (
            <div key={item.id} className="group bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 hover:border-blue-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              {/* Ícone do tipo */}
              <div className="absolute top-3 left-3">
                {iconesPorTipo[item.tipo]}
              </div>
              
              {/* Imagem */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.imagem}
                  alt={item.nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.nome}</h3>
                <p className="text-blue-400 text-sm mb-3">{item.marca} • {item.tipo}</p>

                {/* Especificações */}
                <div className="space-y-2 text-sm text-gray-300 mb-4">
                  {item.especificacoes.clock && (
                    <p><span className="text-blue-400">Clock:</span> {item.especificacoes.clock}</p>
                  )}
                  {item.especificacoes.capacidade && (
                    <p><span className="text-blue-400">Capacidade:</span> {item.especificacoes.capacidade}</p>
                  )}
                  {item.especificacoes.rgb && (
                    <p className="text-pink-400">RGB 🌈</p>
                  )}
                </div>

                {/* Preço */}
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xl font-bold text-blue-400">
                    R$ {item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  {item.freteGratis && (
                    <span className="flex items-center gap-1 text-blue-400 text-sm">
                      <Truck size={16} />
                      <span>Grátis</span>
                    </span>
                  )}
                </div>

                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  <ShoppingCart size={18} />
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}