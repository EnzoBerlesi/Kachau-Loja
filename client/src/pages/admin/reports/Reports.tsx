import { useState, useEffect, useCallback } from 'react';
import { reportService, type SalesReport, type CustomerReport, type ChannelSalesReport, type StockReport, type MonthlySaleDetail } from '../../../services/reportService';

function Reports() {
  const [activeTab, setActiveTab] = useState<'vendas' | 'clientes' | 'canais' | 'estoque'>('vendas');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para diferentes relatórios
  const [salesData, setSalesData] = useState<SalesReport[]>([]);
  const [customersData, setCustomersData] = useState<CustomerReport[]>([]);
  const [channelsData, setChannelsData] = useState<ChannelSalesReport[]>([]);
  const [stockData, setStockData] = useState<StockReport[]>([]);

  // Estados para vendas detalhadas de um mês selecionado
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [monthlyDetails, setMonthlyDetails] = useState<MonthlySaleDetail[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Filtros
  const [selectedYear, setSelectedYear] = useState(2025);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      switch (activeTab) {
        case 'vendas': {
          const sales = await reportService.getMonthlySalesReport(selectedYear);
          setSalesData(sales);
          break;
        }
        case 'clientes': {
          const customers = await reportService.getTopCustomersReport({ startDate, endDate });
          setCustomersData(customers);
          break;
        }
        case 'canais': {
          const channels = await reportService.getChannelSalesReport({ startDate, endDate, channel: selectedChannel });
          setChannelsData(channels);
          break;
        }
        case 'estoque': {
          const stock = await reportService.getStockReport();
          setStockData(stock);
          break;
        }
      }
    } catch (err) {
      setError('Erro ao carregar dados do relatório');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedYear, startDate, endDate, selectedChannel]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExport = async () => {
    try {
      setLoading(true);
      switch (activeTab) {
        case 'vendas':
          await reportService.exportMonthlySalesReport(selectedYear);
          break;
        case 'clientes':
          await reportService.exportCustomersReport({ startDate, endDate });
          break;
        case 'estoque':
          await reportService.exportStockReport();
          break;
      }
    } catch (err) {
      setError('Erro ao exportar relatório');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar detalhes de vendas de um mês específico
  const loadMonthlyDetails = async (month: string) => {
    setLoadingDetails(true);
    try {
      const details = await reportService.getMonthlySalesDetails(selectedYear, month);
      setMonthlyDetails(details);
      setSelectedMonth(month);
    } catch (err) {
      setError('Erro ao carregar detalhes do mês');
      console.error(err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Função para fechar os detalhes do mês
  const closeMonthlyDetails = () => {
    setSelectedMonth(null);
    setMonthlyDetails([]);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400 bg-green-900/30';
      case 'baixo': return 'text-yellow-400 bg-yellow-900/30';
      case 'critico': return 'text-orange-400 bg-orange-900/30';
      case 'sem_estoque': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getStockStatusText = (status: string) => {
    switch (status) {
      case 'normal': return 'Normal';
      case 'baixo': return 'Baixo';
      case 'critico': return 'Crítico';
      case 'sem_estoque': return 'Sem Estoque';
      default: return 'Desconhecido';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'entregue': return 'text-green-400 bg-green-900/30';
      case 'enviado': return 'text-blue-400 bg-blue-900/30';
      case 'processando': return 'text-yellow-400 bg-yellow-900/30';
      case 'pendente': return 'text-orange-400 bg-orange-900/30';
      case 'cancelado': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'entregue': return 'Entregue';
      case 'enviado': return 'Enviado';
      case 'processando': return 'Processando';
      case 'pendente': return 'Pendente';
      case 'cancelado': return 'Cancelado';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
            Relatórios
          </h1>

          {/* Navegação por abas */}
          <div className="flex space-x-1 mb-8 bg-slate-800/50 backdrop-blur-sm rounded-lg p-1">
            {[
              { key: 'vendas', label: 'Vendas Mensais' },
              { key: 'clientes', label: 'Top Clientes' },
              { key: 'canais', label: 'Canais de Venda' },
              { key: 'estoque', label: 'Estoque' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.key
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filtros */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-purple-300 mb-4">Filtros</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {activeTab === 'vendas' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Ano</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                  >
                    {[2025, 2024, 2023, 2022].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              )}

              {(activeTab === 'clientes' || activeTab === 'canais') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Data Inicial</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Data Final</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                    />
                  </div>
                </>
              )}

              {activeTab === 'canais' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Canal</label>
                  <select
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white"
                  >
                    <option value="">Todos os canais</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="Marketplace">Marketplace</option>
                    <option value="presencial">Presencial</option>
                  </select>
                </div>
              )}

              <div className="flex items-end">
                <button
                  onClick={handleExport}
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  {loading ? 'Exportando...' : 'Exportar CSV'}
                </button>
              </div>
            </div>
          </div>

          {/* Conteúdo do relatório */}
          {error && (
            <div className="bg-red-900/30 border border-red-800/50 text-red-300 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500 border-r-2"></div>
            </div>
          ) : (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg overflow-hidden">
              {/* Relatório de Vendas Mensais */}
              {activeTab === 'vendas' && (
                <div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-700/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Mês</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pedidos</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Itens Vendidos</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Receita</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ticket Médio</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {salesData.map((item, index) => (
                          <tr key={index} className="hover:bg-slate-700/30">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.month}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.totalOrders}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.totalSales}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{formatCurrency(item.totalRevenue)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-400">{formatCurrency(item.averageOrderValue)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => loadMonthlyDetails(item.month)}
                                className="text-purple-400 hover:text-purple-300 font-medium"
                              >
                                Ver Detalhes
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Modal ou seção de detalhes do mês selecionado */}
                  {selectedMonth && (
                    <div className="mt-8 bg-slate-700/50 rounded-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">
                          Vendas Detalhadas - {selectedMonth}
                        </h3>
                        <button
                          onClick={closeMonthlyDetails}
                          className="text-gray-400 hover:text-white"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      {loadingDetails ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-slate-800/50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pedido</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Data</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Valor</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Itens</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Canal</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-600/50">
                              {monthlyDetails.map((detail) => (
                                <tr key={detail.orderId} className="hover:bg-slate-600/30">
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-white font-mono">#{detail.orderId}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    <div>
                                      <div className="text-white">{detail.customerName}</div>
                                      <div className="text-gray-400 text-xs">{detail.customerEmail}</div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{formatDate(detail.orderDate)}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-green-400">{formatCurrency(detail.totalAmount)}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{detail.itemsCount}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300 capitalize">
                                    {detail.channel === 'ecommerce' ? 'E-commerce' : detail.channel}
                                  </td>
                                  <td className="px-4 py-3 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${getOrderStatusColor(detail.status)}`}>
                                      {getOrderStatusText(detail.status)}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Relatório de Clientes */}
              {activeTab === 'clientes' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Cliente</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pedidos</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total Gasto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Ticket Médio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Última Compra</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {customersData.map((customer) => (
                        <tr key={customer.customerId} className="hover:bg-slate-700/30">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{customer.customerName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{customer.customerEmail}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{customer.totalOrders}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{formatCurrency(customer.totalSpent)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-400">{formatCurrency(customer.averageOrderValue)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(customer.lastOrderDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Relatório de Canais */}
              {activeTab === 'canais' && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {channelsData.map((channel) => (
                      <div key={channel.channel} className="bg-slate-700/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 capitalize">
                          {channel.channel === 'ecommerce' ? 'E-commerce' : channel.channel}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Pedidos:</span>
                            <span className="text-white font-medium">{channel.totalOrders}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Itens:</span>
                            <span className="text-white font-medium">{channel.totalSales}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Receita:</span>
                            <span className="text-green-400 font-medium">{formatCurrency(channel.totalRevenue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Participação:</span>
                            <span className="text-purple-400 font-medium">{channel.percentage}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Relatório de Estoque */}
              {activeTab === 'estoque' && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Produto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Categoria</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estoque Atual</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estoque Mínimo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Preço Unit.</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Valor Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {stockData.map((item) => (
                        <tr key={item.productId} className="hover:bg-slate-700/30">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.productName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.categoryName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.currentStock}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.minStock}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStockStatusColor(item.status)}`}>
                              {getStockStatusText(item.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-400">{formatCurrency(item.unitPrice)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{formatCurrency(item.totalValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;
