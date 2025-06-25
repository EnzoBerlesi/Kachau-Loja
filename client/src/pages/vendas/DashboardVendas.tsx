import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Package, 
  DollarSign,
  ShoppingCart,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { vendaService, produtoVendaService } from '../../services/vendaService';
import type { Venda, ProdutoVenda } from '../../types/vendas';

const DashboardVendas = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [produtos, setProdutos] = useState<ProdutoVenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('30'); // dias

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [vendasData, produtosData] = await Promise.all([
        vendaService.getAll(),
        produtoVendaService.getAll()
      ]);
      
      setVendas(vendasData);
      setProdutos(produtosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar vendas por período
  const getVendasPorPeriodo = () => {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - parseInt(periodo));
    
    return vendas.filter(venda => venda.dataVenda >= dataLimite);
  };

  const vendasPeriodo = getVendasPorPeriodo();

  // Calcular estatísticas
  const calcularEstatisticas = () => {
    const vendasPagas = vendasPeriodo.filter(v => v.status === 'pago');
    const totalVendido = vendasPagas.reduce((sum, venda) => sum + venda.total, 0);
    const totalItens = vendasPeriodo.reduce((sum, venda) => 
      sum + venda.itens.reduce((itemSum, item) => itemSum + item.quantidade, 0), 0
    );

    // Calcular crescimento (comparar com período anterior)
    const dataLimiteAnterior = new Date();
    dataLimiteAnterior.setDate(dataLimiteAnterior.getDate() - (parseInt(periodo) * 2));
    const dataLimiteAtual = new Date();
    dataLimiteAtual.setDate(dataLimiteAtual.getDate() - parseInt(periodo));
    
    const vendasPeriodoAnterior = vendas.filter(venda => 
      venda.dataVenda >= dataLimiteAnterior && venda.dataVenda < dataLimiteAtual
    );
    const totalAnterior = vendasPeriodoAnterior
      .filter(v => v.status === 'pago')
      .reduce((sum, venda) => sum + venda.total, 0);

    const crescimento = totalAnterior > 0 ? ((totalVendido - totalAnterior) / totalAnterior) * 100 : 0;

    return {
      totalVendas: vendasPeriodo.length,
      totalVendido,
      totalItens,
      ticketMedio: vendasPagas.length > 0 ? totalVendido / vendasPagas.length : 0,
      crescimento,
      vendasPendentes: vendasPeriodo.filter(v => v.status === 'pendente').length
    };
  };

  // Produtos com estoque baixo
  const getProdutosEstoqueBaixo = () => {
    return produtos.filter(produto => produto.estoque <= 10 && produto.ativo);
  };

  const stats = calcularEstatisticas();
  const produtosEstoqueBaixo = getProdutosEstoqueBaixo();

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <div className="text-white text-lg">Carregando dados...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="bg-slate-800/30 backdrop-blur-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                  Dashboard de Vendas
                </h1>
              </div>
              <p className="text-slate-400">Gerencie suas vendas, clientes e produtos</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className="px-3 py-2 bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="7">Últimos 7 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
              </select>
              
              <Link
                to="/vendas/nova"
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all duration-300 shadow-lg"
              >
                <Plus size={16} />
                Nova Venda
              </Link>
              
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">D</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 hover:border-green-500/50 transition-all duration-300 group">
              <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Total Vendido</p>
                <p className="text-2xl font-bold text-white">{formatarMoeda(stats.totalVendido)}</p>
                <p className={`text-sm ${stats.crescimento >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.crescimento >= 0 ? '+' : ''}{stats.crescimento.toFixed(1)}% vs período anterior
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="text-white" size={24} />
              </div>
              </div>
            </div>

            <Link to="/admin" className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">Vendas Realizadas</p>
                <p className="text-2xl font-bold text-white">{stats.totalVendas}</p>
                <p className="text-sm text-gray-400">
                {stats.vendasPendentes} pendentes
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="text-white" size={24} />
              </div>
              </div>
            </Link>
          </div>

          {/* Alertas */}
          {produtosEstoqueBaixo.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-6 rounded-lg backdrop-blur-sm mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Package className="text-yellow-400" size={20} />
                <h2 className="text-lg font-semibold text-yellow-300">
                  Produtos com Estoque Baixo ({produtosEstoqueBaixo.length})
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {produtosEstoqueBaixo.slice(0, 6).map(produto => (
                  <div key={produto.id} className="bg-gray-800/30 backdrop-blur-sm p-3 rounded-lg border border-yellow-500/20">
                    <p className="font-medium text-white">{produto.nome}</p>
                    <p className="text-sm text-gray-300">{produto.categoria}</p>
                    <p className="text-sm font-medium text-yellow-400">
                      Restam apenas {produto.estoque} unidades
                    </p>
                  </div>
                ))}
              </div>
              
              {produtosEstoqueBaixo.length > 6 && (
                <p className="text-sm text-yellow-300 mt-3">
                  E mais {produtosEstoqueBaixo.length - 6} produtos...
                </p>
              )}
            </div>
          )}

          {/* Links Rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/vendas/nova"
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg hover:border-blue-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Plus className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Nova Venda</h3>
                  <p className="text-sm text-gray-300">Registrar uma nova venda</p>
                </div>
              </div>
            </Link>

            <Link
              to="/vendas/historico"
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg hover:border-green-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Histórico</h3>
                  <p className="text-sm text-gray-300">Ver todas as vendas</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin"
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 p-6 rounded-lg hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Package className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Produtos</h3>
                  <p className="text-sm text-gray-300">Gerenciar estoque</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardVendas;
