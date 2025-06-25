import type { Cliente, ProdutoVenda, Venda, VendaFormData } from '../types/vendas';
import { userService, type User } from './userService';
import api from './api';

// Types for backend API
interface CreateOrderItemDto {
  productId: string;
  quantity: number;
}

interface CreateOrderDto {
  items: CreateOrderItemDto[];
}

interface CreateAdminOrderDto {
  customerId: string;
  items: CreateOrderItemDto[];
}

// Função para converter usuários CUSTOMER em clientes
const convertUserToCliente = (user: User): Cliente => {
  return {
    id: user.id,
    nome: user.name,
    email: user.email,
    telefone: '', // Será vazio por não ter no User
    cpf: '', // Será vazio por não ter no User
    endereco: {
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    },
    dataCadastro: new Date(user.createdAt),
    ativo: true
  };
};

// Simulação de dados para desenvolvimento
const mockClientes: Cliente[] = [
 
];

const mockProdutos: ProdutoVenda[] = [
  {
    id: '1',
    nome: 'Mouse Gamer RGB',
    descricao: 'Mouse gamer com iluminação RGB',
    preco: 89.90,
    categoria: 'Periféricos',
    estoque: 50,
    codigoBarras: '7891234567890',
    marca: 'Redragon',
    dataCadastro: new Date('2024-01-10'),
    ativo: true
  }
];

const mockVendas: Venda[] = [];

// Service para Clientes
export const clienteService = {
  async getAll(): Promise<Cliente[]> {
    try {
      // Buscar usuários com role CUSTOMER do backend
      const users = await userService.getUsersByRole('CUSTOMER');
      const clientesFromUsers = users.map(convertUserToCliente);
      
      // Combinar com clientes mock (para desenvolvimento)
      const allClientes = [...mockClientes.filter(c => c.ativo), ...clientesFromUsers];
      
      // Remover duplicatas baseado no email
      const uniqueClientes = allClientes.filter((cliente, index, self) => 
        index === self.findIndex(c => c.email === cliente.email)
      );
      
      return uniqueClientes;
    } catch (error) {
      console.error('Erro ao buscar usuários CUSTOMER:', error);
      // Fallback para clientes mock em caso de erro
      return mockClientes.filter(c => c.ativo);
    }
  },

  async getById(id: string): Promise<Cliente | null> {
    return mockClientes.find(c => c.id === id) || null;
  },

  async create(cliente: Omit<Cliente, 'id' | 'dataCadastro'>): Promise<Cliente> {
    const novoCliente: Cliente = {
      ...cliente,
      id: Date.now().toString(),
      dataCadastro: new Date(),
    };
    mockClientes.push(novoCliente);
    return novoCliente;
  },

  async update(id: string, dados: Partial<Cliente>): Promise<Cliente | null> {
    const index = mockClientes.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    mockClientes[index] = { ...mockClientes[index], ...dados };
    return mockClientes[index];
  },

  async delete(id: string): Promise<boolean> {
    const index = mockClientes.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    mockClientes[index].ativo = false;
    return true;
  },

  async search(termo: string): Promise<Cliente[]> {
    return mockClientes.filter(c => 
      c.ativo && (
        c.nome.toLowerCase().includes(termo.toLowerCase()) ||
        c.email.toLowerCase().includes(termo.toLowerCase()) ||
        c.cpf.includes(termo)
      )
    );
  },

  // Método específico para buscar usuários CUSTOMER como clientes
  async getCustomersAsClientes(): Promise<Cliente[]> {
    try {
      const users = await userService.getUsersByRole('CUSTOMER');
      return users.map(convertUserToCliente);
    } catch (error) {
      console.error('Erro ao buscar usuários CUSTOMER:', error);
      return [];
    }
  }
};

