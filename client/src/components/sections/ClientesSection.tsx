import React, { useState } from 'react';
import { Plus, Search, Users, Mail, Phone } from 'lucide-react';
import type { Cliente } from '../../types/vendas';

interface ClientesSectionProps {
  clientes: Cliente[];
  loading: boolean;
  error: string | null;
  onNovoCliente: () => void;
  onDeleteCliente?: (id: string) => void;
}

const ClientesSection: React.FC<ClientesSectionProps> = ({
  clientes,
  loading,
  error,
  onNovoCliente,
  onDeleteCliente
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.cpf.includes(searchTerm)
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Clientes</h2>
          <p className="text-gray-400">Gerencie sua base de clientes</p>
        </div>
        
        <button
          onClick={onNovoCliente}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar por nome, email ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:border-blue-500/50 focus:outline-none text-white placeholder-gray-400"
        />
      </div>

      {/* Lista de clientes */}
      <div className="grid gap-4">
        {clientesFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">
              {clientes.length === 0 ? 'Nenhum cliente cadastrado' : 'Nenhum cliente encontrado'}
            </h3>
            <p className="text-gray-500">
              {clientes.length === 0 ? 'Comece cadastrando seu primeiro cliente' : 'Tente ajustar os termos de busca'}
            </p>
          </div>
        ) : (
          clientesFiltrados.map((cliente) => (
            <div
              key={cliente.id}
              className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-6 hover:bg-gray-700/30 transition-colors duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {cliente.nome}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      cliente.ativo 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {cliente.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{cliente.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{cliente.telefone}</span>
                    </div>
                    <div>
                      <span>CPF: {cliente.cpf}</span>
                    </div>
                    <div>
                      <span>Cadastro: {formatDate(cliente.dataCadastro)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-400">
                    <span>
                      {cliente.endereco.rua}, {cliente.endereco.numero} - {cliente.endereco.bairro}, {cliente.endereco.cidade}/{cliente.endereco.estado}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-500/30 transition-colors duration-200">
                    Editar
                  </button>
                  {onDeleteCliente && (
                    <button 
                      onClick={() => onDeleteCliente(cliente.id)}
                      className="px-3 py-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors duration-200"
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientesSection;
