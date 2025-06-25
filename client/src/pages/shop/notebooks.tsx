import { useState } from "react";
import {
  Laptop,
  Star,
  Heart,
  ShoppingCart,
  Truck,
  SlidersHorizontal,
  Search,
  X,
} from "lucide-react";
import { Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import type { Notebook } from "../../types/shop";

const mockNotebooks: Notebook[] = [
  {
    id: 1,
    nome: "Notebook Gamer Predator",
    preco: 8999.99,
    precoOriginal: 9999.99,
    imagem: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45",
    freteGratis: true,
    avaliacao: 4.9,
    marca: "Acer",
    processador: "Intel i9-13900H",
    ram: "32GB DDR5",
    armazenamento: "2TB SSD",
    tela: '17.3" QHD 240Hz',
    desconto: 10,
    categoria: "Gaming",
    numeroAvaliacoes: 512,
  },
  // PREMIUM
  {
    id: 2,
    nome: 'MacBook Pro 16" M2 Max',
    preco: 24999.99,
    imagem: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9",
    freteGratis: true,
    avaliacao: 5.0,
    marca: "Apple",
    processador: "Apple M2 Max",
    ram: "32GB Unified",
    armazenamento: "1TB SSD",
    tela: '16.2" Retina XDR',
    categoria: "Premium",
    numeroAvaliacoes: 1024,
  },
  // BUDGET
  {
    id: 3,
    nome: "Notebook Essentials",
    preco: 2199.99,
    precoOriginal: 2599.99,
    imagem: "https://images.unsplash.com/photo-1587202372775-e229f1721a1f",
    freteGratis: false,
    avaliacao: 5,
    marca: "Lenovo",
    processador: "Intel i3-1215U",
    ram: "8GB DDR4",
    armazenamento: "256GB SSD",
    tela: '15.6" HD',
    desconto: 15,
    categoria: "Trabalho",
    numeroAvaliacoes: 87,
  },
];

export default function Notebooks() {
  const navigate = useNavigate();

  // Estados dos filtros
  const [precoRange, setPrecoRange] = useState([0, 15000]);
  const [freteGratis, setFreteGratis] = useState(false);
  const [avaliacaoMinima, setAvaliacaoMinima] = useState(0);
  const [marcasSelecionadas, setMarcasSelecionadas] = useState<string[]>([]);
  const [termoBusca, setTermoBusca] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filtros dinâmicos baseados nos dados
  const marcasDisponiveis = [...new Set(mockNotebooks.map((n) => n.marca))];

  // Aplicando filtros
  const notebooksFiltrados = mockNotebooks.filter((notebook) => {
    // Filtro por preço
    if (notebook.preco < precoRange[0] || notebook.preco > precoRange[1])
      return false;

    // Filtro por frete
    if (freteGratis && !notebook.freteGratis) return false;

    // Filtro por avaliação
    if (notebook.avaliacao < avaliacaoMinima) return false;

    // Filtro por marca
    if (
      marcasSelecionadas.length > 0 &&
      !marcasSelecionadas.includes(notebook.marca)
    )
      return false;

    // Filtro por busca
    if (
      termoBusca &&
      !notebook.nome.toLowerCase().includes(termoBusca.toLowerCase())
    )
      return false;

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
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
        {/* Hero Section */}
        <div className="pt-28 pb-16 px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Laptop className="text-pink-400" size={32} />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-300">
              NOTEBOOKS
            </h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Os melhores notebooks com os melhores preços. Frete grátis para todo
            Brasil!
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
                placeholder="Pesquisar notebooks..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
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
                <h3 className="font-medium mb-3 text-pink-400">
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
                    className="w-full accent-pink-500"
                  />
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>R$ {precoRange[0].toLocaleString("pt-BR")}</span>
                    <span>R$ {precoRange[1].toLocaleString("pt-BR")}</span>
                  </div>
                </div>
              </div>

              {/* Marcas */}
              <div>
                <h3 className="font-medium mb-3 text-pink-400">Marcas</h3>
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
                        className="rounded text-pink-500 focus:ring-pink-500"
                      />
                      <span>{marca}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Avaliação */}
              <div>
                <h3 className="font-medium mb-3 text-pink-400">
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
                <h3 className="font-medium mb-3 text-pink-400">Outros</h3>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={freteGratis}
                    onChange={() => setFreteGratis(!freteGratis)}
                    className="rounded text-pink-500 focus:ring-pink-500"
                  />
                  <span>Frete Grátis</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Notebooks */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notebooksFiltrados.map((notebook) => (
              <div
                key={notebook.id}
                className="group bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 hover:border-pink-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 cursor-pointer"
                onClick={() => navigate(`/product/${notebook.id}`)}
              >
                {/* Badge de desconto */}
                {notebook.desconto && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    -{notebook.desconto}%
                  </div>
                )}

                {/* Imagem */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={notebook.imagem}
                    alt={notebook.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2">
                      {notebook.nome}
                    </h3>
                    <button className="text-gray-400 hover:text-pink-400">
                      <Heart size={20} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <RenderStars rating={notebook.avaliacao} />
                    <span className="text-sm text-gray-400">
                      ({notebook.numeroAvaliacoes})
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300 mb-4">
                    <p className="flex items-center gap-1">
                      <Zap size={14} className="text-pink-400" />
                      {notebook.processador}
                    </p>
                    <div className="flex justify-between">
                      <span>{notebook.ram}</span>
                      <span>{notebook.armazenamento}</span>
                    </div>
                    <p className="text-xs">{notebook.tela}</p>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xl font-bold text-pink-400">
                        R${" "}
                        {notebook.preco.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      {notebook.precoOriginal && (
                        <p className="text-xs text-gray-400 line-through">
                          R${" "}
                          {notebook.precoOriginal.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      )}
                    </div>
                    {notebook.freteGratis && (
                      <span className="flex items-center gap-1 text-green-400 text-sm">
                        <Truck size={16} />
                        <span>Grátis</span>
                      </span>
                    )}
                  </div>{" "}
                  <button
                    className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${notebook.id}`);
                    }}
                  >
                    <ShoppingCart size={18} />
                    Comprar agora
                  </button>
                </div>
              </div>
            ))}
          </div>
          {notebooksFiltrados.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">
                Nenhum notebook encontrado com esses filtros
              </p>
              <button
                onClick={() => {
                  setPrecoRange([0, 15000]);
                  setFreteGratis(false);
                  setAvaliacaoMinima(0);
                  setMarcasSelecionadas([]);
                  setTermoBusca("");
                }}
                className="mt-4 px-6 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
