import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Star, ShoppingCart, Truck, Search } from 'lucide-react';
import Header from "../../components/layout/Header";
import type { Product } from '../../types/shop';


// Mock específico para produtos Gamer
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
    categoria: "Gaming",
    numeroAvaliacoes: 512
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
    categoria: "Gaming",
    numeroAvaliacoes: 342
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
    categoria: "Gaming",
    numeroAvaliacoes: 342
  },
];

export default function Gamer() {
  const navigate = useNavigate();
  
  // Estados dos filtros
  const [precoRange, setPrecoRange] = useState([0, 20000]);
  const [freteGratis] = useState(false);
  const [avaliacaoMinima] = useState(0);
  const [termoBusca, setTermoBusca] = useState('');

  // Função para redirecionar para a página de produto
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  // Filtros
  const produtosFiltrados = mockProdutosGamer.filter(produto => {
    if (produto.preco < precoRange[0] || produto.preco > precoRange[1]) return false;
    if (freteGratis && !produto.freteGratis) return false;
    if (produto.avaliacao < avaliacaoMinima) return false;
    if (termoBusca && !produto.nome.toLowerCase().includes(termoBusca.toLowerCase())) return false;
    return true;
  });

  // Componente de estrelas
  const RenderStars = ({ rating }: { rating: number }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star}
          size={16}
          className={`${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
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
            GAMER
          </h1>
        </div>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Hardware de alta performance para dominar nos games. Frete grátis para assinantes!
        </p>
      </div>

      {/* Barra de filtros */}
      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-md border-b border-purple-900/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Pesquisar produtos gamer..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
            />
          </div>
          
          {/* Filtro de preço (simplificado) */}
          <select 
            onChange={(e) => setPrecoRange([0, Number(e.target.value)])}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700"
          >
            <option value="20000">Todos os preços</option>
            <option value="5000">Até R$ 5.000</option>
            <option value="10000">Até R$ 10.000</option>
            <option value="20000">Até R$ 20.000</option>
          </select>
        </div>
      </div>

      {/* Listagem */}
      <main className="max-w-7xl mx-auto px-4 py-8">        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtosFiltrados.map(produto => (
            <div 
              key={produto.id} 
              onClick={() => handleProductClick(produto.id)}
              className="group bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50 hover:border-green-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 cursor-pointer"
            >
              {/* Imagem */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {produto.precoOriginal && (
                  <div className="absolute top-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{Math.round((1 - produto.preco / produto.precoOriginal) * 100)}%
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{produto.nome}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <RenderStars rating={produto.avaliacao} />
                  <span className="text-sm text-gray-400">({produto.numeroAvaliacoes})</span>
                </div>

                <div className="space-y-2 text-sm text-gray-300 mb-4">
                  <p><span className="text-green-400">GPU:</span> {produto.especificacoes.placaVideo}</p>
                  <p><span className="text-green-400">CPU:</span> {produto.especificacoes.processador}</p>
                  <p><span className="text-green-400">RAM:</span> {produto.especificacoes.ram}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p className="text-xl font-bold text-green-400">
                    R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  {produto.freteGratis && (
                    <span className="flex items-center gap-1 text-green-400 text-sm">
                      <Truck size={16} />
                      <span>Grátis</span>
                    </span>
                  )}
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Previne o redirecionamento ao clicar no botão
                    handleProductClick(produto.id);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  <ShoppingCart size={18} />
                  Comprar agora
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}