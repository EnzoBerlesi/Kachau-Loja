import { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import type { SalesReport, CustomerReport, ChannelSalesReport, StockReport } from '../../services/reportService';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  lowStockItems: number;
}

function ReportsDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStockItems: 0
  });
  const [recentSales, setRecentSales] = useState<SalesReport[]>([]);
  const [topCustomers, setTopCustomers] = useState<CustomerReport[]>([]);
  const [channelData, setChannelData] = useState<ChannelSalesReport[]>([]);
  const [criticalStock, setCriticalStock] = useState<StockReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados dos últimos 6 meses de vendas
      const currentYear = new Date().getFullYear();
      const salesData = await reportService.getMonthlySalesReport(currentYear);
      
      // Carregar top 3 clientes
      const customersData = await reportService.getTopCustomersReport();
      
      // Carregar dados de canais
      const channelsData = await reportService.getChannelSalesReport();
      
      // Carregar estoque crítico
      const stockData = await reportService.getStockReport();
      const criticalStockItems = stockData.filter(item => 
        item.status === 'critico' || item.status === 'sem_estoque'
      );
      
      // Calcular estatísticas
      const totalRevenue = salesData.reduce((sum, month) => sum + month.totalRevenue, 0);
      const totalOrders = salesData.reduce((sum, month) => sum + month.totalOrders, 0);
      const lowStockItems = stockData.filter(item => 
        item.status === 'baixo' || item.status === 'critico' || item.status === 'sem_estoque'
      ).length;

      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers: customersData.length,
        lowStockItems
      });

      setRecentSales(salesData.slice(-6)); // Últimos 6 meses
      setTopCustomers(customersData.slice(0, 3)); // Top 3
      setChannelData(channelsData);
      setCriticalStock(criticalStockItems.slice(0, 5)); // Top 5 críticos

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'critico': return 'text-orange-400';
      case 'sem_estoque': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500 border-r-2"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            Dashboard de Relatórios
          </h1>
          <p className="text-slate-400">Visão geral do desempenho da loja</p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Receita Total</p>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.totalRevenue)}</p>
              </div>
              <div className="text-green-400 text-3xl">💰</div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total de Pedidos</p>
                <p className="text-2xl font-bold text-blue-400">{stats.totalOrders}</p>
              </div>
              <div className="text-blue-400 text-3xl">📋</div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Clientes Ativos</p>
                <p className="text-2xl font-bold text-purple-400">{stats.totalCustomers}</p>
              </div>
              <div className="text-purple-400 text-3xl">👥</div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-slate-700/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Estoque Baixo</p>
                <p className="text-2xl font-bold text-red-400">{stats.lowStockItems}</p>
              </div>
              <div className="text-red-400 text-3xl">⚠️</div>
            </div>
          </div>
        </div>

        {/* Gráficos e Tabelas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Vendas Recentes */}
          <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-lg border border-slate-700/30">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              📊 Vendas dos Últimos 6 Meses
            </h3>
            <div className="space-y-3">
              {recentSales.map((sale, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                  <span className="text-slate-300">{sale.month}</span>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">{formatCurrency(sale.totalRevenue)}</div>
                    <div className="text-slate-400 text-sm">{sale.totalOrders} pedidos</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Clientes */}
          <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-lg border border-slate-700/30">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              🏆 Top 3 Clientes
            </h3>
            <div className="space-y-3">
              {topCustomers.map((customer) => (
                <div key={customer.customerId} className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                  <div>
                    <div className="text-white font-medium">{customer.customerName}</div>
                    <div className="text-slate-400 text-sm">{customer.totalOrders} pedidos</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">{formatCurrency(customer.totalSpent)}</div>
                    <div className="text-slate-400 text-sm">Ticket: {formatCurrency(customer.averageOrderValue)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Canais de Venda e Estoque Crítico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Canais de Venda */}
          <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-lg border border-slate-700/30">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              🔄 Vendas por Canal
            </h3>
            <div className="space-y-3">
              {channelData.map((channel) => (
                <div key={channel.channel} className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                  <div>
                    <div className="text-white font-medium capitalize">{channel.channel}</div>
                    <div className="text-slate-400 text-sm">{channel.totalOrders} pedidos</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">{formatCurrency(channel.totalRevenue)}</div>
                    <div className="text-purple-400 text-sm">{channel.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estoque Crítico */}
          <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-lg border border-slate-700/30">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              ⚠️ Estoque Crítico
            </h3>
            <div className="space-y-3">
              {criticalStock.length > 0 ? (
                criticalStock.map((item) => (
                  <div key={item.productId} className="flex justify-between items-center p-3 bg-slate-700/30 rounded">
                    <div>
                      <div className="text-white font-medium">{item.productName}</div>
                      <div className="text-slate-400 text-sm">{item.categoryName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-300">Estoque: {item.currentStock}</div>
                      <div className={`text-sm font-medium ${getStockStatusColor(item.status)}`}>
                        {item.status === 'critico' ? 'Crítico' : 'Sem Estoque'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-400 py-4">
                  ✅ Nenhum item com estoque crítico
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <a
            href="/admin/reports"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            📊 Ver Relatórios Completos
          </a>
          <button
            onClick={() => window.location.reload()}
            className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            🔄 Atualizar Dados
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportsDashboard;
