import api from '../services/api/api';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    description: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  createdAt: string;
  items?: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateOrderData {
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface UpdateOrderStatusData {
  status: Order['status'];
}

export const orderService = {
  // POST /orders - Criar pedido com itens (CUSTOMER)
  async createOrder(data: CreateOrderData): Promise<Order> {
    const response = await api.post('/orders', data);
    return response.data;
  },

  // GET /orders/my - Listar pedidos do usuário logado (CUSTOMER)
  async getMyOrders(): Promise<Order[]> {
    const response = await api.get('/orders/my');
    return response.data;
  },

  // GET /orders - Listar todos pedidos (ADMIN)
  async getAllOrders(): Promise<Order[]> {
    const response = await api.get('/orders');
    return response.data;
  },

  // GET /orders/:id - Detalhes de pedido (CUSTOMER/ADMIN)
  async getOrderById(id: string): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // PUT /orders/:id/status - Atualizar status do pedido (ADMIN)
  async updateOrderStatus(id: string, data: UpdateOrderStatusData): Promise<Order> {
    const response = await api.put(`/orders/${id}/status`, data);
    return response.data;
  },
};
