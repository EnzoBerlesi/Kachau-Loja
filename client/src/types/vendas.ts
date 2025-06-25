// Tipos para o sistema de vendas
export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  dataCadastro: Date;
  ativo: boolean;
}

export interface ProdutoVenda {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  estoque: number;
  codigoBarras?: string;
  marca?: string;
  fornecedor?: string;
  dataCadastro: Date;
  ativo: boolean;
  imagem?: string;
}

export interface ItemVenda {
  produtoId: string;
  produto: ProdutoVenda;
  quantidade: number;
  precoUnitario: number;
  desconto?: number;
  subtotal: number;
}

export interface Venda {
  id: string;
  numeroVenda: string;
  clienteId: string;
  cliente: Cliente;
  itens: ItemVenda[];
  subtotal: number;
  desconto: number;
  total: number;
  formaPagamento: 'dinheiro' | 'cartao-credito' | 'cartao-debito' | 'pix' | 'parcelado';
  parcelas?: number;
  status: 'pendente' | 'pago' | 'cancelado' | 'devolvido';
  localVenda: 'vendedor' | 'loja-fisica';
  dataVenda: Date;
  vendedorId: string;
  observacoes?: string;
}

export interface VendaFormData {
  clienteId: string;
  vendedorId?: string;
  itens: {
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
    desconto?: number;
  }[];
  desconto?: number;
  formaPagamento: Venda['formaPagamento'];
  localVenda: Venda['localVenda'];
  parcelas?: number;
  observacoes?: string;
}

export interface FiltrosVenda {
  dataInicio?: Date;
  dataFim?: Date;
  clienteId?: string;
  status?: Venda['status'];
  formaPagamento?: Venda['formaPagamento'];
  localVenda?: Venda['localVenda'];
}
