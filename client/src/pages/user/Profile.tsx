import React, { useState, useEffect } from "react";
import Header from "../../components/layout/Header";
import { useAuth } from "../../context/AuthContext";
import { orderService, type Order } from "../../services/orderService";

function Profile() {
  const { user } = useAuth();

  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    endereco: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.name || "",
        email: user.email,
        endereco: user.endereco || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.name || "",
        email: user.email,
        endereco: user.endereco || "",
      });
      
      // Buscar pedidos do usuário
      loadUserOrders();
    }
  }, [user]);

  const loadUserOrders = async () => {
    try {
      setLoadingPedidos(true);
      const orders = await orderService.getMyOrders();
      setPedidos(orders);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoadingPedidos(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
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
        return 'text-green-400';
      case 'SHIPPED':
        return 'text-blue-400';
      case 'PROCESSING':
        return 'text-yellow-400';
      case 'PENDING':
        return 'text-orange-400';
      case 'CANCELLED':
        return 'text-red-400';
      default:
        return 'text-gray-400';
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
        <p>Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="p-6">
        <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-purple-400 mb-4">Perfil</h1>

          <div className="space-y-4">
            {editando ? (
              <>
                {["nome", "email", "cpf", "endereco"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm text-gray-300">
                      {field.charAt(0).toUpperCase() + field.slice(1)}:
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={(formData as any)[field]}
                      onChange={handleChange}
                      className="w-full p-2 mt-1 rounded bg-gray-700 text-white border border-gray-600"
                    />
                  </div>
                ))}
                <button
                  onClick={() => setEditando(false)}
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
                >
                  Salvar Alterações
                </button>
              </>
            ) : (
              <>
                <p>
                  <span className="text-purple-400">Nome:</span> {formData.nome}
                </p>
                <p>
                  <span className="text-purple-400">E-mail:</span>{" "}
                  {formData.email}
                </p>
                <p>
                  <span className="text-purple-400">Endereço:</span>{" "}
                  {formData.endereco}
                </p>
                <button
                  onClick={() => setEditando(true)}
                  className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
                >
                  Editar Perfil
                </button>
              </>
            )}
          </div>

          {/* Histórico de pedidos */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-purple-300 mb-4">
              Histórico de Pedidos
            </h2>
            
            {loadingPedidos ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Carregando pedidos...</p>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Você ainda não fez nenhum pedido.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pedidos.map((pedido) => (
                  <div key={pedido.id} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          Pedido #{pedido.id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {formatDate(pedido.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${getStatusColor(pedido.status)}`}>
                          {getStatusText(pedido.status)}
                        </p>
                        <p className="text-white font-bold">
                          {formatPrice(pedido.total)}
                        </p>
                      </div>
                    </div>
                    
                    {pedido.items && pedido.items.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-purple-300">Itens:</h4>
                        {pedido.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-300">
                              {item.product?.name || `Produto ${item.productId}`} x{item.quantity}
                            </span>
                            <span className="text-gray-300">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
