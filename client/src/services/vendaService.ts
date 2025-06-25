import type { Cliente, ProdutoVenda, Venda, VendaFormData } from '../types/vendas';

// Simulação de dados para desenvolvimento
const mockClientes: Cliente[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    endereco: {
      rua: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567'
    },
    dataCadastro: new Date('2024-01-15'),
    ativo: true
  }
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
    return mockClientes.filter(c => c.ativo);
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
    return mockVendas;
  },

  async getById(id: string): Promise<Venda | null> {
    return mockVendas.find(v => v.id === id) || null;
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
