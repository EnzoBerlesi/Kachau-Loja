import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Laptop, BatteryFull, Lightbulb, Star, ShoppingCart, SlidersHorizontal, Search, Heart, Truck } from 'lucide-react';
import Header from '../../components/layout/Header';

type ProdutoEscritorio = {
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
  desconto?: number;
};

// Mock de produtos (com 7 itens)
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
    numeroAvaliacoes: 342,
    desconto: 11
  },
  {
    id: 2,
    nome: "MacBook Air M2",
    preco: 8999.99,
    precoOriginal: 9499.99,
    imagem: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9",
    freteGratis: true,
    avaliacao: 4.9,
    marca: "Apple",
    especificacoes: {
      bateria: "18h",
      peso: "1.24kg",
      tela: '13.6" Retina'
    },
    numeroAvaliacoes: 512,
    desconto: 5
  },
  {
    id: 3,
    nome: "Notebook ThinkPad X1 Carbon",
    preco: 7599.99,
    imagem: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
    freteGratis: false,
    avaliacao: 4.7,
    marca: "Lenovo",
    especificacoes: {
      bateria: "15h",
      peso: "1.13kg",
      tela: '14" WUXGA'
    },
    numeroAvaliacoes: 287
  },
  {
    id: 4,
    nome: "Notebook Elite Dragonfly",
    preco: 10999.99,
    precoOriginal: 11999.99,
    imagem: "https://images.unsplash.com/photo-1587202372775-e229f1721a1f",
    freteGratis: true,
    avaliacao: 4.8,
    marca: "HP",
    especificacoes: {
      bateria: "16.5h",
      peso: "0.99kg",
      tela: '13.5" 3K2K'
    },
    numeroAvaliacoes: 198,
    desconto: 8
  },
  {
    id: 5,
    nome: "Notebook ZenBook 14X",
    preco: 6499.99,
    imagem: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
    freteGratis: true,
    avaliacao: 4.6,
    marca: "ASUS",
    especificacoes: {
      bateria: "12h",
      peso: "1.4kg",
      tela: '14" OLED 2.8K'
    },
    numeroAvaliacoes: 156
  },
  {
    id: 6,
    nome: "Notebook VAIO SX14",
    preco: 8299.99,
    precoOriginal: 8999.99,
    imagem: "https://images.unsplash.com/photo-1587202372775-e229f1721a1f",
    freteGratis: false,
    avaliacao: 4.5,
    marca: "VAIO",
    especificacoes: {
      bateria: "10h",
      peso: "1.05kg",
      tela: '14" 4K'
    },
    numeroAvaliacoes: 87,
    desconto: 8
  },
  {
    id: 7,
    nome: "Notebook Galaxy Book3 Pro",
    preco: 6999.99,
    imagem: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9",
    freteGratis: true,
    avaliacao: 4.7,
    marca: "Samsung",
    especificacoes: {
      bateria: "20h",
      peso: "1.17kg",
      tela: '14" AMOLED'
    },
    numeroAvaliacoes: 231
  }
];

export default function Escritorio() {
  const navigate = useNavigate();

  // Estados dos filtros (igual ao dos notebooks)
  const [precoRange, setPrecoRange] = useState([0, 15000]);
  const [freteGratis, setFreteGratis] = useState(false);
  const [avaliacaoMinima, setAvaliacaoMinima] = useState(0);
  const [marcasSelecionadas, setMarcasSelecionadas] = useState<string[]>([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [bateriaMinima, setBateriaMinima] = useState(0);

  // Filtros dinâmicos baseados nos dados
  const marcasDisponiveis = [...new Set(mockEscritorio.map((p) => p.marca))];
  const opcoesBateria = [0, 8, 10, 12, 15, 18, 20];

  // Aplicando filtros
  const produtosFiltrados = mockEscritorio.filter((produto) => {
    if (produto.preco < precoRange[0] || produto.preco > precoRange[1]) return false;
    if (freteGratis && !produto.freteGratis) return false;
    if (produto.avaliacao < avaliacaoMinima) return false;
    if (marcasSelecionadas.length > 0 && !marcasSelecionadas.includes(produto.marca)) return false;
    if (termoBusca && !produto.nome.toLowerCase().includes(termoBusca.toLowerCase())) return false;
    
    // Filtro específico para bateria
    const horasBateria = parseInt(produto.especificacoes.bateria);
    if (bateriaMinima > 0 && horasBateria < bateriaMinima) return false;
    
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
          <Laptop className="text-blue-400" size={32} />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-300">
            ESCRITÓRIO
          </h1>
        </div>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Equipamentos para trabalho pesado. Performance sem frescura.
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
              placeholder="Pesquisar produtos para escritório..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              <h3 className="font-medium mb-3 text-blue-400">Faixa de Preço</h3>
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
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-sm text-gray-300">
                  <span>R$ {precoRange[0].toLocaleString("pt-BR")}</span>
                  <span>R$ {precoRange[1].toLocaleString("pt-BR")}</span>
                </div>
              </div>
            </div>

            {/* Marcas */}
            <div>
              <h3 className="font-medium mb-3 text-blue-400">Marcas</h3>
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
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span>{marca}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bateria */}
            <div>
              <h3 className="font-medium mb-3 text-blue-400">Bateria Mínima</h3>
              <select
                value={bateriaMinima}
                onChange={(e) => setBateriaMinima(Number(e.target.value))}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
              >
                {opcoesBateria.map((horas) => (
                  <option key={horas} value={horas}>
                    {horas === 0 ? "Qualquer duração" : `+${horas} horas`}
                  </option>
                ))}
              </select>
            </div>

            {/* Outros Filtros */}
            <div>
              <h3 className="font-medium mb-3 text-blue-400">Outros</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={freteGratis}
                    onChange={() => setFreteGratis(!freteGratis)}
                    className="rounded text-blue-500 focus:ring-blue-500"
                  />
                  <span>Frete Grátis</span>
                </label>
                
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-1 text-blue-400">Avaliação Mínima</h4>
                  <div className="flex items-center gap-1">
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
                          size={18}
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

      {/* Lista de Produtos */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {produtosFiltrados.map((produto) => (
            <div
              key={produto.id}
              className="group bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 hover:border-blue-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
              onClick={() => navigate(`/product/${produto.id}`)}
            >
              {/* Badge de desconto */}
              {produto.desconto && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                  -{produto.desconto}%
                </div>
              )}

              {/* Imagem */}
              <div className="relative h-48 overflow-hidden bg-gray-900/20">
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {produto.nome}
                  </h3>
                  <button className="text-gray-400 hover:text-blue-400">
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
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xl font-bold text-blue-400">
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
                    <span className="flex items-center gap-1 text-blue-400 text-sm">
                      <Truck size={16} />
                      <span>Grátis</span>
                    </span>
                  )}
                </div>
                
                <button
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
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
                setPrecoRange([0, 15000]);
                setFreteGratis(false);
                setAvaliacaoMinima(0);
                setMarcasSelecionadas([]);
                setTermoBusca("");
                setBateriaMinima(0);
              }}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
}