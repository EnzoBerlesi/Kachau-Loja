import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import type { Product } from '../../services/productService';

interface ProdutoSelectorProps {
  produtos: Product[];
  onAddProduto: (produto: Product) => void;
  loading?: boolean;
}

const ProdutoSelector = ({ produtos, onAddProduto, loading = false }: ProdutoSelectorProps) => {
  const [buscaProduto, setBuscaProduto] = useState('');
  const [showProdutoDropdown, setShowProdutoDropdown] = useState(false);

  const produtosFiltrados = produtos.filter(produto =>
    produto.name.toLowerCase().includes(buscaProduto.toLowerCase()) ||
    produto.description?.toLowerCase().includes(buscaProduto.toLowerCase()) ||
    produto.category?.name?.toLowerCase().includes(buscaProduto.toLowerCase())
  );

  const adicionarProduto = (produto: Product) => {
    onAddProduto(produto);
    setBuscaProduto('');
    setShowProdutoDropdown(false);
  };

  if (loading) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <span className="ml-2 text-gray-300">Carregando produtos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-blue-400">📦</span>
        Adicionar Produtos
      </h2>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar produto por nome, descrição ou categoria..."
          value={buscaProduto}
          onChange={(e) => {
            setBuscaProduto(e.target.value);
            setShowProdutoDropdown(true);
          }}
          onFocus={() => setShowProdutoDropdown(true)}
          onBlur={() => setTimeout(() => setShowProdutoDropdown(false), 200)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:border-blue-500/50 focus:outline-none text-white placeholder-gray-400"
        />
        
        {showProdutoDropdown && buscaProduto && (
          <div className="absolute z-10 w-full mt-1 bg-gray-800/90 border border-gray-700/50 rounded-lg shadow-lg max-h-60 overflow-y-auto backdrop-blur-md">
            {produtosFiltrados.length > 0 ? (
              produtosFiltrados.map(produto => (
                <button
                  key={produto.id}
                  onClick={() => adicionarProduto(produto)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700/30 border-b border-gray-700/30 last:border-0 transition-colors duration-200 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="font-medium text-white">{produto.name}</div>
                    <div className="text-sm text-gray-400">
                      {produto.category?.name || 'Sem categoria'} • R$ {produto.price.toFixed(2)}
                    </div>
                    {produto.description && (
                      <div className="text-xs text-gray-500 mt-1 truncate">
                        {produto.description}
                      </div>
                    )}
                  </div>
                  <Plus className="h-4 w-4 text-green-400 flex-shrink-0 ml-2" />
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-400">Nenhum produto encontrado</div>
            )}
          </div>
        )}
      </div>

      {produtos.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="text-yellow-400 font-medium">⚠️ Nenhum produto cadastrado</div>
          <div className="text-yellow-300 text-sm mt-1">
            Você precisa cadastrar produtos antes de criar uma venda.
          </div>
        </div>
      )}
    </div>
  );
};

export default ProdutoSelector;
