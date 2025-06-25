import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cpu,
  HardDrive,
  MemoryStick,
  Fan,
  ShoppingCart,
  Truck,
  Search,
  SlidersHorizontal,
  Star,
  Heart,
  Zap
} from 'lucide-react';
import Header from '../../components/layout/Header';

type Hardware = {
  id: number;
  nome: string;
  preco: number;
  precoOriginal?: number;
  imagem: string;
  freteGratis: boolean;
  avaliacao: number;
  marca: string;
  tipo: "GPU" | "CPU" | "RAM" | "Armazenamento" | "Cooler" | "Placa-Mãe";
  especificacoes: {
    modelo?: string;
    clock?: string;
    rgb?: boolean;
    capacidade?: string;
    slots?: string;
  };
  desconto?: number;
  numeroAvaliacoes: number;
};

const mockHardware: Hardware[] = [
  {
    id: 1,
    nome: "RTX 4090 Ti Founders Edition",
    preco: 9999.99,
    precoOriginal: 11999.99,
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
    desconto: 17,
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
    desconto: 14,
    numeroAvaliacoes: 654
  },
  {
    id: 3,
    nome: "Kingston Fury Beast 32GB DDR5",
    preco: 899.99,
    imagem: "https://images.unsplash.com/photo-1600348759980-5e2b518e55a7",
    freteGratis: true,
    avaliacao: 4.7,
    marca: "Kingston",
    tipo: "RAM",
    especificacoes: {
      capacidade: "32GB (2x16GB)",
      clock: "5600MHz",
      rgb: true
    },
    numeroAvaliacoes: 432
  },
  {
    id: 4,
    nome: "SSD NVMe Samsung 980 Pro 2TB",
    preco: 1299.99,
    precoOriginal: 1599.99,
    imagem: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
    freteGratis: true,
    avaliacao: 4.8,
    marca: "Samsung",
    tipo: "Armazenamento",
    especificacoes: {
      capacidade: "2TB",
      clock: "7000MB/s leitura"
    },
    desconto: 19,
    numeroAvaliacoes: 876
  },
  {
    id: 5,
    nome: "Water Cooler Master Liquid ML360",
    preco: 799.99,
    imagem: "https://images.unsplash.com/photo-1592921870789-045959c7eabc",
    freteGratis: false,
    avaliacao: 4.5,
    marca: "Cooler Master",
    tipo: "Cooler",
    especificacoes: {
      modelo: "ML360 RGB",
      rgb: true
    },
    numeroAvaliacoes: 321
  },
  {
    id: 6,
    nome: "Asus ROG Strix Z790-E",
    preco: 3499.99,
    imagem: "https://images.unsplash.com/photo-1563212035-3e8ffdf31f8e",
    freteGratis: true,
    avaliacao: 4.6,
    marca: "ASUS",
    tipo: "Placa-Mãe",
    especificacoes: {
      modelo: "LGA 1700",
      slots: "DDR5, PCIe 5.0",
      rgb: true
    },
    numeroAvaliacoes: 543
  }
];

