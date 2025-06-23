import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { type Category } from "../../services/categoryService";
import React from "react";

interface CategoriesSectionProps {
  categories: Category[];
  loading: boolean;
  error: string | null;
  onDeleteCategory: (id: string) => void;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  loading,
  error,
  onDeleteCategory,
}) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-white">Gerenciamento de Categorias</h2>
      <button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-[1.02]">
        <Plus size={20} />
        <span>Adicionar Categoria</span>
      </button>
    </div>
    {error && (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        <div className="col-span-full flex justify-center items-center py-8">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl hover:border-purple-400/50 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-400/20 rounded-lg">
                    <Tag className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                </div>
                <div className="flex space-x-2">
                  <button className="text-purple-400 hover:text-purple-300 transition-colors">
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDeleteCategory(category.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-slate-300 text-sm">{category.description}</p>
            </div>
          ))}
          {categories.length === 0 && !loading && (
            <div className="col-span-full text-center text-slate-400 py-8">
              Nenhuma categoria encontrada
            </div>
          )}
        </>
      )}
    </div>
  </div>
);

export default CategoriesSection;
