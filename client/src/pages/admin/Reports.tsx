import { useState, useEffect, useCallback } from 'react';
import { reportService } from '../../services/reportService';
import type { SalesReport, CustomerReport, ChannelSalesReport, StockReport, ReportFilters } from '../../services/reportService';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../services/categoryService';

function Reports() {
  const [activeTab, setActiveTab] = useState('sales');
  const [salesData, setSalesData] = useState<SalesReport[]>([]);
  const [customersData, setCustomersData] = useState<CustomerReport[]>([]);
  const [channelData, setChannelData] = useState<ChannelSalesReport[]>([]);
  const [stockData, setStockData] = useState<StockReport[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const loadSalesData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reportService.getMonthlySalesReport(selectedYear);
      setSalesData(data);
    } catch {
      setError('Erro ao carregar relatório de vendas');
    } finally {
      setLoading(false);
    }
  }, [selectedYear]);

  const loadCustomersData = useCallback(async () => {
    try {
      setLoading(true);
      const filters: ReportFilters = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      
      const data = await reportService.getTopCustomersReport(filters);
      setCustomersData(data);
    } catch {
      setError('Erro ao carregar relatório de clientes');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  const loadChannelData = useCallback(async () => {
    try {
      setLoading(true);
      const filters: ReportFilters = {};
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      if (selectedChannel) filters.channel = selectedChannel;
      
      const data = await reportService.getChannelSalesReport(filters);
      setChannelData(data);
    } catch {
      setError('Erro ao carregar relatório de canais');
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, selectedChannel]);

  const loadStockData = useCallback(async () => {
    try {
      setLoading(true);
      const filters: ReportFilters = {};
      if (selectedCategory) filters.categoryId = selectedCategory;
      
      const data = await reportService.getStockReport(filters);
      setStockData(data);
    } catch {
      setError('Erro ao carregar relatório de estoque');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
      } catch {
        console.error('Erro ao carregar dados iniciais');
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === 'sales') {
      loadSalesData();
    } else if (activeTab === 'customers') {
      loadCustomersData();
    } else if (activeTab === 'channels') {
      loadChannelData();
    } else if (activeTab === 'stock') {
      loadStockData();
    }
  }, [activeTab, selectedYear, startDate, endDate, selectedChannel, selectedCategory, loadSalesData, loadCustomersData, loadChannelData, loadStockData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-400';
      case 'baixo': return 'text-yellow-400';
      case 'critico': return 'text-orange-400';
      case 'sem_estoque': return 'text-red-400';
      default: return 'text-gray-400';
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

  const handleExport = async () => {
    try {
      if (activeTab === 'sales') {
        await reportService.exportMonthlySalesReport(selectedYear);
      } else if (activeTab === 'customers') {
        const filters: ReportFilters = {};
        if (startDate) filters.startDate = startDate;
        if (endDate) filters.endDate = endDate;
        await reportService.exportCustomersReport(filters);
      } else if (activeTab === 'stock') {
        const filters: ReportFilters = {};
        if (selectedCategory) filters.categoryId = selectedCategory;
        await reportService.exportStockReport(filters);
      }
    } catch (err) {
      console.error('Erro ao exportar relatório:', err);
      setError('Erro ao exportar relatório');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            Relatórios
          </h1>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg mb-6">
            {[
              { id: 'sales', label: 'Vendas Mensais', icon: '📊' },
              { id: 'customers', label: 'Top Clientes', icon: '👥' },
              { id: 'channels', label: 'Canais de Venda', icon: '🔄' },
              { id: 'stock', label: 'Estoque', icon: '📦' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filtros */}
          <div className="bg-slate-800/30 backdrop-blur-sm p-4 rounded-lg border border-slate-700/30 mb-6">
            <div className="flex flex-wrap gap-4 items-end">
              {activeTab === 'sales' && (
                <div className="flex flex-col">
                  <label className="text-sm text-slate-300 mb-1">Ano</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="bg-slate-700 text-white rounded px-3 py-2 border border-slate-600"
                  >
                    {[2023, 2024, 2025].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              )}

              {(activeTab === 'customers' || activeTab === 'channels') && (
                <>
                  <div className="flex flex-col">
                    <label className="text-sm text-slate-300 mb-1">Data Início</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-slate-700 text-white rounded px-3 py-2 border border-slate-600"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-slate-300 mb-1">Data Fim</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-slate-700 text-white rounded px-3 py-2 border border-slate-600"
                    />
                  </div>
                </>
              )}

              {activeTab === 'channels' && (
                <div className="flex flex-col">
                  <label className="text-sm text-slate-300 mb-1">Canal</label>
                  <select
                    value={selectedChannel}
                    onChange={(e) => setSelectedChannel(e.target.value)}
                    className="bg-slate-700 text-white rounded px-3 py-2 border border-slate-600"
                  >
                    <option value="">Todos</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="telefone">Telefone</option>
                    <option value="presencial">Presencial</option>
                  </select>
                </div>
              )}

              {activeTab === 'stock' && (
                <div className="flex flex-col">
                  <label className="text-sm text-slate-300 mb-1">Categoria</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-slate-700 text-white rounded px-3 py-2 border border-slate-600"
                  >
                    <option value="">Todas</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <button
                onClick={handleExport}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors flex items-center gap-2"
              >
                📥 Exportar CSV
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500 border-r-2"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-800/50 text-red-300 p-6 rounded-lg text-center">
            {error}
          </div>
        ) : (
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg border border-slate-700/30 overflow-hidden">
            {/* Vendas Mensais */}
            {activeTab === 'sales' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Mês</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Pedidos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Itens Vendidos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Receita</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Ticket Médio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {salesData.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-700/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.month}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{item.totalOrders}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{item.totalSales}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{formatCurrency(item.totalRevenue)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-400">{formatCurrency(item.averageOrderValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Top Clientes */}
            {activeTab === 'customers' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Cliente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Pedidos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Total Gasto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Ticket Médio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Última Compra</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {customersData.map((customer) => (
                      <tr key={customer.customerId} className="hover:bg-slate-700/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{customer.customerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{customer.customerEmail}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{customer.totalOrders}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{formatCurrency(customer.totalSpent)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-400">{formatCurrency(customer.averageOrderValue)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{new Date(customer.lastOrderDate).toLocaleDateString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Canais de Venda */}
            {activeTab === 'channels' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Canal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Pedidos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Itens Vendidos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Receita</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Participação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {channelData.map((channel) => (
                      <tr key={channel.channel} className="hover:bg-slate-700/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white capitalize">{channel.channel}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{channel.totalOrders}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{channel.totalSales}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">{formatCurrency(channel.totalRevenue)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-400">{channel.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Estoque */}
            {activeTab === 'stock' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Produto</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Categoria</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Estoque Atual</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Estoque Mínimo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Preço Unit.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Valor Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {stockData.map((item) => (
                      <tr key={item.productId} className="hover:bg-slate-700/30">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{item.productName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{item.categoryName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{item.currentStock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{item.minStock}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStockStatusColor(item.status)}`}>
                          {getStockStatusText(item.status)}
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
  );
}

export default Reports;
