import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Calendar, DollarSign, Users, Package } from 'lucide-react';
import Header from '../../components/layout/Header';
import { vendaService } from '../../services/vendaService';
import type { Venda } from '../../types/vendas';

const ListaVendasPage = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [vendasFiltradas, setVendasFiltradas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    busca: '',
    status: '' as '' | Venda['status'],
    formaPagamento: '' as '' | Venda['formaPagamento'],
    dataInicio: '',
    dataFim: ''
  });

  useEffect(() => {
    carregarVendas();
  }, []);

  useEffect(() => {
    const aplicarFiltros = () => {
      let resultado = [...vendas];

      if (filtros.busca) {
        resultado = resultado.filter(venda =>
          venda.cliente.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
          venda.numeroVenda.toLowerCase().includes(filtros.busca.toLowerCase()) ||
          venda.cliente.email.toLowerCase().includes(filtros.busca.toLowerCase())
        );
      }

      // Filtro por status
      if (filtros.status) {
        resultado = resultado.filter(venda => venda.status === filtros.status);
      }

      // Filtro por forma de pagamento
      if (filtros.formaPagamento) {
        resultado = resultado.filter(venda => venda.formaPagamento === filtros.formaPagamento);
      }

      // Filtro por data
      if (filtros.dataInicio) {
        const dataInicio = new Date(filtros.dataInicio);
        resultado = resultado.filter(venda => venda.dataVenda >= dataInicio);
      }

      if (filtros.dataFim) {
        const dataFim = new Date(filtros.dataFim);
        dataFim.setHours(23, 59, 59, 999); // Final do dia
        resultado = resultado.filter(venda => venda.dataVenda <= dataFim);
      }

      setVendasFiltradas(resultado);
    };

    aplicarFiltros();
  }, [vendas, filtros]);

  const carregarVendas = async () => {
    try {
      setLoading(true);
      const vendasData = await vendaService.getAll();
      console.log
      setVendas(vendasData);
    } catch (error) {
      console.error('Erro ao carregar vendas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatarData = (data: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(data));
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const getStatusColor = (status: Venda['status']) => {
    switch (status) {
      case 'pago':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'devolvido':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormaPagamentoText = (forma: Venda['formaPagamento']) => {
    switch (forma) {
      case 'dinheiro':
        return 'Dinheiro';
      case 'cartao-credito':
        return 'Cartão de Crédito';
      case 'cartao-debito':
        return 'Cartão de Débito';
      case 'pix':
        return 'PIX';
      case 'parcelado':
        return 'Parcelado';
      default:
        return forma;
    }
  };

  const calcularEstatisticas = () => {
    const vendasPagas = vendasFiltradas.filter(v => v.status === 'pago');
    const totalVendas = vendasPagas.reduce((sum, venda) => sum + venda.total, 0);
    const totalItens = vendasFiltradas.reduce((sum, venda) => 
      sum + venda.itens.reduce((itemSum, item) => itemSum + item.quantidade, 0), 0
    );
    
    return {
      totalVendas: vendasFiltradas.length,
      totalVendido: totalVendas,
      totalItens,
      ticketMedio: vendasPagas.length > 0 ? totalVendas / vendasPagas.length : 0
    };
  };

  const stats = calcularEstatisticas();

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Histórico de Vendas</h1>
            <p className="text-gray-600">Visualize e gerencie todas as vendas realizadas</p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="text-blue-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Vendido</p>
                  <p className="text-2xl font-bold text-gray-900">{formatarMoeda(stats.totalVendido)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Package className="text-green-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total de Vendas</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalVendas}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="text-purple-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Itens Vendidos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalItens}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Calendar className="text-orange-600" size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-gray-900">{formatarMoeda(stats.ticketMedio)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} />
              <h2 className="text-lg font-semibold">Filtros</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar por cliente ou número..."
                  value={filtros.busca}
                  onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <select
                value={filtros.status}
                onChange={(e) => setFiltros(prev => ({ ...prev, status: e.target.value as Venda['status'] }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Todos os Status</option>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="cancelado">Cancelado</option>
                <option value="devolvido">Devolvido</option>
              </select>

              <select
                value={filtros.formaPagamento}
                onChange={(e) => setFiltros(prev => ({ ...prev, formaPagamento: e.target.value as Venda['formaPagamento'] }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Todas as Formas</option>
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao-credito">Cartão de Crédito</option>
                <option value="cartao-debito">Cartão de Débito</option>
                <option value="pix">PIX</option>
                <option value="parcelado">Parcelado</option>
              </select>

              <input
                type="date"
                value={filtros.dataInicio}
                onChange={(e) => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              <input
                type="date"
                value={filtros.dataFim}
                onChange={(e) => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Lista de Vendas */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Venda
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pagamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vendasFiltradas.length > 0 ? (
                    vendasFiltradas.map(venda => (
                      <tr key={venda.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {venda.numeroVenda}
                            </div>
                            <div className="text-sm text-gray-500">
                              {venda.itens.length} {venda.itens.length === 1 ? 'item' : 'itens'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {venda.cliente.nome}
                            </div>
                            <div className="text-sm text-gray-500">
                              {venda.cliente.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatarData(venda.dataVenda)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="font-medium">{formatarMoeda(venda.total)}</div>
                          {venda.desconto > 0 && (
                            <div className="text-xs text-gray-500">
                              Desc: {formatarMoeda(venda.desconto)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>{getFormaPagamentoText(venda.formaPagamento)}</div>
                          {venda.parcelas && venda.parcelas > 1 && (
                            <div className="text-xs text-gray-500">
                              {venda.parcelas}x de {formatarMoeda(venda.total / venda.parcelas)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(venda.status)}`}>
                            {venda.status.charAt(0).toUpperCase() + venda.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                            <Eye size={16} />
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <Package size={48} className="text-gray-300 mb-4" />
                          <p className="text-lg">Nenhuma venda encontrada</p>
                          <p className="text-sm">Ajuste os filtros ou registre uma nova venda</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListaVendasPage;
