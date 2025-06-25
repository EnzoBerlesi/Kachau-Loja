import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useAuth } from "../../context/AuthContext";
import { orderService, type Order } from "../../services/orderService";

function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pedido, setPedido] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!id) {
      navigate('/orders');
      return;
    }

    loadOrderDetails();
  }, [user, id, navigate]);

  const loadOrderDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const order = await orderService.getOrderById(id);
      setPedido(order);
    } catch (error: any) {
      console.error('Erro ao carregar detalhes do pedido:', error);
      setError(error.response?.data?.message || 'Erro ao carregar pedido');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
        return 'bg-orange-100 text-orange-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'Entregue';
      case 'SHIPPED':
        return 'Enviado';
      case 'PROCESSING':
        return 'Processando';
      case 'PENDING':
        return 'Pendente';
      case 'CANCELLED':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Redirecionando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/orders')}
              className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar aos Pedidos
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
              <p className="text-gray-400 mt-4">Carregando detalhes do pedido...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-400 text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-semibold text-red-400 mb-2">
                Erro ao carregar pedido
              </h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <button
                onClick={() => navigate('/orders')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Voltar aos Pedidos
              </button>
            </div>
          ) : !pedido ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-semibold text-gray-300 mb-2">
                Pedido não encontrado
              </h2>
              <p className="text-gray-400 mb-6">
                O pedido solicitado não foi encontrado.
              </p>
              <button
                onClick={() => navigate('/orders')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Voltar aos Pedidos
              </button>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              {/* Header do Pedido */}
              <div className="border-b border-gray-700 pb-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="mb-4 lg:mb-0">
                    <h1 className="text-3xl font-bold text-white mb-2">
                      Pedido #{pedido.id.slice(-8).toUpperCase()}
                    </h1>
                    <p className="text-gray-400">
                      Realizado em {formatDate(pedido.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(pedido.status)}`}>
                      {getStatusText(pedido.status)}
                    </span>
                    <p className="text-3xl font-bold text-purple-400 mt-2">
                      {formatPrice(pedido.total)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações do Cliente */}
              {pedido.user && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">
                    Informações do Cliente
                  </h3>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-white"><strong>Nome:</strong> {pedido.user.name}</p>
                    <p className="text-white"><strong>Email:</strong> {pedido.user.email}</p>
                  </div>
                </div>
              )}

              {/* Itens do Pedido */}
              {pedido.items && pedido.items.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-purple-300 mb-3">
                    Itens do Pedido ({pedido.items.length})
                  </h3>
                  <div className="space-y-4">
                    {pedido.items.map((item) => (
                      <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-lg">
                              {item.product?.name || `Produto ${item.productId.slice(-8)}`}
                            </h4>
                            {item.product?.description && (
                              <p className="text-gray-400 mt-1">
                                {item.product.description}
                              </p>
                            )}
                            <p className="text-gray-300 mt-2">
                              <strong>Código:</strong> {item.productId.slice(-8).toUpperCase()}
                            </p>
                          </div>
                          <div className="text-right ml-6">
                            <p className="text-white font-medium text-lg">
                              Qtd: {item.quantity}
                            </p>
                            <p className="text-gray-400">
                              {formatPrice(item.price)} cada
                            </p>
                            <p className="text-purple-400 font-bold text-xl">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resumo do Pedido */}
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-purple-300 mb-3">
                  Resumo do Pedido
                </h3>
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-white">Total:</span>
                    <span className="text-2xl font-bold text-purple-400">
                      {formatPrice(pedido.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
