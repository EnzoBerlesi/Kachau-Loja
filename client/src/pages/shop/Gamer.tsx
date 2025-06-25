import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Star, ShoppingCart, Truck, Search, SlidersHorizontal, Heart } from 'lucide-react';
import Header from "../../components/layout/Header";

type Product = {
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
  numeroAvaliacoes: number;
  desconto?: number;
};

const mockProdutosGamer: Product[] = [
  {
    id: 1,
    nome: "Notebook Gamer Predator",
    preco: 8999.99,
    precoOriginal: 9999.99,
    imagem: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
    freteGratis: true,
    avaliacao: 4.9,
    marca: "Acer",
    especificacoes: {
      processador: "Intel i9-13900H",
      ram: "32GB DDR5",
      placaVideo: "RTX 4080"
    },
    numeroAvaliacoes: 512,
    desconto: 10
  },
  {
    id: 2,
    nome: "PC Gamer Monster",
    preco: 12000.00,
    imagem: "https://images.unsplash.com/photo-1591488320449-011701bb6704",
    freteGratis: true,
    avaliacao: 5.0,
    marca: "Alienware",
    especificacoes: {
      processador: "AMD Ryzen 9 7950X",
      ram: "64GB DDR5",
      placaVideo: "RTX 4090"
    },
    numeroAvaliacoes: 342
  },
  {
    id: 3,
    nome: "PC Gamer Pro",
    preco: 7500.00,
    precoOriginal: 8500.00,
    imagem: "https://images.unsplash.com/photo-1563212035-3e8ffdf31f8e",
    freteGratis: false,
    avaliacao: 4.7,
    marca: "Dell",
    especificacoes: {
      processador: "Intel i7-13700K",
      ram: "32GB DDR4",
      placaVideo: "RTX 4070"
    },
    numeroAvaliacoes: 215,
    desconto: 12
  }
];

export default function Gamer() {
  const navigate = useNavigate();

  // Estados dos filtros (igual ao dos notebooks)
  const [precoRange, setPrecoRange] = useState([0, 20000]);
  const [freteGratis, setFreteGratis] = useState(false);
  const [avaliacaoMinima, setAvaliacaoMinima] = useState(0);
  const [marcasSelecionadas, setMarcasSelecionadas] = useState<string[]>([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filtros dinâmicos baseados nos dados
  const marcasDisponiveis = [...new Set(mockProdutosGamer.map((p) => p.marca))];

  // Aplicando filtros
  const produtosFiltrados = mockProdutosGamer.filter((produto) => {
    if (produto.preco < precoRange[0] || produto.preco > precoRange[1]) return false;
    if (freteGratis && !produto.freteGratis) return false;
    if (produto.avaliacao < avaliacaoMinima) return false;
    if (marcasSelecionadas.length > 0 && !marcasSelecionadas.includes(produto.marca)) return false;
    if (termoBusca && !produto.nome.toLowerCase().includes(termoBusca.toLowerCase())) return false;
    
    return true;
  });

  // Componente de estrelas reutilizável
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
      <Header />
      
      {/* Hero Section */}
      <div className="pt-28 pb-16 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Gamepad2 className="text-green-400" size={32} />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-purple-300">
            PRODUTOS GAMER
          </h1>
        </div>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Hardware de alta performance para dominar nos games
        </p>
      </div>

      {/* Barra de filtros */}
      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md border-b border-purple-900/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Pesquisar produtos gamer..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-800 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <SlidersHorizontal size={18} />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Filtros expandidos */}
      {showFilters && (
        <div className="bg-gray-800/90 border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Faixa de Preço */}
            <div>
              <h3 className="font-medium mb-3 text-green-400">Faixa de Preço</h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min="0"
                  max="20000"
                  step="100"
                  value={precoRange[1]}
                  onChange={(e) =>
                    setPrecoRange([precoRange[0], Number(e.target.value)])
                  }
                  className="w-full accent-green-500"
                />
                <div className="flex justify-between text-sm text-gray-300">
                  <span>R$ {precoRange[0].toLocaleString("pt-BR")}</span>
                  <span>R$ {precoRange[1].toLocaleString("pt-BR")}</span>
                </div>
              </div>
            </div>

            {/* Marcas */}
            <div>
              <h3 className="font-medium mb-3 text-green-400">Marcas</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {marcasDisponiveis.map((marca) => (
                  <label
                    key={marca}
                    className="flex items-center gap-2 cursor-pointer"
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
                      className="rounded text-green-500 focus:ring-green-500"
                    />
                    <span>{marca}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Avaliação */}
            <div>
              <h3 className="font-medium mb-3 text-green-400">
                Avaliação Mínima
              </h3>
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

            {/* Outros Filtros */}
            <div>
              <h3 className="font-medium mb-3 text-green-400">Outros</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={freteGratis}
                  onChange={() => setFreteGratis(!freteGratis)}
                  className="rounded text-green-500 focus:ring-green-500"
                />
                <span>Frete Grátis</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Produtos */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {produtosFiltrados.map((produto) => (
            <div
              key={produto.id}
              className="group bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 hover:border-green-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 cursor-pointer"
              onClick={() => navigate(`/product/${produto.id}`)}
            >
              {/* Badge de desconto */}
              {produto.desconto && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  -{produto.desconto}%
                </div>
              )}

              {/* Imagem */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {produto.nome}
                  </h3>
                  <button className="text-gray-400 hover:text-green-400">
                    <Heart size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <RenderStars rating={produto.avaliacao} />
                  <span className="text-sm text-gray-400">
                    ({produto.numeroAvaliacoes})
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-300 mb-4">
                  <p className="flex items-center gap-1">
                    <span className="text-green-400">GPU:</span> {produto.especificacoes.placaVideo}
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="text-green-400">CPU:</span> {produto.especificacoes.processador}
                  </p>
                  <p className="flex items-center gap-1">
                    <span className="text-green-400">RAM:</span> {produto.especificacoes.ram}
                  </p>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xl font-bold text-green-400">
                      R${" "}
                      {produto.preco.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    {produto.precoOriginal && (
                      <p className="text-xs text-gray-400 line-through">
                        R${" "}
                        {produto.precoOriginal.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    )}
                  </div>
                  {produto.freteGratis && (
                    <span className="flex items-center gap-1 text-green-400 text-sm">
                      <Truck size={16} />
                      <span>Grátis</span>
                    </span>
                  )}
                </div>
                <button
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${produto.id}`);
                  }}
                >
                  <ShoppingCart size={18} />
                  Comprar agora
                </button>
              </div>
            </div>
          ))}
        </div>
        {produtosFiltrados.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">
              Nenhum produto encontrado com esses filtros
            </p>
            <button
              onClick={() => {
                setPrecoRange([0, 20000]);
                setFreteGratis(false);
                setAvaliacaoMinima(0);
                setMarcasSelecionadas([]);
                setTermoBusca("");
              }}
              className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
}