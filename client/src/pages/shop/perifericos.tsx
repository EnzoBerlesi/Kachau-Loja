import { useState } from "react";
import {
  Keyboard,
  Headphones,
  Mouse,
  Star,
  Heart,
  ShoppingCart,
  Truck,
  SlidersHorizontal,
  Search,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";

type Peripheral = {
  id: number;
  nome: string;
  preco: number;
  precoOriginal?: number;
  imagem: string;
  freteGratis: boolean;
  avaliacao: number;
  marca: string;
  tipo: "Teclado" | "Mouse" | "Headset" | "Monitor" | "Outro";
  conexao: "USB" | "Bluetooth" | "Wireless" | "Misto";
  rgb: boolean;
  desconto?: number;
  numeroAvaliacoes: number;
};

const mockPerifericos: Peripheral[] = [
  {
    id: 1,
    nome: "Teclado Mecânico RGB",
    preco: 599.99,
    precoOriginal: 799.99,
    imagem: "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
    freteGratis: true,
    avaliacao: 4.8,
    marca: "Redragon",
    tipo: "Teclado",
    conexao: "USB",
    rgb: true,
    desconto: 25,
    numeroAvaliacoes: 342,
  },
  {
    id: 2,
    nome: "Mouse Gamer Pro",
    preco: 299.99,
    imagem: "https://images.unsplash.com/photo-1527814050087-3793815479db",
    freteGratis: false,
    avaliacao: 4.5,
    marca: "Logitech",
    tipo: "Mouse",
    conexao: "Wireless",
    rgb: true,
    numeroAvaliacoes: 128,
  },
  {
    id: 3,
    nome: "Headset Gamer 7.1",
    preco: 399.99,
    precoOriginal: 499.99,
    imagem: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
    freteGratis: true,
    avaliacao: 4.7,
    marca: "HyperX",
    tipo: "Headset",
    conexao: "USB",
    rgb: true,
    desconto: 20,
    numeroAvaliacoes: 256,
  },
];

export default function Perifericos() {
  const navigate = useNavigate();

  // Estados dos filtros (padronizados com notebooks)
  const [precoRange, setPrecoRange] = useState([0, 2000]);
  const [freteGratis, setFreteGratis] = useState(false);
  const [avaliacaoMinima, setAvaliacaoMinima] = useState(0);
  const [marcasSelecionadas, setMarcasSelecionadas] = useState<string[]>([]);
  const [tiposSelecionados, setTiposSelecionados] = useState<string[]>([]);
  const [conexoesSelecionadas, setConexoesSelecionadas] = useState<string[]>([]);
  const [rgb, setRgb] = useState<boolean | null>(null);
  const [termoBusca, setTermoBusca] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filtros dinâmicos
  const marcasDisponiveis = [...new Set(mockPerifericos.map((p) => p.marca))];
  const tiposDisponiveis = [...new Set(mockPerifericos.map((p) => p.tipo))];
  const conexoesDisponiveis = [...new Set(mockPerifericos.map((p) => p.conexao))];

  // Aplicando filtros
  const perifericosFiltrados = mockPerifericos.filter((periferico) => {
    // Filtros padrão (iguais aos notebooks)
    if (periferico.preco < precoRange[0] || periferico.preco > precoRange[1]) return false;
    if (freteGratis && !periferico.freteGratis) return false;
    if (periferico.avaliacao < avaliacaoMinima) return false;
    if (marcasSelecionadas.length > 0 && !marcasSelecionadas.includes(periferico.marca)) return false;
    if (termoBusca && !periferico.nome.toLowerCase().includes(termoBusca.toLowerCase())) return false;

    // Filtros específicos de periféricos
    if (tiposSelecionados.length > 0 && !tiposSelecionados.includes(periferico.tipo)) return false;
    if (conexoesSelecionadas.length > 0 && !conexoesSelecionadas.includes(periferico.conexao)) return false;
    if (rgb !== null && periferico.rgb !== rgb) return false;

    return true;
  });

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

  const getIconByType = (tipo: string) => {
    switch (tipo) {
      case "Teclado": return <Keyboard size={18} className="text-pink-400" />;
      case "Mouse": return <Mouse size={18} className="text-pink-400" />;
      case "Headset": return <Headphones size={18} className="text-pink-400" />;
      default: return <Zap size={18} className="text-pink-400" />;
    }
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white">
        {/* Hero Section */}
        <div className="pt-28 pb-16 px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Keyboard className="text-pink-400" size={32} />
            <Headphones className="text-pink-400" size={32} />
            <Mouse className="text-pink-400" size={32} />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-300">
              PERIFÉRICOS GAMER
            </h1>
          </div>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Os melhores periféricos para sua setup. Performance e estilo para gamers!
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
                placeholder="Pesquisar periféricos..."
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
                    max="2000"
                    step="50"
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

              {/* Tipos de Periféricos */}
              <div>
                <h3 className="font-medium mb-3 text-pink-400">Tipos</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {tiposDisponiveis.map((tipo) => (
                    <label
                      key={tipo}
                      className="flex items-center gap-2 cursor-pointer"
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
                        className="rounded text-pink-500 focus:ring-pink-500"
                      />
                      <span>{tipo}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Outros Filtros */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-3 text-pink-400">Conexão</h3>
                  <div className="space-y-2">
                    {conexoesDisponiveis.map((conexao) => (
                      <label
                        key={conexao}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={conexoesSelecionadas.includes(conexao)}
                          onChange={() =>
                            setConexoesSelecionadas((prev) =>
                              prev.includes(conexao)
                                ? prev.filter((c) => c !== conexao)
                                : [...prev, conexao]
                            )
                          }
                          className="rounded text-pink-500 focus:ring-pink-500"
                        />
                        <span>{conexao}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3 text-pink-400">RGB</h3>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rgb"
                        checked={rgb === true}
                        onChange={() => setRgb(true)}
                        className="text-pink-500 focus:ring-pink-500"
                      />
                      <span>Com RGB</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rgb"
                        checked={rgb === false}
                        onChange={() => setRgb(false)}
                        className="text-pink-500 focus:ring-pink-500"
                      />
                      <span>Sem RGB</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rgb"
                        checked={rgb === null}
                        onChange={() => setRgb(null)}
                        className="text-pink-500 focus:ring-pink-500"
                      />
                      <span>Todos</span>
                    </label>
                  </div>
                </div>

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

        {/* Lista de Periféricos */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {perifericosFiltrados.map((periferico) => (
              <div
                key={periferico.id}
                className="group bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 hover:border-pink-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 cursor-pointer"
                onClick={() => navigate(`/product/${periferico.id}`)}
              >
                {/* Badge de desconto */}
                {periferico.desconto && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                    -{periferico.desconto}%
                  </div>
                )}

                {/* Imagem */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={periferico.imagem}
                    alt={periferico.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2">
                      {periferico.nome}
                    </h3>
                    <button className="text-gray-400 hover:text-pink-400">
                      <Heart size={20} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <RenderStars rating={periferico.avaliacao} />
                    <span className="text-sm text-gray-400">
                      ({periferico.numeroAvaliacoes})
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300 mb-4">
                    <p className="flex items-center gap-1">
                      {getIconByType(periferico.tipo)}
                      {periferico.tipo}
                    </p>
                    <div className="flex justify-between">
                      <span>{periferico.conexao}</span>
                      <span className={periferico.rgb ? "text-pink-400" : ""}>
                        {periferico.rgb ? "RGB" : "Sem RGB"}
                      </span>
                    </div>
                    <p className="text-xs">{periferico.marca}</p>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xl font-bold text-pink-400">
                        R${" "}
                        {periferico.preco.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                      {periferico.precoOriginal && (
                        <p className="text-xs text-gray-400 line-through">
                          R${" "}
                          {periferico.precoOriginal.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      )}
                    </div>
                    {periferico.freteGratis && (
                      <span className="flex items-center gap-1 text-green-400 text-sm">
                        <Truck size={16} />
                        <span>Grátis</span>
                      </span>
                    )}
                  </div>
                  <button
                    className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${periferico.id}`);
                    }}
                  >
                    <ShoppingCart size={18} />
                    Comprar agora
                  </button>
                </div>
              </div>
            ))}
          </div>
          {perifericosFiltrados.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">
                Nenhum periférico encontrado com esses filtros
              </p>
              <button
                onClick={() => {
                  setPrecoRange([0, 2000]);
                  setFreteGratis(false);
                  setAvaliacaoMinima(0);
                  setMarcasSelecionadas([]);
                  setTiposSelecionados([]);
                  setConexoesSelecionadas([]);
                  setRgb(null);
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