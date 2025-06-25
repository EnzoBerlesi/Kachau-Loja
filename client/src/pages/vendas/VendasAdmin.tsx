import { useState, useEffect, useCallback } from "react";
import {
  ShoppingCart,
  Users,
  TrendingUp,
} from "lucide-react";
import { vendaService, clienteService } from "../../services/vendaService";
import type { Venda, Cliente } from "../../types/vendas";
import { VendasHeader, VendasCard } from "../../components/vendas";
import { VendasSection, ClientesSection } from "../../components/sections";
import { ClienteModal } from "../../components/vendas";

const VendasAdmin = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  // Estados para dados
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  // Estados de loading
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para modais
  const [showClienteModal, setShowClienteModal] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      switch (activeSection) {
        case "vendas": {
          const vendasData = await vendaService.getAll();
          setVendas(vendasData);
          break;
        }
        case "clientes": {
          const clientesData = await clienteService.getAll();
          setClientes(clientesData);
          break;
        }
        case "dashboard": {
          // Carrega todos os dados para o dashboard
          const [vendasData, clientesData] = await Promise.all([
            vendaService.getAll(),
            clienteService.getAll()
          ]);
          setVendas(vendasData);
          setClientes(clientesData);
          break;
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar dados";
      setError(errorMessage);
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }, [activeSection]);

  // Carrega dados quando a seção muda
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleNovaVenda = () => {
    // Navegar para página de nova venda ou abrir modal
    console.log("Nova venda");
  };

  const handleNovoCliente = () => {
    setShowClienteModal(true);
  };

  const handleClienteAdicionado = (cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => {
    // Simular salvamento (integrar com service)
    console.log('Cliente salvo:', cliente);
    setShowClienteModal(false);
    if (activeSection === "clientes") {
      loadData();
    }
  };

  const handleDeleteCliente = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este cliente?")) return;

    try {
      await clienteService.delete(id);
      setClientes(clientes.filter((c) => c.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao deletar cliente";
      setError(errorMessage);
    }
  };

  const renderDashboard = () => {
    const totalVendas = vendas.length;
    const vendasConcluidas = vendas.filter(v => v.status === 'pago').length;
    const faturamentoTotal = vendas
      .filter(v => v.status === 'pago')
      .reduce((total, venda) => total + venda.total, 0);
    const clientesAtivos = clientes.filter(c => c.ativo).length;

    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
    };

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Dashboard de Vendas</h2>
          <p className="text-gray-400">Visão geral do seu negócio</p>
        </div>

        {/* Estatísticas principais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Faturamento Total</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(faturamentoTotal)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/20 border border-blue-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Vendas Concluídas</p>
                <p className="text-2xl font-bold text-white">{vendasConcluidas}</p>
                <p className="text-xs text-gray-400">de {totalVendas} vendas</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 border border-purple-500/30 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Clientes Ativos</p>
                <p className="text-2xl font-bold text-white">{clientesAtivos}</p>
                <p className="text-xs text-gray-400">de {clientes.length} cadastrados</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Vendas recentes */}
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Vendas Recentes</h3>
          <div className="space-y-3">
            {vendas.slice(0, 5).map((venda) => (
              <div key={venda.id} className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-b-0">
                <div>
                  <p className="text-white font-medium">Venda #{venda.numeroVenda}</p>
                  <p className="text-gray-400 text-sm">{venda.cliente.nome}</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">{formatCurrency(venda.total)}</p>
                  <p className="text-gray-400 text-xs">{venda.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case "vendas":
        return (
          <VendasSection
            vendas={vendas}
            loading={loading}
            error={error}
            onNovaVenda={handleNovaVenda}
          />
        );
      case "clientes":
        return (
          <ClientesSection
            clientes={clientes}
            loading={loading}
            error={error}
            onNovoCliente={handleNovoCliente}
            onDeleteCliente={handleDeleteCliente}
          />
        );
      case "dashboard":
        return renderDashboard();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative">
        <VendasHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <VendasCard
              icon={TrendingUp}
              title="Dashboard"
              description="Visão geral e estatísticas"
              sectionKey="dashboard"
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              color="green"
            />
            <VendasCard
              icon={ShoppingCart}
              title="Vendas"
              description="Gerenciar e acompanhar vendas"
              sectionKey="vendas"
              count={vendas.length}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              color="green"
            />
            <VendasCard
              icon={Users}
              title="Clientes"
              description="Cadastro e gestão de clientes"
              sectionKey="clientes"
              count={clientes.length}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              color="blue"
            />
          </div>

          {/* Dynamic Content Section */}
          <div className="transition-all duration-300">{renderSection()}</div>
        </div>
      </div>

      {/* Modais */}
      {showClienteModal && (
        <ClienteModal
          isOpen={showClienteModal}
          onClose={() => setShowClienteModal(false)}
          onSave={handleClienteAdicionado}
        />
      )}
    </div>
  );
};

export default VendasAdmin;
