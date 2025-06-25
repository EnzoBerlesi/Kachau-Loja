import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useAuth } from "../../context/AuthContext";
import { orderService, type Order } from "../../services/orderService";

function MyOrders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadUserOrders();
  }, [user, navigate]);

  const loadUserOrders = async () => {
    try {
      setLoading(true);
      const orders = await orderService.getMyOrders();
      setPedidos(orders);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
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

  const handleViewDetails = (orderId: string) => {
    navigate(`/orders/${orderId}`);
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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-purple-400">Meus Pedidos</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Continuar Comprando
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
              <p className="text-gray-400 mt-4">Carregando seus pedidos...</p>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-semibold text-gray-300 mb-2">
                Nenhum pedido encontrado
              </h2>
              <p className="text-gray-400 mb-6">
                Você ainda não fez nenhum pedido. Que tal começar agora?
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Explorar Produtos
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {pedidos.map((pedido) => (
                <div key={pedido.id} className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="mb-4 lg:mb-0">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        Pedido #{pedido.id.slice(-8).toUpperCase()}
                      </h3>
                      <p className="text-gray-400">
                        Realizado em {formatDate(pedido.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col lg:items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pedido.status)}`}>
                        {getStatusText(pedido.status)}
                      </span>
                      <p className="text-2xl font-bold text-purple-400">
                        {formatPrice(pedido.total)}
                      </p>
                    </div>
                  </div>

                  {pedido.items && pedido.items.length > 0 && (
                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="text-lg font-medium text-purple-300 mb-3">
                        Itens do Pedido ({pedido.items.length})
                      </h4>
                      <div className="space-y-3">
                        {pedido.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                            <div className="flex-1">
                              <h5 className="font-medium text-white">
                                {item.product?.name || `Produto ${item.productId.slice(-8)}`}
                              </h5>
                              {item.product?.description && (
                                <p className="text-gray-400 text-sm mt-1">
                                  {item.product.description}
                                </p>
                              )}
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-white font-medium">
                                Qtd: {item.quantity}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {formatPrice(item.price)} cada
                              </p>
                              <p className="text-purple-400 font-semibold">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end mt-4 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => handleViewDetails(pedido.id)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors text-white"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
