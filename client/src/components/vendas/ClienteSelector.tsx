import { useState } from 'react';
import { Plus, Search, User } from 'lucide-react';
import type { Cliente } from '../../types/vendas';

interface ClienteSelectorProps {
  clientes: Cliente[];
  clienteSelecionado: Cliente | null;
  onClienteSelect: (cliente: Cliente) => void;
  onNovoCliente: () => void;
}

const ClienteSelector = ({ clientes, clienteSelecionado, onClienteSelect, onNovoCliente }: ClienteSelectorProps) => {
  const [buscaCliente, setBuscaCliente] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(buscaCliente.toLowerCase()) ||
    cliente.email.toLowerCase().includes(buscaCliente.toLowerCase())
  );

  const selecionarCliente = (cliente: Cliente) => {
    onClienteSelect(cliente);
    setBuscaCliente(cliente.nome);
    setShowDropdown(false);
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <User className="h-5 w-5 text-green-400" />
          Cliente
        </h2>
        <button
          onClick={onNovoCliente}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 shadow-lg"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar cliente por nome ou email..."
          value={buscaCliente}
          onChange={(e) => {
            setBuscaCliente(e.target.value);
            setShowDropdown(true);
            if (!e.target.value) onClienteSelect(null as any);
          }}
          onFocus={() => setShowDropdown(true)}
          className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:border-green-500/50 focus:outline-none text-white placeholder-gray-400"
        />
        
        {showDropdown && buscaCliente && (
          <div className="absolute z-10 w-full mt-1 bg-gray-800/90 border border-gray-700/50 rounded-lg shadow-lg max-h-60 overflow-y-auto backdrop-blur-md">
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map(cliente => (
                <button
                  key={cliente.id}
                  onClick={() => selecionarCliente(cliente)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700/30 border-b border-gray-700/30 last:border-0 transition-colors duration-200"
                >
                  <div className="font-medium text-white">{cliente.nome}</div>
                  <div className="text-sm text-gray-400">{cliente.email}</div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-400">Nenhum cliente encontrado</div>
            )}
          </div>
        )}
      </div>

      {clienteSelecionado && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <h3 className="font-medium text-white">{clienteSelecionado.nome}</h3>
          <p className="text-sm text-gray-300">{clienteSelecionado.email}</p>
          <p className="text-sm text-gray-300">{clienteSelecionado.telefone}</p>
        </div>
      )}
    </div>
  );
};

export default ClienteSelector;