export default function HardwarePage() {
  const navigate = useNavigate();
  
  // Estados dos filtros (completo como notebooks)
  const [precoRange, setPrecoRange] = useState([0, 15000]);
  const [freteGratis, setFreteGratis] = useState(false);
  const [avaliacaoMinima, setAvaliacaoMinima] = useState(0);
  const [marcasSelecionadas, setMarcasSelecionadas] = useState<string[]>([]);
  const [tiposSelecionados, setTiposSelecionados] = useState<string[]>([]);
  const [rgb, setRgb] = useState<boolean | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filtros dinâmicos
  const marcasDisponiveis = [...new Set(mockHardware.map(item => item.marca))];
  const tiposDisponiveis = [...new Set(mockHardware.map(item => item.tipo))];

  // Ícones para cada tipo
  const iconesPorTipo = {
    GPU: <Cpu className="text-blue-400" size={20} />,
    CPU: <Zap className="text-red-400" size={20} />,
    RAM: <MemoryStick className="text-yellow-400" size={20} />,
    Armazenamento: <HardDrive className="text-purple-400" size={20} />,
    Cooler: <Fan className="text-green-400" size={20} />,
    "Placa-Mãe": <Cpu className="text-pink-400" size={20} />
  };

  // Aplicando filtros
  const hardwareFiltrado = mockHardware.filter(item => {
    // Filtro por preço
    if (item.preco < precoRange[0] || item.preco > precoRange[1]) return false;
    
    // Filtro por frete
    if (freteGratis && !item.freteGratis) return false;
    
    // Filtro por avaliação
    if (item.avaliacao < avaliacaoMinima) return false;
    
    // Filtro por marca
    if (marcasSelecionadas.length > 0 && !marcasSelecionadas.includes(item.marca)) return false;
    
    // Filtro por tipo
    if (tiposSelecionados.length > 0 && !tiposSelecionados.includes(item.tipo)) return false;
    
    // Filtro por RGB
    if (rgb !== null && item.especificacoes.rgb !== rgb) return false;
    
    // Filtro por busca
    if (termoBusca && !item.nome.toLowerCase().includes(termoBusca.toLowerCase())) return false;
    
    return true;
  });

  // Componente de estrelas
  const RenderStars = ({ rating }: { rating: number }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={16}
          className={`${
            star <= rating ? "text-yellow-400 fill-current" : "text-gray-400"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900 text-white">
      <Header />
      
      {/* Hero Section - Estilo Tech */}
      <div className="pt-28 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2232&auto=format&fit=crop')] bg-cover opacity-10"></div>
        <div className="relative">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex space-x-2">
              <Cpu className="text-blue-400" size={32} />
              <MemoryStick className="text-yellow-400" size={32} />
              <HardDrive className="text-purple-400" size={32} />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
              HARDWARE PRO
            </h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            As peças mais potentes para sua máquina. Performance extrema para gamers e criadores!
          </p>
        </div>
      </div>

      {/* Barra de filtros - Estilo Cyberpunk */}
      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" size={18} />
            <input
              type="text"
              placeholder="Pesquisar hardware..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:outline-none border border-gray-700"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-800 hover:bg-cyan-700 rounded-lg transition-colors border border-cyan-600/50"
          >
            <SlidersHorizontal size={18} />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Filtros expandidos - Estilo Dark Tech */}
      {showFilters && (
        <div className="bg-gray-800/90 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Faixa de Preço */}
            <div>
              <h3 className="font-medium mb-3 text-cyan-400">
                Faixa de Preço
              </h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="15000"
                  step="100"
                  value={precoRange[1]}
                  onChange={(e) =>
                    setPrecoRange([precoRange[0], Number(e.target.value)])
                  }
                  className="w-full accent-cyan-500"
                />
                <div className="flex justify-between text-sm text-gray-300">
                  <span>R$ {precoRange[0].toLocaleString('pt-BR')}</span>
                  <span>R$ {precoRange[1].toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>

            {/* Marcas */}
            <div>
              <h3 className="font-medium mb-3 text-cyan-400">Marcas</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {marcasDisponiveis.map((marca) => (
                  <label
                    key={marca}
                    className="flex items-center gap-2 cursor-pointer hover:text-cyan-300"
                  >
                    <input
                      type="checkbox"
                      checked={marcasSelecionadas.includes(marca)}
                      onChange={() =>
                        setMarcasSelecionadas((prev) =>
                          prev.includes(marca)
                            ? prev.filter((m) => m !== marca)
                            : [...prev, marca]
                        )
                      }
                      className="rounded text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>{marca}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tipos */}
            <div>
              <h3 className="font-medium mb-3 text-cyan-400">Tipos</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                {tiposDisponiveis.map((tipo) => (
                  <label
                    key={tipo}
                    className="flex items-center gap-2 cursor-pointer hover:text-cyan-300"
                  >
                    <input
                      type="checkbox"
                      checked={tiposSelecionados.includes(tipo)}
                      onChange={() =>
                        setTiposSelecionados((prev) =>
                          prev.includes(tipo)
                            ? prev.filter((t) => t !== tipo)
                            : [...prev, tipo]
                        )
                      }
                      className="rounded text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="flex items-center gap-1">
                      {iconesPorTipo[tipo]}
                      {tipo}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Outros Filtros */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3 text-cyan-400">RGB</h3>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-cyan-300">
                    <input
                      type="radio"
                      name="rgb"
                      checked={rgb === true}
                      onChange={() => setRgb(true)}
                      className="text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>Com RGB</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-cyan-300">
                    <input
                      type="radio"
                      name="rgb"
                      checked={rgb === false}
                      onChange={() => setRgb(false)}
                      className="text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>Sem RGB</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-cyan-300">
                    <input
                      type="radio"
                      name="rgb"
                      checked={rgb === null}
                      onChange={() => setRgb(null)}
                      className="text-cyan-500 focus:ring-cyan-500"
                    />
                    <span>Todos</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer hover:text-cyan-300">
                  <input
                    type="checkbox"
                    checked={freteGratis}
                    onChange={() => setFreteGratis(!freteGratis)}
                    className="rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Frete Grátis</span>
                </label>

                <div>
                  <h3 className="font-medium mb-2 text-cyan-400">Avaliação Mínima</h3>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setAvaliacaoMinima(star)}
                        className={`p-1 ${
                          avaliacaoMinima >= star
                            ? "text-yellow-400"
                            : "text-gray-500"
                        }`}
                      >
                        <Star
                          size={20}
                          fill={avaliacaoMinima >= star ? "currentColor" : "none"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Listagem - Estilo Cards Tech */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hardwareFiltrado.map(item => (
            <div 
              key={item.id} 
              onClick={() => navigate(`/product/${item.id}`)}
              className="group bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 hover:border-cyan-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 cursor-pointer relative"
            >
              {/* Badge de desconto */}
              {item.desconto && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  -{item.desconto}%
                </div>
              )}

              {/* Ícone do tipo */}
              <div className="absolute top-3 right-3 bg-gray-900/80 p-2 rounded-full">
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
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg line-clamp-2">{item.nome}</h3>
                  <button className="text-gray-400 hover:text-cyan-400">
                    <Heart size={20} />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <RenderStars rating={item.avaliacao} />
                  <span className="text-sm text-gray-400">
                    ({item.numeroAvaliacoes})
                  </span>
                </div>

                {/* Especificações */}
                <div className="space-y-2 text-sm text-gray-300 mb-4">
                  <p className="text-cyan-400">{item.marca}</p>
                  
                  {item.especificacoes.clock && (
                    <p className="flex items-center gap-1">
                      <Zap size={14} className="text-yellow-400" />
                      {item.especificacoes.clock}
                    </p>
                  )}
                  
                  {item.especificacoes.capacidade && (
                    <p className="flex items-center gap-1">
                      <MemoryStick size={14} className="text-purple-400" />
                      {item.especificacoes.capacidade}
                    </p>
                  )}
                  
                  {item.especificacoes.rgb && (
                    <p className="text-pink-400 flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"></div>
                      Iluminação RGB
                    </p>
                  )}
                </div>

                {/* Preço */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xl font-bold text-cyan-400">
                      R$ {item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    {item.precoOriginal && (
                      <p className="text-xs text-gray-400 line-through">
                        R$ {item.precoOriginal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                  {item.freteGratis && (
                    <span className="flex items-center gap-1 text-green-400 text-sm">
                      <Truck size={16} />
                      <span>Grátis</span>
                    </span>
                  )}
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${item.id}`);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  <ShoppingCart size={18} />
                  Comprar agora
                </button>
              </div>
            </div>
          ))}
        </div>

        {hardwareFiltrado.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">
              Nenhum hardware encontrado com esses filtros
            </p>
            <button
              onClick={() => {
                setPrecoRange([0, 15000]);
                setFreteGratis(false);
                setAvaliacaoMinima(0);
                setMarcasSelecionadas([]);
                setTiposSelecionados([]);
                setRgb(null);
                setTermoBusca('');
              }}
              className="mt-4 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
}