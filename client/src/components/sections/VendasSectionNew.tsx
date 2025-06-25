import React, { useState } from 'react';
import { Plus, Search, Filter, ShoppingCart, Calendar, DollarSign } from 'lucide-react';
import type { Venda } from '../../types/vendas';

interface VendasSectionProps {
  vendas: Venda[];
  loading: boolean;
  error: string | null;
  onNovaVenda: () => void;
}

const VendasSection: React.FC<VendasSectionProps> = ({
  vendas,
  loading,
  error,
  onNovaVenda
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [localVendaFilter, setLocalVendaFilter] = useState<string>('todos');

  const vendasFiltradas = vendas.filter(venda => {
    const matchesSearch = venda.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venda.numeroVenda.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' || venda.status === statusFilter;
    const matchesLocal = localVendaFilter === 'todos' || venda.localVenda === localVendaFilter;
    return matchesSearch && matchesStatus && matchesLocal;
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getLocalVendaIcon = (localVenda: string) => {
    switch (localVenda) {
      case 'vendedor':
        return '👤';
      case 'loja-fisica':
        return '🏪';
      default:
        return '📍';
    }
  };

  const getLocalVendaLabel = (localVenda: string) => {
    switch (localVenda) {
      case 'vendedor':
        return 'Vendedor';
      case 'loja-fisica':
        return 'Loja Física';
      default:
        return 'Não definido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pendente':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelado':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'devolvido':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
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
          <h2 className="text-2xl font-bold text-white">Vendas</h2>
          <p className="text-gray-400">Gerencie e acompanhe suas vendas</p>
        </div>
        
        <button
          onClick={onNovaVenda}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Venda</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Buscar por cliente ou número da venda..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:border-green-500/50 focus:outline-none text-white placeholder-gray-400"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:border-green-500/50 focus:outline-none text-white appearance-none min-w-[140px]"
          >
            <option value="todos">Todos Status</option>
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="cancelado">Cancelado</option>
            <option value="devolvido">Devolvido</option>
          </select>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={localVendaFilter}
            onChange={(e) => setLocalVendaFilter(e.target.value)}
            className="pl-10 pr-8 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:border-green-500/50 focus:outline-none text-white appearance-none min-w-[140px]"
          >
            <option value="todos">Todos Locais</option>
            <option value="vendedor">Vendedor</option>
            <option value="loja-fisica">Loja Física</option>
          </select>
        </div>
      </div>

      {/* Lista de vendas */}
      <div className="grid gap-4">
        {vendasFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              {vendas.length === 0 ? 'Nenhuma venda encontrada' : 'Nenhuma venda corresponde aos filtros'}
            </h3>
            <p className="text-gray-500">
              {vendas.length === 0 ? 'Comece criando sua primeira venda' : 'Tente ajustar os filtros de busca'}
            </p>
          </div>
        ) : (
          vendasFiltradas.map((venda) => (
            <div
              key={venda.id}
              className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 hover:bg-gray-700/30 transition-colors duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      Venda #{venda.numeroVenda}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(venda.status)}`}>
                      {venda.status.charAt(0).toUpperCase() + venda.status.slice(1)}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {getLocalVendaIcon(venda.localVenda)} {getLocalVendaLabel(venda.localVenda)}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <span>Cliente:</span>
                      <span className="text-white">{venda.cliente.nome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(venda.dataVenda)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-400 font-semibold">
                      <DollarSign className="h-4 w-4" />
                      <span>{formatCurrency(venda.total)}</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {venda.itens.length} {venda.itens.length === 1 ? 'item' : 'itens'}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/30 transition-colors duration-200">
                      Ver Detalhes
                    </button>
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

export default VendasSection;
