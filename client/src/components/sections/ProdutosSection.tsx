import React, { useState } from 'react';
import { Plus, Search, Package, Tag, DollarSign } from 'lucide-react';
import type { ProdutoVenda } from '../../types/vendas';

interface ProdutosSectionProps {
  produtos: ProdutoVenda[];
  loading: boolean;
  error: string | null;
  onNovoProduto: () => void;
  onDeleteProduto?: (id: string) => void;
}

const ProdutosSection: React.FC<ProdutosSectionProps> = ({
  produtos,
  loading,
  error,
  onNovoProduto,
  onDeleteProduto
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState<string>('todas');

  const categorias = Array.from(new Set(produtos.map(p => p.categoria)));

  const produtosFiltrados = produtos.filter(produto => {
    const matchesSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         produto.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (produto.codigoBarras && produto.codigoBarras.includes(searchTerm));
    const matchesCategoria = categoriaFilter === 'todas' || produto.categoria === categoriaFilter;
    return matchesSearch && matchesCategoria;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Produtos</h2>
          <p className="text-gray-400">Gerencie seu catálogo de produtos</p>
        </div>
        
        <button
          onClick={onNovoProduto}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-lg hover:from-purple-600 hover:to-violet-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Produto</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar por nome, descrição ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:border-purple-500/50 focus:outline-none text-white placeholder-gray-400"
          />
        </div>
        
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
            className="pl-10 pr-8 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:border-purple-500/50 focus:outline-none text-white appearance-none min-w-[160px]"
          >
            <option value="todas">Todas Categorias</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de produtos */}
      <div className="grid gap-4">
        {produtosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              {produtos.length === 0 ? 'Nenhum produto cadastrado' : 'Nenhum produto encontrado'}
            </h3>
            <p className="text-gray-500">
              {produtos.length === 0 ? 'Comece cadastrando seu primeiro produto' : 'Tente ajustar os filtros de busca'}
            </p>
          </div>
        ) : (
          produtosFiltrados.map((produto) => (
            <div
              key={produto.id}
              className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 hover:bg-gray-700/30 transition-colors duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {produto.imagem ? (
                        <img
                          src={produto.imagem}
                          alt={produto.nome}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <h3 className="text-lg font-semibold text-white">
                        {produto.nome}
                      </h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      produto.ativo 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {produto.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-2">{produto.descricao}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-400">
                    <div>
                      <span className="text-purple-400">Categoria:</span> {produto.categoria}
                    </div>
                    <div>
                      <span className="text-purple-400">Estoque:</span> {produto.estoque} un.
                    </div>
                    {produto.marca && (
                      <div>
                        <span className="text-purple-400">Marca:</span> {produto.marca}
                      </div>
                    )}
                    {produto.codigoBarras && (
                      <div>
                        <span className="text-purple-400">Código:</span> {produto.codigoBarras}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Cadastrado em: {formatDate(produto.dataCadastro)}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-purple-400 font-semibold text-lg">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatCurrency(produto.preco)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/30 transition-colors duration-200">
                      Editar
                    </button>
                    {onDeleteProduto && (
                      <button 
                        onClick={() => onDeleteProduto(produto.id)}
                        className="px-3 py-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors duration-200"
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProdutosSection;
