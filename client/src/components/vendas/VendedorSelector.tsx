import { useState } from 'react';
import { Search } from 'lucide-react';
import type { User as UserType } from '../../services/userService';
import type { VendaFormData } from '../../types/vendas';

interface VendedorSelectorProps {
  localVenda: VendaFormData['localVenda'];
  setLocalVenda: (local: VendaFormData['localVenda']) => void;
  usuarios: UserType[];
  usuarioSelecionado: UserType | null;
  setUsuarioSelecionado: (usuario: UserType | null) => void;
}

const VendedorSelector = ({
  localVenda,
  setLocalVenda,
  usuarios,
  usuarioSelecionado,
  setUsuarioSelecionado
}: VendedorSelectorProps) => {
  const [buscaUsuario, setBuscaUsuario] = useState('');
  const [showUsuarioDropdown, setShowUsuarioDropdown] = useState(false);

  const usuariosFiltrados = usuarios
    .filter(usuario => usuario.role === 'ADMIN') 
    .filter(usuario =>
      usuario.name.toLowerCase().includes(buscaUsuario.toLowerCase()) ||
      usuario.email.toLowerCase().includes(buscaUsuario.toLowerCase())
    );

  const selecionarUsuario = (usuario: UserType) => {
    setUsuarioSelecionado(usuario);
    setBuscaUsuario(usuario.name);
    setShowUsuarioDropdown(false);
  };

  const handleLocalVendaChange = (novoLocal: VendaFormData['localVenda']) => {
    setLocalVenda(novoLocal);
    if (novoLocal === 'loja-fisica') {
      setUsuarioSelecionado(null);
      setBuscaUsuario('');
    }
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-green-400">🛒</span>
        Configurações da Venda
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Local de Venda
          </label>
          <select
            value={localVenda}
            onChange={(e) => handleLocalVendaChange(e.target.value as VendaFormData['localVenda'])}
            className="w-full px-3 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:border-green-500/50 focus:outline-none text-white"
          >
            <option value="vendedor">👤 Vendedor</option>
            <option value="loja-fisica">🏪 Loja Física</option>
          </select>
        </div>

        {localVenda === 'vendedor' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Vendedor
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar vendedor..."
                value={buscaUsuario}
                onChange={(e) => {
                  setBuscaUsuario(e.target.value);
                  setShowUsuarioDropdown(true);
                  if (!e.target.value) setUsuarioSelecionado(null);
                }}
                onFocus={() => setShowUsuarioDropdown(true)}
                onBlur={() => setTimeout(() => setShowUsuarioDropdown(false), 200)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:border-green-500/50 focus:outline-none text-white placeholder-gray-400"
              />
              
              {showUsuarioDropdown && buscaUsuario && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800/90 border border-gray-700/50 rounded-lg shadow-lg max-h-60 overflow-y-auto backdrop-blur-md">
                  {usuariosFiltrados.length > 0 ? (
                    usuariosFiltrados.map(usuario => (
                      <button
                        key={usuario.id}
                        onClick={() => selecionarUsuario(usuario)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-700/30 border-b border-gray-700/30 last:border-0 transition-colors duration-200"
                      >
                        <div className="font-medium text-white">{usuario.name}</div>
                        <div className="text-sm text-gray-400">{usuario.email}</div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-400">Nenhum usuário encontrado</div>
                  )}
                </div>
              )}
            </div>

            {usuarioSelecionado && (
              <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="font-medium text-white">{usuarioSelecionado.name}</div>
                <div className="text-sm text-gray-300">{usuarioSelecionado.email}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendedorSelector;
