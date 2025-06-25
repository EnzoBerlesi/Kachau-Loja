import { api } from './api';

export interface SalesReport {
  month: string;
  year: number;
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface CustomerReport {
  customerId: string;
  customerName: string;
  customerEmail: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  averageOrderValue: number;
}

export interface ChannelSalesReport {
  channel: 'ecommerce' | 'vendedor' | 'telefone' | 'presencial';
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  percentage: number;
}

export interface StockReport {
  productId: string;
  productName: string;
  categoryName: string;
  currentStock: number;
  minStock: number;
  status: 'normal' | 'baixo' | 'critico' | 'sem_estoque';
  unitPrice: number;
  totalValue: number;
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  channel?: string;
  customerId?: string;
  categoryId?: string;
  productId?: string;
}

class ReportService {
  // Relatório de vendas mensais
  async getMonthlySalesReport(year: number): Promise<SalesReport[]> {
    try {
      const response = await api.get(`/reports/sales/monthly/${year}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório de vendas mensais:', error);
      // Dados mock para desenvolvimento
      return this.getMockMonthlySalesReport(year);
    }
  }

  // Relatório de clientes que mais compraram
  async getTopCustomersReport(filters: ReportFilters = {}): Promise<CustomerReport[]> {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await api.get(`/reports/customers/top?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório de clientes:', error);
      // Dados mock para desenvolvimento
      return this.getMockCustomersReport();
    }
  }

  // Relatório por canal de vendas
  async getChannelSalesReport(filters: ReportFilters = {}): Promise<ChannelSalesReport[]> {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.channel) params.append('channel', filters.channel);
      
      const response = await api.get(`/reports/sales/channels?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório por canal:', error);
      // Dados mock para desenvolvimento
      return this.getMockChannelSalesReport();
    }
  }

  // Relatório de estoque
  async getStockReport(filters: ReportFilters = {}): Promise<StockReport[]> {
    try {
      const params = new URLSearchParams();
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      
      const response = await api.get(`/reports/stock?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório de estoque:', error);
      // Dados mock para desenvolvimento
      return this.getMockStockReport();
    }
  }

  // Exportar relatório de clientes para CSV
  async exportCustomersReport(filters: ReportFilters = {}): Promise<void> {
    try {
      const customers = await this.getTopCustomersReport(filters);
      this.downloadCSV(customers, 'relatorio-clientes.csv', [
        { key: 'customerName', label: 'Nome do Cliente' },
        { key: 'customerEmail', label: 'Email' },
        { key: 'totalOrders', label: 'Total de Pedidos' },
        { key: 'totalSpent', label: 'Total Gasto (R$)' },
        { key: 'averageOrderValue', label: 'Ticket Médio (R$)' },
        { key: 'lastOrderDate', label: 'Última Compra' }
      ]);
    } catch (error) {
      console.error('Erro ao exportar relatório de clientes:', error);
      throw error;
    }
  }

  // Exportar relatório de vendas mensais para CSV
  async exportMonthlySalesReport(year: number): Promise<void> {
    try {
      const sales = await this.getMonthlySalesReport(year);
      this.downloadCSV(sales, `relatorio-vendas-mensais-${year}.csv`, [
        { key: 'month', label: 'Mês' },
        { key: 'year', label: 'Ano' },
        { key: 'totalOrders', label: 'Total de Pedidos' },
        { key: 'totalSales', label: 'Total de Itens Vendidos' },
        { key: 'totalRevenue', label: 'Receita Total (R$)' },
        { key: 'averageOrderValue', label: 'Ticket Médio (R$)' }
      ]);
    } catch (error) {
      console.error('Erro ao exportar relatório de vendas:', error);
      throw error;
    }
  }

