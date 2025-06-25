import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportService } from '../../../services/reportService';
import type { SalesReport, CustomerReport, StockReport } from '../../../services/reportService';

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
  const [criticalStock, setCriticalStock] = useState<StockReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Carregar dados de vendas mensais do ano atual
      const currentYear = new Date().getFullYear();
      const salesData = await reportService.getMonthlySalesReport(currentYear);
      
      // Carregar top clientes
      const customersData = await reportService.getTopCustomersReport();
      
      // Carregar relatório de estoque
      const stockData = await reportService.getStockReport();
      
      // Calcular estatísticas
      const totalRevenue = salesData.reduce((sum, month) => sum + month.totalRevenue, 0);
      const totalOrders = salesData.reduce((sum, month) => sum + month.totalOrders, 0);
      const lowStockItems = stockData.filter(item => item.status === 'baixo' || item.status === 'critico' || item.status === 'sem_estoque').length;
      
      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers: customersData.length,
        lowStockItems
      });
      
      // Pegar últimos 3 meses de vendas
      setRecentSales(salesData.slice(-3));
      
      // Pegar top 3 clientes
      setTopCustomers(customersData.slice(0, 3));
      
      // Pegar itens com estoque crítico
      setCriticalStock(stockData.filter(item => item.status === 'critico' || item.status === 'sem_estoque').slice(0, 5));
      
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500 border-r-2"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Dashboard de Relatórios
            </h1>
            <Link
              to="/reports"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Ver Relatórios Completos
            </Link>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Receita Total (Ano)</p>
                  <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="bg-green-500/20 p-3 rounded-full">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Pedidos</p>
                  <p className="text-2xl font-bold text-blue-400">{stats.totalOrders}</p>
                </div>
                <div className="bg-blue-500/20 p-3 rounded-full">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Clientes Ativos</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.totalCustomers}</p>
                </div>
                <div className="bg-purple-500/20 p-3 rounded-full">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Estoque Baixo</p>
                  <p className="text-2xl font-bold text-red-400">{stats.lowStockItems}</p>
                </div>
                <div className="bg-red-500/20 p-3 rounded-full">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vendas Recentes */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/30">
              <h2 className="text-xl font-semibold text-purple-300 mb-4">Vendas dos Últimos Meses</h2>
              <div className="space-y-3">
                {recentSales.map((month, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{month.month}</p>
                      <p className="text-gray-400 text-sm">{month.totalOrders} pedidos</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">{formatCurrency(month.totalRevenue)}</p>
                      <p className="text-gray-400 text-sm">Ticket: {formatCurrency(month.averageOrderValue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Clientes */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/30">
              <h2 className="text-xl font-semibold text-purple-300 mb-4">Top Clientes</h2>
              <div className="space-y-3">
                {topCustomers.map((customer, index) => (
                  <div key={customer.customerId} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-500/20 w-8 h-8 rounded-full flex items-center justify-center">
                        <span className="text-purple-400 font-semibold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{customer.customerName}</p>
                        <p className="text-gray-400 text-sm">{customer.totalOrders} pedidos</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">{formatCurrency(customer.totalSpent)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alertas de Estoque */}
          {criticalStock.length > 0 && (
            <div className="mt-8 bg-red-900/20 border border-red-800/50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-300 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Alerta: Produtos com Estoque Crítico
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {criticalStock.map((item) => (
                  <div key={item.productId} className="bg-slate-800/50 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-2">{item.productName}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Estoque: {item.currentStock}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'sem_estoque' ? 'bg-red-900/50 text-red-400' : 'bg-orange-900/50 text-orange-400'
                      }`}>
                        {item.status === 'sem_estoque' ? 'Sem Estoque' : 'Crítico'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportsDashboard;