// Service para Produtos
export const produtoVendaService = {
  async getAll(): Promise<ProdutoVenda[]> {
    return mockProdutos.filter(p => p.ativo);
  },

  async getById(id: string): Promise<ProdutoVenda | null> {
    return mockProdutos.find(p => p.id === id) || null;
  },

  async create(produto: Omit<ProdutoVenda, 'id' | 'dataCadastro'>): Promise<ProdutoVenda> {
    const novoProduto: ProdutoVenda = {
      ...produto,
      id: Date.now().toString(),
      dataCadastro: new Date(),
    };
    mockProdutos.push(novoProduto);
    return novoProduto;
  },

  async update(id: string, dados: Partial<ProdutoVenda>): Promise<ProdutoVenda | null> {
    const index = mockProdutos.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    mockProdutos[index] = { ...mockProdutos[index], ...dados };
    return mockProdutos[index];
  },

  async delete(id: string): Promise<boolean> {
    const index = mockProdutos.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    mockProdutos[index].ativo = false;
    return true;
  },

  async search(termo: string): Promise<ProdutoVenda[]> {
    return mockProdutos.filter(p => 
      p.ativo && (
        p.nome.toLowerCase().includes(termo.toLowerCase()) ||
        p.categoria.toLowerCase().includes(termo.toLowerCase()) ||
        p.codigoBarras?.includes(termo)
      )
    );
  },

  async updateEstoque(id: string, quantidade: number): Promise<boolean> {
    const produto = mockProdutos.find(p => p.id === id);
    if (!produto) return false;
    
    produto.estoque = quantidade;
    return true;
  }
};

