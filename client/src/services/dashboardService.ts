import api from './api';

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalUsers: number;
  recentOrders: number;
  totalRevenue: number;
  salesThisMonth: number;
  salesThisWeek: number;
}

export const dashboardService = {
  // GET /admin/stats - Estatísticas do dashboard (assumindo que existe)
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/admin/stats');
      return response.data;    } catch {
      // Se a rota não existir, retorna dados mock
      return {
        totalProducts: 0,
        totalCategories: 0,
        totalOrders: 0,
        totalUsers: 0,
        recentOrders: 0,
        totalRevenue: 0,
        salesThisMonth: 0,
        salesThisWeek: 0
      };
    }
  },
};
