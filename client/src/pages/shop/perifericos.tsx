import React, { useState } from 'react';
import { Headphones, Keyboard, Mouse, Star, Heart, ShoppingCart, Truck, SlidersHorizontal, Search, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import type { Periferico } from '../../types/shop';


// Mock de periféricos GAMER
const mockPerifericos: Periferico[] = [
  {
    id: 1,
    nome: "Teclado Mecânico RGB",
    preco: 799.99,
    precoOriginal: 999.99,
    imagem: "https://images.unsplash.com/photo-1555680202-c86f0e12f086",
    freteGratis: true,
    avaliacao: 4.9,
    marca: "Redragon",
    tipo: "Teclado",
    especificacoes: {
      tipo: "Mecânico (Red Switch)",
      rgb: true,
      conexao: "USB"
    },
    numeroAvaliacoes: 842
  },
  {
    id: 2,
    nome: "Mouse Gamer 16000DPI",
    preco: 349.99,
    imagem: "https://images.unsplash.com/photo-1527814050087-3793815479db",
    freteGratis: false,
    avaliacao: 4.7,
    marca: "Logitech",
    tipo: "Mouse",
    especificacoes: {
      tipo: "Sem Fio",
      rgb: true,
      conexao: "Bluetooth"
    },
    numeroAvaliacoes: 721
  },
  // Adicione mais 5-7 itens...
];

export default function Perifericos() {
  const navigate = useNavigate();
  
  // Estados dos filtros (IGUAL NOTEBOOKS, mas com tipos de periféricos)
  const [showFilters, setShowFilters] = useState(false);

  const [filtros, setFiltros] = useState({
    precoMax: 2000,
    freteGratis: false,
    tipo: 'Todos' as 'Todos' | 'Teclado' | 'Mouse' | 'Headset',
    rgb: false,
    conexao: 'Todos' as 'Todos' | 'USB' | 'Bluetooth',
    busca: ''
  });

  // Função para redirecionar para página do produto
  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
  };

  // Filtros avançados
  const perifericosFiltrados = mockPerifericos.filter(item => {
    if (item.preco > filtros.precoMax) return false;
    if (filtros.freteGratis && !item.freteGratis) return false;
    if (filtros.tipo !== 'Todos' && item.tipo !== filtros.tipo) return false;
    if (filtros.rgb && !item.especificacoes.rgb) return false;
    if (filtros.conexao !== 'Todos' && item.especificacoes.conexao !== filtros.conexao) return false;
    if (filtros.busca && !item.nome.toLowerCase().includes(filtros.busca.toLowerCase())) return false;
    return true;
  });

  // Ícones por tipo
  const iconesPorTipo = {
    Teclado: <Keyboard className="text-red-500" size={20} />,
    Mouse: <Mouse className="text-green-500" size={20} />,
    Headset: <Headphones className="text-blue-400" size={20} />,
    Mousepad: <Zap className="text-purple-400" size={20} />
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-red-900 to-gray-900 text-white">
        {/* Hero Section (ESTILO GAMER) */}
        <div className="pt-28 pb-16 px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Headphones className="text-red-500" size={32} />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-500">
              PERIFÉRICOS GAMER
            </h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Equipamentos para dominar nos games. Precisão, estilo e performance.
          </p>
        </div>

        {/* Barra de busca e filtros */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar teclados, mouses..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={filtros.busca}
                onChange={(e) => setFiltros({ ...filtros, busca: e.target.value })}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-red-800/70 hover:bg-red-700/80 rounded-xl flex items-center gap-2 transition-colors"
            >
              <SlidersHorizontal size={18} />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {/* Filtros expandidos */}
        {showFilters && (
          <div className="max-w-7xl mx-auto px-4 mb-8 bg-gray-800/50 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Preço */}
              <div>
                <label className="block mb-3 text-red-400">Preço Máximo</label>
                <select
                  value={filtros.precoMax}
                  onChange={(e) => setFiltros({ ...filtros, precoMax: Number(e.target.value) })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="500">Até R$ 500</option>
                  <option value="1000">Até R$ 1.000</option>
                  <option value="2000">Até R$ 2.000</option>
                </select>
              </div>

              {/* Tipo */}
              <div>
                <label className="block mb-3 text-red-400">Tipo</label>                <select
                  value={filtros.tipo}
                  onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value as 'Todos' | 'Teclado' | 'Mouse' | 'Headset' })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="Todos">Todos</option>
                  <option value="Teclado">Teclado</option>
                  <option value="Mouse">Mouse</option>
                  <option value="Headset">Headset</option>
                </select>
              </div>

              {/* Conexão */}
              <div>
                <label className="block mb-3 text-red-400">Conexão</label>                <select
                  value={filtros.conexao}
                  onChange={(e) => setFiltros({ ...filtros, conexao: e.target.value as 'Todos' | 'USB' | 'Bluetooth' })}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="Todos">Todos</option>
                  <option value="USB">USB</option>
                  <option value="Bluetooth">Bluetooth</option>
                </select>
              </div>

              {/* RGB */}
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtros.rgb}
                    onChange={(e) => setFiltros({ ...filtros, rgb: e.target.checked })}
                    className="h-5 w-5 accent-red-500 rounded"
                  />
                  <span className="text-gray-300">RGB 🌈</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Listagem */}
        <main className="max-w-7xl mx-auto px-4 pb-12">          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {perifericosFiltrados.map(item => (
              <div 
                key={item.id} 
                className="bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 hover:border-red-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10 cursor-pointer"
                onClick={() => handleProductClick(item.id)}
              >
                {/* Badge de tipo */}
                <div className="absolute top-3 left-3">
                  {iconesPorTipo[item.tipo]}
                </div>

                {/* Imagem */}
                <div className="relative h-48 bg-gray-900/30">
                  <img
                    src={item.imagem}
                    alt={item.nome}
                    className="w-full h-full object-contain p-4"
                  />
                  {item.especificacoes.rgb && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      RGB
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{item.nome}</h3>
                  <p className="text-red-400 text-sm mb-3">{item.marca}</p>

                  {/* Especificações */}
                  <div className="space-y-2 text-sm text-gray-300 mb-4">
                    <p><span className="text-red-400">Tipo:</span> {item.especificacoes.tipo}</p>
                    <p><span className="text-red-400">Conexão:</span> {item.especificacoes.conexao}</p>
                  </div>

                  {/* Preço */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xl font-bold text-red-400">
                      R$ {item.preco.toLocaleString('pt-BR')}
                    </p>
                    {item.freteGratis && (
                      <span className="flex items-center gap-1 text-green-400 text-sm">
                        <Truck size={16} />
                        <span>Grátis</span>
                      </span>
                    )}
                  </div>                  <button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(item.id);
                    }}
                  >
                    <ShoppingCart size={16} />
                    Add ao Carrinho
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}