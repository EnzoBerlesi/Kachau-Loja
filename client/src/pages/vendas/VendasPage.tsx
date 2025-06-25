import { useState, useEffect } from 'react';
import { 
  ClienteSelector, 
  ClienteModal, 
  VendedorSelector, 
  ProdutoSelector, 
  ItensVendaList, 
  VendaResumo,
  type ItemVenda
} from '../../components/vendas';
import { clienteService, vendaService } from '../../services/vendaService';
import { productService, type Product } from '../../services/productService';
import { userService, type User as UserType } from '../../services/userService';
import type { Cliente, VendaFormData } from '../../types/vendas';

const VendasPage = () => {
  // Estados principais
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [usuarios, setUsuarios] = useState<UserType[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<UserType | null>(null);
  const [itensVenda, setItensVenda] = useState<ItemVenda[]>([]);
  
  // Estados dos modais
  const [showClienteModal, setShowClienteModal] = useState(false);
  
  // Estados do formulário de venda
  const [localVenda, setLocalVenda] = useState<VendaFormData['localVenda']>('vendedor');
  const [formaPagamento, setFormaPagamento] = useState<VendaFormData['formaPagamento']>('dinheiro');
  const [parcelas, setParcelas] = useState(1);
  const [desconto, setDesconto] = useState(0);
  
  // Estados de loading
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [clientesData, produtosData, usuariosData] = await Promise.all([
          clienteService.getAll(),
          productService.getAllProducts(),
          userService.getAllUsers()
        ]);
        setClientes(clientesData);
        setProdutos(produtosData);
        setUsuarios(usuariosData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setMessage({ type: 'error', text: 'Erro ao carregar dados iniciais' });
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  // Limpar mensagem após 5 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Funções para gerenciar itens da venda
  const adicionarProduto = (produto: Product) => {
    const itemExistente = itensVenda.find(item => item.produto.id === produto.id);
    
    if (itemExistente) {
      atualizarQuantidade(itemExistente.id, itemExistente.quantidade + 1);
    } else {
      const novoItem: ItemVenda = {
        id: `${produto.id}-${Date.now()}`,
        produto,
        quantidade: 1,
        precoUnitario: produto.price,
        subtotal: produto.price
      };
      setItensVenda(prev => [...prev, novoItem]);
    }
  };

  const atualizarQuantidade = (itemId: string, novaQuantidade: number) => {
    setItensVenda(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantidade: novaQuantidade, subtotal: item.precoUnitario * novaQuantidade }
        : item
    ));
  };

  const removerItem = (itemId: string) => {
    setItensVenda(prev => prev.filter(item => item.id !== itemId));
  };

  // Função para finalizar a venda
  const finalizarVenda = async () => {
    if (!clienteSelecionado || itensVenda.length === 0) {
      setMessage({ type: 'error', text: 'Cliente e produtos são obrigatórios' });
      return;
    }

    try {
      setLoading(true);

      // Preparar dados para o backend (orders endpoint)
      const orderData = {
        items: itensVenda.map(item => ({
          productId: item.produto.id,
          quantity: item.quantidade
        }))
      };

      // Criar pedido através do serviço
      await vendaService.createOrder(clienteSelecionado.id, orderData);
      
      // Limpar formulário
      setClienteSelecionado(null);
      setUsuarioSelecionado(null);
      setItensVenda([]);
      setLocalVenda('vendedor');
      
      setMessage({ type: 'success', text: 'Venda finalizada com sucesso!' });
    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao finalizar venda';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Função para adicionar cliente
  const handleAdicionarCliente = async (novoCliente: Omit<Cliente, 'id' | 'dataCadastro' | 'ativo'>) => {
    try {
      const cliente = await clienteService.create({
        ...novoCliente,
        ativo: true
      });
      setClientes(prev => [...prev, cliente]);
      setClienteSelecionado(cliente);
      setShowClienteModal(false);
      setMessage({ type: 'success', text: 'Cliente adicionado com sucesso!' });
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      setMessage({ type: 'error', text: 'Erro ao adicionar cliente' });
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <div className="text-white text-lg">Carregando dados...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">💼 Nova Venda</h1>
          <p className="text-gray-400">Crie uma nova venda selecionando cliente e produtos</p>
        </div>

        {/* Mensagem */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Coluna Esquerda */}
          <div className="space-y-6">
            {/* Seleção de Cliente */}
            <ClienteSelector
              clientes={clientes}
              clienteSelecionado={clienteSelecionado}
              onClienteSelect={setClienteSelecionado}
              onNovoCliente={() => setShowClienteModal(true)}
            />

            {/* Configurações da Venda */}
            <VendedorSelector
              localVenda={localVenda}
              setLocalVenda={setLocalVenda}
              usuarios={usuarios}
              usuarioSelecionado={usuarioSelecionado}
              setUsuarioSelecionado={setUsuarioSelecionado}
            />

            {/* Seleção de Produtos */}
            <ProdutoSelector
              produtos={produtos}
              onAddProduto={adicionarProduto}
              loading={loadingData}
            />
          </div>

          {/* Coluna Direita */}
          <div className="space-y-6">
            {/* Lista de Itens */}
            <ItensVendaList
              itens={itensVenda}
              onUpdateQuantidade={atualizarQuantidade}
              onRemoverItem={removerItem}
            />

            {/* Resumo e Finalização */}
            <VendaResumo
              cliente={clienteSelecionado}
              localVenda={localVenda}
              vendedor={usuarioSelecionado}
              itens={itensVenda}
              formaPagamento={formaPagamento}
              setFormaPagamento={setFormaPagamento}
              parcelas={parcelas}
              setParcelas={setParcelas}
              desconto={desconto}
              setDesconto={setDesconto}
              onFinalizarVenda={finalizarVenda}
              loading={loading}
            />
          </div>
        </div>

        {/* Modal de Cliente */}
        <ClienteModal
          isOpen={showClienteModal}
          onClose={() => setShowClienteModal(false)}
          onSave={handleAdicionarCliente}
        />
      </div>
    </div>
  );
};

export default VendasPage;
