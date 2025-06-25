import { useState } from 'react';
import { X, User, Mail, MapPin } from 'lucide-react';
import type { Cliente } from '../../types/vendas';

interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => void;
  cliente?: Cliente | null;
  title?: string;
}

const ClienteModal = ({ isOpen, onClose, onSave, cliente, title = "Novo Cliente" }: ClienteModalProps) => {
  const [formData, setFormData] = useState({
    nome: cliente?.nome || '',
    email: cliente?.email || '',
    telefone: cliente?.telefone || '',
    cpf: cliente?.cpf || '',
    endereco: {
      rua: cliente?.endereco.rua || '',
      numero: cliente?.endereco.numero || '',
      complemento: cliente?.endereco.complemento || '',
      bairro: cliente?.endereco.bairro || '',
      cidade: cliente?.endereco.cidade || '',
      estado: cliente?.endereco.estado || '',
      cep: cliente?.endereco.cep || ''
    },
    ativo: cliente?.ativo ?? true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório';
    if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    if (!formData.endereco.rua.trim()) newErrors.rua = 'Rua é obrigatória';
    if (!formData.endereco.numero.trim()) newErrors.numero = 'Número é obrigatório';
    if (!formData.endereco.bairro.trim()) newErrors.bairro = 'Bairro é obrigatório';
    if (!formData.endereco.cidade.trim()) newErrors.cidade = 'Cidade é obrigatória';
    if (!formData.endereco.estado.trim()) newErrors.estado = 'Estado é obrigatório';
    if (!formData.endereco.cep.trim()) newErrors.cep = 'CEP é obrigatório';

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Dados Pessoais */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-white">
              <User className="h-5 w-5 text-green-400" />
              Dados Pessoais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleChange('nome', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800/50 border rounded-lg focus:border-green-500/50 focus:outline-none text-white placeholder-gray-400 ${
                    errors.nome ? 'border-red-500/50' : 'border-gray-700/50'
                  }`}
                  placeholder="Nome completo"
                />
                {errors.nome && <p className="text-red-400 text-sm mt-1">{errors.nome}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => handleChange('cpf', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800/50 border rounded-lg focus:border-green-500/50 focus:outline-none text-white placeholder-gray-400 ${
                    errors.cpf ? 'border-red-500/50' : 'border-gray-700/50'
                  }`}
                  placeholder="000.000.000-00"
                />
                {errors.cpf && <p className="text-red-400 text-sm mt-1">{errors.cpf}</p>}
              </div>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-white">
              <Mail className="h-5 w-5 text-green-400" />
              Contato
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800/50 border rounded-lg focus:border-green-500/50 focus:outline-none text-white placeholder-gray-400 ${
                    errors.email ? 'border-red-500/50' : 'border-gray-700/50'
                  }`}
                  placeholder="email@exemplo.com"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => handleChange('telefone', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-800/50 border rounded-lg focus:border-green-500/50 focus:outline-none text-white placeholder-gray-400 ${
                    errors.telefone ? 'border-red-500/50' : 'border-gray-700/50'
                  }`}
                  placeholder="(11) 99999-9999"
                />
                {errors.telefone && <p className="text-red-400 text-sm mt-1">{errors.telefone}</p>}
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-4 text-white">
              <MapPin className="h-5 w-5 text-green-400" />
              Endereço
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rua *
                  </label>
                  <input
                    type="text"
                    value={formData.endereco.rua}
                    onChange={(e) => handleChange('endereco.rua', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800/50 border rounded-lg focus:border-green-500/50 focus:outline-none text-white placeholder-gray-400 ${
                      errors.rua ? 'border-red-500/50' : 'border-gray-700/50'
                    }`}
                    placeholder="Nome da rua"
                  />
                  {errors.rua && <p className="text-red-400 text-sm mt-1">{errors.rua}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Número *
                  </label>
                  <input
                    type="text"
                    value={formData.endereco.numero}
                    onChange={(e) => handleChange('endereco.numero', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800/50 border rounded-lg focus:border-green-500/50 focus:outline-none text-white placeholder-gray-400 ${
                      errors.numero ? 'border-red-500/50' : 'border-gray-700/50'
                    }`}
                    placeholder="123"
                  />
                  {errors.numero && <p className="text-red-400 text-sm mt-1">{errors.numero}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Complemento
                  </label>
                  <input
                    type="text"
                    value={formData.endereco.complemento}
                    onChange={(e) => handleChange('endereco.complemento', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:border-green-500/50 focus:outline-none text-white placeholder-gray-400"
                    placeholder="Apto, casa, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    value={formData.endereco.bairro}
                    onChange={(e) => handleChange('endereco.bairro', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800/50 border rounded-lg focus:border-green-500/50 focus:outline-none text-white placeholder-gray-400 ${
                      errors.bairro ? 'border-red-500/50' : 'border-gray-700/50'
                    }`}
                    placeholder="Nome do bairro"
                  />
                  {errors.bairro && <p className="text-red-400 text-sm mt-1">{errors.bairro}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    CEP *
                  </label>
                  <input
                    type="text"
                    value={formData.endereco.cep}
                    onChange={(e) => handleChange('endereco.cep', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800/50 border rounded-lg focus:border-green-500/50 focus:outline-none text-white placeholder-gray-400 ${
                      errors.cep ? 'border-red-500/50' : 'border-gray-700/50'
                    }`}
                    placeholder="00000-000"
                  />
                  {errors.cep && <p className="text-red-400 text-sm mt-1">{errors.cep}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    value={formData.endereco.cidade}
                    onChange={(e) => handleChange('endereco.cidade', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800/50 border rounded-lg focus:border-green-500/50 focus:outline-none text-white placeholder-gray-400 ${
                      errors.cidade ? 'border-red-500/50' : 'border-gray-700/50'
                    }`}
                    placeholder="Nome da cidade"
                  />
                  {errors.cidade && <p className="text-red-400 text-sm mt-1">{errors.cidade}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estado *
                  </label>
                  <select
                    value={formData.endereco.estado}
                    onChange={(e) => handleChange('endereco.estado', e.target.value)}
                    className={`w-full px-3 py-2 bg-gray-800/50 border rounded-lg focus:border-green-500/50 focus:outline-none text-white ${
                      errors.estado ? 'border-red-500/50' : 'border-gray-700/50'
                    }`}
                  >
                    <option value="">Selecione o estado</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="RS">Rio Grande do Sul</option>
                    {/* Adicionar outros estados conforme necessário */}
                  </select>
                  {errors.estado && <p className="text-red-400 text-sm mt-1">{errors.estado}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700/50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 border border-gray-600/50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg"
            >
              Salvar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteModal;