  // Exportar relatório de estoque para CSV
  async exportStockReport(filters: ReportFilters = {}): Promise<void> {
    try {
      const stock = await this.getStockReport(filters);
      this.downloadCSV(stock, 'relatorio-estoque.csv', [
        { key: 'productName', label: 'Produto' },
        { key: 'categoryName', label: 'Categoria' },
        { key: 'currentStock', label: 'Estoque Atual' },
        { key: 'minStock', label: 'Estoque Mínimo' },
        { key: 'status', label: 'Status' },
        { key: 'unitPrice', label: 'Preço Unitário (R$)' },
        { key: 'totalValue', label: 'Valor Total (R$)' }
      ]);
    } catch (error) {
      console.error('Erro ao exportar relatório de estoque:', error);
      throw error;
    }
  }

  // Função utilitária para download de CSV
  private downloadCSV<T>(data: T[], filename: string, columns: { key: keyof T; label: string }[]): void {
    const headers = columns.map(col => col.label).join(',');
    const rows = data.map(item => 
      columns.map(col => {
        const value = item[col.key];
        if (typeof value === 'number') {
          return `"${value.toFixed(2)}"`;
        }
        return `"${value || ''}"`;
      }).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  // Dados mock para desenvolvimento
  private getMockMonthlySalesReport(year: number): SalesReport[] {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    return months.map((month) => ({
      month,
      year,
      totalSales: Math.floor(Math.random() * 500) + 100,
      totalRevenue: Math.floor(Math.random() * 50000) + 10000,
      totalOrders: Math.floor(Math.random() * 200) + 50,
      averageOrderValue: Math.floor(Math.random() * 300) + 100
    }));
  }

  private getMockCustomersReport(): CustomerReport[] {
    return [
      {
        customerId: '1',
        customerName: 'João Silva',
        customerEmail: 'joao@email.com',
        totalOrders: 15,
        totalSpent: 4500.00,
        lastOrderDate: '2024-12-20',
        averageOrderValue: 300.00
      },
      {
        customerId: '2',
        customerName: 'Maria Santos',
        customerEmail: 'maria@email.com',
        totalOrders: 12,
        totalSpent: 3600.00,
        lastOrderDate: '2024-12-18',
        averageOrderValue: 300.00
      },
      {
        customerId: '3',
        customerName: 'Pedro Costa',
        customerEmail: 'pedro@email.com',
        totalOrders: 10,
        totalSpent: 2800.00,
        lastOrderDate: '2024-12-15',
        averageOrderValue: 280.00
      }
    ];
  }

  private getMockChannelSalesReport(): ChannelSalesReport[] {
    return [
      { channel: 'ecommerce', totalSales: 450, totalRevenue: 125000, totalOrders: 200, percentage: 60 },
      { channel: 'vendedor', totalSales: 180, totalRevenue: 54000, totalOrders: 80, percentage: 25 },
      { channel: 'telefone', totalSales: 90, totalRevenue: 27000, totalOrders: 40, percentage: 10 },
      { channel: 'presencial', totalSales: 45, totalRevenue: 13500, totalOrders: 20, percentage: 5 }
    ];
  }

  private getMockStockReport(): StockReport[] {
    return [
      {
        productId: '1',
        productName: 'Mouse Gamer HyperX',
        categoryName: 'Periféricos',
        currentStock: 15,
        minStock: 10,
        status: 'normal',
        unitPrice: 150.00,
        totalValue: 2250.00
      },
      {
        productId: '2',
        productName: 'Teclado Mecânico',
        categoryName: 'Periféricos',
        currentStock: 5,
        minStock: 8,
        status: 'baixo',
        unitPrice: 200.00,
        totalValue: 1000.00
      },
      {
        productId: '3',
        productName: 'Notebook Gamer',
        categoryName: 'Notebooks',
        currentStock: 2,
        minStock: 5,
        status: 'critico',
        unitPrice: 3500.00,
        totalValue: 7000.00
      },
      {
        productId: '4',
        productName: 'Monitor 4K',
        categoryName: 'Periféricos',
        currentStock: 0,
        minStock: 3,
        status: 'sem_estoque',
        unitPrice: 800.00,
        totalValue: 0.00
      }
    ];
  }
}

export const reportService = new ReportService();
