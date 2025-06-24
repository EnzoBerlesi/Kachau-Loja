import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Laptop, BatteryFull, Lightbulb, Star, Heart, ShoppingCart, Truck, SlidersHorizontal, Search, X } from 'lucide-react';
import Header from '../../components/layout/Header';
import type { ProdutoEscritorio } from '../../types/shop';



// Mock de produtos
const mockEscritorio: ProdutoEscritorio[] = [
  {
    id: 1,
    nome: "Notebook Executivo Pro",
    preco: 5899.99,
    precoOriginal: 6599.99,
    imagem: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9",
    freteGratis: true,
    avaliacao: 4.8,
    marca: "Dell",
    especificacoes: {
      bateria: "14h",
      peso: "1.2kg",
      tela: '14" FHD'
    },
    numeroAvaliacoes: 342
  },
  // Adicione mais 5-7 itens...
];

export default function Escritorio() {
  const navigate = useNavigate();
  
  // Estados dos filtros (IGUAL NOTEBOOKS)
  const [filtros, setFiltros] = useState({
    precoMax: 10000,
    precoMin: 0,
    freteGratis: false,
    bateriaMin: 0,
    busca: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Função para redirecionar para a página de produto
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  // Filtros avançados
  const produtosFiltrados = mockEscritorio.filter(produto => {
    if (produto.preco < filtros.precoMin || produto.preco > filtros.precoMax) return false;
    if (filtros.freteGratis && !produto.freteGratis) return false;
    if (filtros.busca && !produto.nome.toLowerCase().includes(filtros.busca.toLowerCase())) return false;
    if (filtros.bateriaMin > 0 && parseInt(produto.especificacoes.bateria) < filtros.bateriaMin) return false;
    return true;
  });

  // Componente de estrelas
  const RenderStars = ({ rating }: { rating: number }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star}
          size={16}
          className={`${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-500'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      <Header />

      {/* Hero Section (ESTILO GAMER) */}
      <div className="pt-28 pb-16 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Laptop className="text-blue-400" size={32} />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-300">
            ESCRITÓRIO
          </h1>
        </div>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Equipamentos para trabalho pesado. Performance sem frescura.
        </p>
      </div>

      {/* Barra de busca e filtros (IGUAL NOTEBOOKS) */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800/70 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={filtros.busca}
              onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-purple-800/70 hover:bg-purple-700/80 rounded-xl flex items-center gap-2 transition-colors"
          >
            <SlidersHorizontal size={18} />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Filtros expandidos (ESTILO NOTEBOOKS) */}
      {showFilters && (
        <div className="max-w-7xl mx-auto px-4 mb-8 bg-gray-800/50 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Faixa de preço */}
            <div>
              <label className="block mb-3 text-blue-400">Faixa de Preço</label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="20000"
                  step="100"
                  value={filtros.precoMax}
                  onChange={(e) => setFiltros({...filtros, precoMax: Number(e.target.value)})}
                  className="w-full accent-blue-500"
                />
                <p className="text-sm text-gray-300">
                  Até R$ {filtros.precoMax.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Bateria */}
            <div>
              <label className="block mb-3 text-blue-400">Bateria Mínima</label>
              <select
                value={filtros.bateriaMin}
                onChange={(e) => setFiltros({...filtros, bateriaMin: Number(e.target.value)})}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="0">Qualquer</option>
                <option value="8">+8 horas</option>
                <option value="12">+12 horas</option>
              </select>
            </div>

            {/* Frete grátis */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filtros.freteGratis}
                  onChange={(e) => setFiltros({...filtros, freteGratis: e.target.checked})}
                  className="h-5 w-5 accent-blue-500 rounded"
                />
                <span className="text-gray-300">Frete Grátis</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Listagem de produtos */}
      <main className="max-w-7xl mx-auto px-4 pb-12">        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtosFiltrados.map(produto => (
            <div 
              key={produto.id} 
              onClick={() => handleProductClick(produto.id)}
              className="bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 hover:border-blue-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
            >
              {/* Imagem */}
              <div className="relative h-48 bg-gray-900/30">
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-full h-full object-contain p-4"
                />
                {produto.precoOriginal && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{Math.round((1 - produto.preco / produto.precoOriginal) * 100)}%
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{produto.nome}</h3>
                <p className="text-blue-400 text-sm mb-3">{produto.marca}</p>

                <div className="flex items-center gap-2 mb-3">
                  <RenderStars rating={produto.avaliacao} />
                  <span className="text-sm text-gray-400">({produto.numeroAvaliacoes})</span>
                </div>

                {/* Especificações */}
                <div className="space-y-2 text-sm text-gray-300 mb-4">
                  <div className="flex items-center gap-2">
                    <BatteryFull size={16} className="text-blue-400" />
                    <span>{produto.especificacoes.bateria} de bateria</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lightbulb size={16} className="text-yellow-400" />
                    <span>{produto.especificacoes.peso}</span>
                  </div>
                  <p className="text-xs text-gray-500">{produto.especificacoes.tela}</p>
                </div>

                {/* Preço e ação */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-blue-400">
                      R$ {produto.preco.toLocaleString('pt-BR')}
                    </p>
                    {produto.precoOriginal && (
                      <p className="text-xs text-gray-500 line-through">
                        R$ {produto.precoOriginal.toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(produto.id);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <ShoppingCart size={16} />
                    <span className="hidden sm:inline">Comprar</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}