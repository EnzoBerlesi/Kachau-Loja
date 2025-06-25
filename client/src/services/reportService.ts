import { api } from './api';
import { orderService } from './orderService';

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
  channel: 'ecommerce' | 'vendedor' | 'Marketplace' | 'presencial';
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

export interface MonthlySaleDetail {
  orderId: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  totalAmount: number;
  itemsCount: number;
  channel: 'ecommerce' | 'vendedor' | 'Marketplace' | 'presencial';
  status: 'pendente' | 'processando' | 'enviado' | 'entregue' | 'cancelado';
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
      // Para 2025, usar dados reais da API
      if (year === 2025) {
        return await this.getRealMonthlySalesReport(year);
      }
      
      const response = await api.get(`/reports/sales/monthly/${year}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar relatório de vendas mensais:', error);
      // Dados mock para desenvolvimento
      return this.getMockMonthlySalesReport(year);
    }
  }

  // Relatório de vendas mensais usando dados reais da API (2025)
  async getRealMonthlySalesReport(year: number): Promise<SalesReport[]> {
    try {
      const orders = await orderService.getAllOrders();
      
      // Filtrar pedidos do ano especificado e que não sejam cancelados
      const yearOrders = orders.filter(order => {
        const orderYear = new Date(order.createdAt).getFullYear();
        return orderYear === year && order.status !== 'CANCELLED';
      });

      // Agrupar por mês
      const monthlyData: { [key: string]: SalesReport } = {};
      const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];

      // Para 2025, mostrar apenas meses até junho (mês atual)
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth(); // 0-based (junho = 5)
      
      const monthsToShow = year === currentYear && year === 2025 
        ? months.slice(0, currentMonth + 1) 
        : months;

      // Inicializar todos os meses
      monthsToShow.forEach((month) => {
        monthlyData[month] = {
          month,
          year,
          totalSales: 0,
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0
        };
      });

      // Processar pedidos
      yearOrders.forEach(order => {
        const monthIndex = new Date(order.createdAt).getMonth();
        const monthName = months[monthIndex];
        
        // Só processar se o mês estiver na lista de meses a mostrar
        if (monthlyData[monthName]) {
          const monthData = monthlyData[monthName];

          monthData.totalOrders += 1;
          monthData.totalRevenue += order.total;
          
          // Contar itens se disponível
          if (order.items && order.items.length > 0) {
            monthData.totalSales += order.items.reduce((sum, item) => sum + item.quantity, 0);
          } else {
            monthData.totalSales += 1; // Assumir 1 item se não tiver detalhes
          }
        }
      });

      // Calcular ticket médio
      Object.values(monthlyData).forEach(monthData => {
        monthData.averageOrderValue = monthData.totalOrders > 0 
          ? monthData.totalRevenue / monthData.totalOrders 
          : 0;
      });

      return Object.values(monthlyData);
    } catch (error) {
      console.error('Erro ao processar dados reais de vendas:', error);
      return this.getMockMonthlySalesReport(year);
    }
  }

  // Relatório de clientes que mais compraram
  async getTopCustomersReport(filters: ReportFilters = {}): Promise<CustomerReport[]> {
    try {
      // Se não tiver filtros de data, tentar usar dados reais de 2025
      if (!filters.startDate && !filters.endDate) {
        const realData = await this.getRealTopCustomersReport(filters);
        if (realData.length > 0) {
          return realData;
        }
      }
      
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

  // Relatório de clientes usando dados reais da API
  async getRealTopCustomersReport(filters: ReportFilters = {}): Promise<CustomerReport[]> {
    try {
      const orders = await orderService.getAllOrders();
      
      // Filtrar pedidos por data se especificado
      let filteredOrders = orders.filter(order => order.status !== 'CANCELLED');
      
      if (filters.startDate) {
        filteredOrders = filteredOrders.filter(order => 
          new Date(order.createdAt) >= new Date(filters.startDate!)
        );
      }
      
      if (filters.endDate) {
        filteredOrders = filteredOrders.filter(order => 
          new Date(order.createdAt) <= new Date(filters.endDate!)
        );
      }

      // Agrupar por cliente
      const customerData: { [key: string]: CustomerReport } = {};

      filteredOrders.forEach(order => {
        if (!order.user) return;

        const customerId = order.user.id;
        if (!customerData[customerId]) {
          customerData[customerId] = {
            customerId,
            customerName: order.user.name,
            customerEmail: order.user.email,
            totalOrders: 0,
            totalSpent: 0,
            lastOrderDate: order.createdAt,
            averageOrderValue: 0
          };
        }

        const customer = customerData[customerId];
        customer.totalOrders += 1;
        customer.totalSpent += order.total;

        // Atualizar última data de compra se for mais recente
        if (new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
          customer.lastOrderDate = order.createdAt;
        }
      });

      // Calcular ticket médio e ordenar por total gasto
      const customers = Object.values(customerData)
        .map(customer => ({
          ...customer,
          averageOrderValue: customer.totalOrders > 0 ? customer.totalSpent / customer.totalOrders : 0
        }))
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 20); // Top 20 clientes

      return customers;
    } catch (error) {
      console.error('Erro ao processar dados reais de clientes:', error);
      return [];
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

  // Relatório de vendas detalhadas por mês
  async getMonthlySalesDetails(year: number, month: string): Promise<MonthlySaleDetail[]> {
    try {
      // Para 2025, usar dados reais da API
      if (year === 2025) {
        return await this.getRealMonthlySalesDetails(year, month);
      }
      
      const response = await api.get(`/reports/sales/monthly/${year}/${encodeURIComponent(month)}/details`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar vendas detalhadas do mês:', error);
      // Dados mock para desenvolvimento
      return this.getMockMonthlySalesDetails(month);
    }
  }

  // Relatório de vendas detalhadas usando dados reais da API (2025)
  async getRealMonthlySalesDetails(year: number, month: string): Promise<MonthlySaleDetail[]> {
    try {
      console.log(`Buscando vendas detalhadas para ${month}/${year}`);
      const orders = await orderService.getAllOrders();
      console.log(`Total de pedidos encontrados: ${orders.length}`);
      
      // Mapear nomes dos meses para números
      const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];
      const monthNumber = monthNames.indexOf(month);
      
      if (monthNumber === -1) {
        console.error('Mês inválido:', month);
        throw new Error('Mês inválido');
      }

      console.log(`Filtrando pedidos para mês ${monthNumber + 1} (${month}) de ${year}`);

      // Filtrar pedidos do ano e mês especificados
      const monthOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const isCorrectYear = orderDate.getFullYear() === year;
        const isCorrectMonth = orderDate.getMonth() === monthNumber;
        const isNotCancelled = order.status !== 'CANCELLED';
        
        return isCorrectYear && isCorrectMonth && isNotCancelled;
      });

      console.log(`Pedidos filtrados para ${month}/${year}: ${monthOrders.length}`);

      // Converter para o formato MonthlySaleDetail
      const salesDetails: MonthlySaleDetail[] = monthOrders.map(order => {
        // Mapear status da API para o formato do relatório
        const statusMap: { [key: string]: MonthlySaleDetail['status'] } = {
          'PENDING': 'pendente',
          'PROCESSING': 'processando',
          'SHIPPED': 'enviado',
          'DELIVERED': 'entregue',
          'CANCELLED': 'cancelado'
        };

        // Determinar canal (por padrão ecommerce, pode ser expandido futuramente)
        const channel: MonthlySaleDetail['channel'] = 'ecommerce';

        return {
          orderId: order.id,
          customerName: order.user?.name || 'Cliente não informado',
          customerEmail: order.user?.email || 'Email não informado',
          orderDate: order.createdAt,
          totalAmount: order.total,
          itemsCount: order.items?.reduce((sum, item) => sum + item.quantity, 0) || 1,
          channel,
          status: statusMap[order.status] || 'pendente'
        };
      });

      console.log(`Detalhes de vendas processados: ${salesDetails.length}`);
      return salesDetails;
    } catch (error) {
      console.error('Erro ao processar vendas detalhadas reais:', error);
      return this.getMockMonthlySalesDetails(month);
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

    // Para 2025, mostrar apenas meses até junho (mês atual)
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-based (junho = 5)
    
    const monthsToShow = year === currentYear && year === 2025 
      ? months.slice(0, currentMonth + 1) 
      : months;

    return monthsToShow.map((month) => ({
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
      { channel: 'Marketplace', totalSales: 90, totalRevenue: 27000, totalOrders: 40, percentage: 10 },
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

  private getMockMonthlySalesDetails(month: string): MonthlySaleDetail[] {
    const monthNumber = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ].indexOf(month) + 1;
    
    const year = 2024;
    const baseDate = `${year}-${monthNumber.toString().padStart(2, '0')}`;
    
    return [
      {
        orderId: `${monthNumber}001`,
        customerName: 'João Silva',
        customerEmail: 'joao@email.com',
        orderDate: `${baseDate}-01`,
        totalAmount: 1200.00,
        itemsCount: 3,
        channel: 'ecommerce' as const,
        status: 'entregue' as const
      },
      {
        orderId: `${monthNumber}002`,
        customerName: 'Maria Santos',
        customerEmail: 'maria@email.com',
        orderDate: `${baseDate}-05`,
        totalAmount: 800.00,
        itemsCount: 2,
        channel: 'vendedor' as const,
        status: 'enviado' as const
      },
      {
        orderId: `${monthNumber}003`,
        customerName: 'Pedro Costa',
        customerEmail: 'pedro@email.com',
        orderDate: `${baseDate}-10`,
        totalAmount: 1500.00,
        itemsCount: 1,
        channel: 'Marketplace' as const,
        status: 'processando' as const
      },
      {
        orderId: `${monthNumber}004`,
        customerName: 'Ana Oliveira',
        customerEmail: 'ana@email.com',
        orderDate: `${baseDate}-15`,
        totalAmount: 950.00,
        itemsCount: 4,
        channel: 'presencial' as const,
        status: 'entregue' as const
      },
      {
        orderId: `${monthNumber}005`,
        customerName: 'Carlos Mendes',
        customerEmail: 'carlos@email.com',
        orderDate: `${baseDate}-20`,
        totalAmount: 2100.00,
        itemsCount: 2,
        channel: 'ecommerce' as const,
        status: 'enviado' as const
      }
    ];
  }
}

export const reportService = new ReportService();
