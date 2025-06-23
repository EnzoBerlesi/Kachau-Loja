import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";
import { type Product } from "../../services/productService";
import React from "react";

interface ProductsSectionProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onDeleteProduct: (id: string) => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  products,
  loading,
  error,
  onDeleteProduct,
}) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-white">Gerenciador de Produtos</h2>
      <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-[1.02]">
        <Plus size={20} />
        <span>Adicionar Produto</span>
      </button>
    </div>
    {error && (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )}
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
      <div className="flex space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
          />
        </div>
        <button className="bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 hover:border-purple-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200">
          <Filter size={20} />
          <span>Filtros</span>
        </button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-slate-700/50">
                <th className="text-left p-4 font-semibold text-slate-300">Produto</th>
                <th className="text-left p-4 font-semibold text-slate-300">Descrição</th>
                <th className="text-left p-4 font-semibold text-slate-300">Preço</th>
                <th className="text-left p-4 font-semibold text-slate-300">Estoque</th>
                <th className="text-left p-4 font-semibold text-slate-300">Categoria</th>
                <th className="text-left p-4 font-semibold text-slate-300">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                >
                  <td className="p-4 font-medium text-white">{product.name}</td>
                  <td className="p-4 text-slate-300 max-w-xs truncate">{product.description}</td>
                  <td className="p-4 text-white font-semibold">R$ {product.price.toFixed(2)}</td>
                  <td className="p-4 text-slate-300">{product.stock}</td>
                  <td className="p-4 text-slate-300">{product.category?.name || "N/A"}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button className="text-purple-400 hover:text-purple-300 transition-colors">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Nenhum produto encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

export default ProductsSection;
