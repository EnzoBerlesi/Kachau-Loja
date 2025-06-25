import { useState } from 'react';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import type { ItemVenda } from './ItensVendaList';
import type { Cliente } from '../../types/vendas';
import type { User as UserType } from '../../services/userService';
import type { VendaFormData } from '../../types/vendas';

interface VendaResumoProps {
  cliente: Cliente | null;
  localVenda: VendaFormData['localVenda'];
  vendedor: UserType | null;
  itens: ItemVenda[];
  formaPagamento: VendaFormData['formaPagamento'];
  setFormaPagamento: (forma: VendaFormData['formaPagamento']) => void;
  parcelas: number;
  setParcelas: (parcelas: number) => void;
  desconto: number;
  setDesconto: (desconto: number) => void;
  onFinalizarVenda: (observacoes?: string) => Promise<void>;
  loading?: boolean;
}

const VendaResumo = ({
  cliente,
  localVenda,
  vendedor,
  itens,
  formaPagamento,
  setFormaPagamento,
  parcelas,
  setParcelas,
  desconto,
  setDesconto,
  onFinalizarVenda,
  loading = false
}: VendaResumoProps) => {
  const [observacoes, setObservacoes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = itens.reduce((acc, item) => acc + item.subtotal, 0);
  const total = subtotal - desconto;
  const totalItens = itens.reduce((acc, item) => acc + item.quantidade, 0);

  const podeFinalizarVenda = cliente && itens.length > 0 && (localVenda === 'loja-fisica' || vendedor);

  const handleFinalizarVenda = async () => {
    if (!podeFinalizarVenda) return;

    try {
      setIsProcessing(true);
      await onFinalizarVenda(observacoes || undefined);
    } finally {
      setIsProcessing(false);
    }
  };

  const getProblemasValidacao = () => {
    const problemas: string[] = [];
    
    if (!cliente) problemas.push('Cliente não selecionado');
    if (itens.length === 0) problemas.push('Nenhum produto adicionado');
    if (localVenda === 'vendedor' && !vendedor) problemas.push('Vendedor não selecionado');
    
    return problemas;
  };

  const problemasValidacao = getProblemasValidacao();

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-green-400">✅</span>
        Resumo da Venda
      </h2>

      <div className="space-y-4">
        {/* Informações do Cliente */}
        <div className="bg-gray-800/50 border border-gray-700/30 rounded-lg p-4">
          <h3 className="font-medium text-white mb-2">👤 Cliente</h3>
          {cliente ? (
            <div>
              <div className="text-white font-medium">{cliente.nome}</div>
              <div className="text-sm text-gray-400">{cliente.email}</div>
              {cliente.telefone && (
                <div className="text-sm text-gray-400">{cliente.telefone}</div>
              )}
            </div>
          ) : (
            <div className="text-red-400">Nenhum cliente selecionado</div>
          )}
        </div>

        {/* Informações da Venda */}
        <div className="bg-gray-800/50 border border-gray-700/30 rounded-lg p-4">
          <h3 className="font-medium text-white mb-2">🛒 Informações da Venda</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Local:</span>
              <span className="text-white">
                {localVenda === 'vendedor' ? '👤 Vendedor' : '🏪 Loja Física'}
              </span>
            </div>
            
            {localVenda === 'vendedor' && (
              <div className="flex justify-between">
                <span className="text-gray-400">Vendedor:</span>
                <span className="text-white">
                  {vendedor ? vendedor.name : <span className="text-red-400">Não selecionado</span>}
                </span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-400">Itens:</span>
              <span className="text-white">{totalItens} unidades</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Subtotal:</span>
              <span className="text-white">R$ {subtotal.toFixed(2)}</span>
            </div>
            
            {desconto > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-400">Desconto:</span>
                <span className="text-red-400">- R$ {desconto.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between font-semibold border-t border-gray-700/50 pt-2">
              <span className="text-gray-300">Total:</span>
              <span className="text-green-400 text-lg">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Forma de Pagamento */}
        <div className="bg-gray-800/50 border border-gray-700/30 rounded-lg p-4">
          <h3 className="font-medium text-white mb-3">💰 Pagamento</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Forma de Pagamento
              </label>
              <select
                value={formaPagamento}
                onChange={(e) => setFormaPagamento(e.target.value as VendaFormData['formaPagamento'])}
                className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:border-green-500/50 focus:outline-none text-white"
              >
                <option value="dinheiro">💵 Dinheiro</option>
                <option value="cartao-credito">💳 Cartão de Crédito</option>
                <option value="cartao-debito">💳 Cartão de Débito</option>
                <option value="pix">📱 PIX</option>
                <option value="parcelado">💰 Parcelado</option>
              </select>
            </div>

            {formaPagamento === 'parcelado' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Número de Parcelas
                </label>
                <select
                  value={parcelas}
                  onChange={(e) => setParcelas(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:border-green-500/50 focus:outline-none text-white"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                    <option key={n} value={n}>{n}x de R$ {(total / n).toFixed(2)}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Desconto
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={subtotal}
                  value={desconto}
                  onChange={(e) => setDesconto(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:border-green-500/50 focus:outline-none text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Observações (opcional)
          </label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Observações sobre a venda..."
            rows={3}
            className="w-full px-3 py-3 bg-gray-800/50 border border-gray-700/50 rounded-lg focus:border-green-500/50 focus:outline-none text-white placeholder-gray-400 resize-none"
          />
        </div>

        {/* Problemas de Validação */}
        {problemasValidacao.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-400 font-medium mb-2">
              <AlertCircle className="h-4 w-4" />
              Problemas encontrados:
            </div>
            <ul className="space-y-1">
              {problemasValidacao.map((problema, index) => (
                <li key={index} className="text-red-300 text-sm">• {problema}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Botão Finalizar */}
        <button
          onClick={handleFinalizarVenda}
          disabled={!podeFinalizarVenda || isProcessing || loading}
          className={`
            w-full py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-200
            ${podeFinalizarVenda && !isProcessing && !loading
              ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isProcessing || loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processando...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Finalizar Venda
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VendaResumo;
