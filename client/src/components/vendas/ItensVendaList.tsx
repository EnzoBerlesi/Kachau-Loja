import { Minus, Plus, X } from 'lucide-react';
import type { Product } from '../../services/productService';

export interface ItemVenda {
  id: string;
  produto: Product;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

interface ItensVendaListProps {
  itens: ItemVenda[];
  onUpdateQuantidade: (id: string, novaQuantidade: number) => void;
  onRemoverItem: (id: string) => void;
}

const ItensVendaList = ({ itens, onUpdateQuantidade, onRemoverItem }: ItensVendaListProps) => {
  const total = itens.reduce((acc, item) => acc + item.subtotal, 0);

  if (itens.length === 0) {
    return (
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-purple-400">🛍️</span>
          Itens da Venda
        </h2>
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg mb-2">Nenhum produto adicionado</div>
          <div className="text-gray-500 text-sm">
            Use o campo de busca acima para adicionar produtos à venda
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-purple-400">🛍️</span>
        Itens da Venda ({itens.length})
      </h2>

      <div className="space-y-3 mb-4">
        {itens.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800/50 border border-gray-700/30 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex-1">
              <h3 className="font-medium text-white">{item.produto.name}</h3>
              <div className="text-sm text-gray-400 mt-1">
                {item.produto.category?.name || 'Sem categoria'} • R$ {item.precoUnitario.toFixed(2)} cada
              </div>
              {item.produto.description && (
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {item.produto.description}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 ml-4">
              <div className="flex items-center gap-2 bg-gray-700/50 rounded-lg px-2 py-1">
                <button
                  onClick={() => onUpdateQuantidade(item.id, Math.max(1, item.quantidade - 1))}
                  className="p-1 hover:bg-gray-600/50 rounded text-gray-300 hover:text-white transition-colors"
                  disabled={item.quantidade <= 1}
                >
                  <Minus className="h-3 w-3" />
                </button>
                
                <span className="text-white font-medium min-w-[2rem] text-center">
                  {item.quantidade}
                </span>
                
                <button
                  onClick={() => onUpdateQuantidade(item.id, item.quantidade + 1)}
                  className="p-1 hover:bg-gray-600/50 rounded text-gray-300 hover:text-white transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              <div className="text-right">
                <div className="text-white font-semibold">
                  R$ {item.subtotal.toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => onRemoverItem(item.id)}
                className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                title="Remover item"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-700/50 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-300">Total da Venda:</span>
          <span className="text-2xl font-bold text-green-400">
            R$ {total.toFixed(2)}
          </span>
        </div>
        <div className="text-sm text-gray-400 mt-1">
          {itens.length} {itens.length === 1 ? 'item' : 'itens'} • {itens.reduce((acc, item) => acc + item.quantidade, 0)} unidades
        </div>
      </div>
    </div>
  );
};

export default ItensVendaList;