// Service para Vendas
export const vendaService = {
  async getAll(): Promise<Venda[]> {
    try {
      // Buscar pedidos do backend - apenas admins podem ver todos os pedidos
      const response = await api.get('/orders');
      const orders = response.data;
      
      // Se não há pedidos, retornar array vazio
      if (!orders || !Array.isArray(orders)) {
        return [];
      }
      
      // Converter orders do backend para o formato Venda do frontend
      const vendas: Venda[] = orders.map((order: any) => ({
        id: order.id,
        numeroVenda: `V${order.id.slice(-8)}`, // Usar parte do ID como número
        clienteId: order.userId,
        cliente: {
          id: order.user.id,
          nome: order.user.name,
          email: order.user.email,
          telefone: '', // Não disponível no backend atual
          cpf: '', // Não disponível no backend atual
          endereco: {
            rua: '',
            numero: '',
            bairro: '',
            cidade: '',
            estado: '',
            cep: ''
          },
          dataCadastro: new Date(order.user.createdAt),
          ativo: true
        },
        itens: order.items.map((item: any) => ({
          produtoId: item.productId,
          produto: {
            id: item.product.id,
            nome: item.product.name,
            descricao: item.product.description,
            preco: item.product.price,
            categoria: item.product.category?.name || 'Sem categoria',
            estoque: item.product.stock,
            dataCadastro: new Date(item.product.createdAt),
            ativo: true
          },
          quantidade: item.quantity,
          precoUnitario: item.price,
          subtotal: item.price * item.quantity
        })),
        subtotal: order.total,
        desconto: 0, // Não implementado no backend
        total: order.total,
        formaPagamento: 'dinheiro' as const, // Padrão, não implementado no backend
        status: mapOrderStatusToVendaStatus(order.status),
        localVenda: 'vendedor' as const, // Padrão
        dataVenda: new Date(order.createdAt),
        vendedorId: 'admin', // Padrão para vendas feitas por admin
        observacoes: undefined
      }));
      
      return vendas;
    } catch (error: any) {
      console.error('Erro ao buscar vendas do backend:', error);
      
      // Se o erro for de autenticação, mostrar mensagem específica
      if (error.response?.status === 401) {
        console.warn('Usuário não autenticado para buscar vendas');
        return [];
      }
      
      // Se o erro for de permissão, mostrar mensagem específica
      if (error.response?.status === 403) {
        console.warn('Usuário sem permissão para buscar todas as vendas');
        return [];
      }
      
      // Para outros erros, usar fallback
      console.warn('Usando dados mock como fallback');
      return mockVendas;
    }
  },

  async getById(id: string): Promise<Venda | null> {
    return mockVendas.find(v => v.id === id) || null;
  },

  // Novo método para criar pedido no backend
  async createOrder(customerId: string, orderData: CreateOrderDto): Promise<any> {
    try {
      // Usar o endpoint admin para criar pedidos em nome de clientes
      const adminOrderData: CreateAdminOrderDto = {
        customerId: customerId,
        items: orderData.items
      };
      
      const response = await api.post('/orders/admin', adminOrderData);
      return response.data;
    } catch (error: any) {
      console.error('Erro detalhado:', error.response?.data);
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.status === 401) {
        throw new Error('É necessário estar logado como administrador para criar vendas');
      }
      if (error.response?.status === 403) {
        throw new Error('Sem permissão para criar pedidos. Verifique se você é um administrador.');
      }
      throw new Error('Erro ao criar pedido no sistema');
    }
  },

  async create(vendaData: VendaFormData): Promise<Venda> {
    const cliente = await clienteService.getById(vendaData.clienteId);
    if (!cliente) throw new Error('Cliente não encontrado');

    const itens = [];
    let subtotal = 0;

    for (const item of vendaData.itens) {
      const produto = await produtoVendaService.getById(item.produtoId);
      if (!produto) throw new Error(`Produto ${item.produtoId} não encontrado`);
      
      if (produto.estoque < item.quantidade) {
        throw new Error(`Estoque insuficiente para ${produto.nome}`);
      }

      const itemSubtotal = (item.precoUnitario * item.quantidade) - (item.desconto || 0);
      
      itens.push({
        produtoId: item.produtoId,
        produto,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        desconto: item.desconto || 0,
        subtotal: itemSubtotal
      });

      subtotal += itemSubtotal;
      
      // Atualizar estoque
      await produtoVendaService.updateEstoque(produto.id, produto.estoque - item.quantidade);
    }

    const total = subtotal - (vendaData.desconto || 0);

    const novaVenda: Venda = {
      id: Date.now().toString(),
      numeroVenda: `V${Date.now()}`,
      clienteId: vendaData.clienteId,
      cliente,
      itens,
      subtotal,
      desconto: vendaData.desconto || 0,
      total,
      formaPagamento: vendaData.formaPagamento,
      parcelas: vendaData.parcelas,
      status: 'pendente',
      localVenda: vendaData.localVenda,
      dataVenda: new Date(),
      vendedorId: vendaData.vendedorId || 'loja-fisica',
      observacoes: vendaData.observacoes
    };

    mockVendas.push(novaVenda);
    return novaVenda;
  },

  async updateStatus(id: string, status: Venda['status']): Promise<Venda | null> {
    const venda = mockVendas.find(v => v.id === id);
    if (!venda) return null;
    
    venda.status = status;
    return venda;
  },

  async getByDateRange(inicio: Date, fim: Date): Promise<Venda[]> {
    return mockVendas.filter(v => 
      v.dataVenda >= inicio && v.dataVenda <= fim
    );
  },

  async getTotalVendasPeriodo(inicio: Date, fim: Date): Promise<number> {
    const vendas = await this.getByDateRange(inicio, fim);
    return vendas
      .filter(v => v.status === 'pago')
      .reduce((total, venda) => total + venda.total, 0);
  }
};

// Função para mapear status do backend para frontend
const mapOrderStatusToVendaStatus = (backendStatus: string): 'pendente' | 'pago' | 'cancelado' | 'devolvido' => {
  switch (backendStatus) {
    case 'PENDING':
      return 'pendente';
    case 'PAID':
      return 'pago';
    case 'SHIPPED':
      return 'pago'; // Consideramos shipped como pago
    case 'DELIVERED':
      return 'pago'; // Consideramos delivered como pago
    default:
      return 'pendente';
  }
};

// EXEMPLO DE USO - Como buscar todos os usuários CUSTOMER como clientes:
/*
Para buscar apenas usuários com role CUSTOMER:
const clientesCustomers = await clienteService.getCustomersAsClientes();
console.log('Usuários CUSTOMER como clientes:', clientesCustomers);

// Para buscar todos os clientes (mock + CUSTOMER users):
const todosClientes = await clienteService.getAll();
console.log('Todos os clientes:', todosClientes);

// Exemplo de uso em um componente React:
const [clientes, setClientes] = useState<Cliente[]>([]);

useEffect(() => {
  const loadCustomers = async () => {
    try {
      const customers = await clienteService.getCustomersAsClientes();
      setClientes(customers);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };
  
  loadCustomers();
}, []);
*/
