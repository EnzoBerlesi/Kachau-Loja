import { Download, Eye } from "lucide-react";
import { type Order } from "../../services/orderService";
import React from "react";
import { Link } from "react-router-dom";

interface OrdersSectionProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  onUpdateOrderStatus: (id: string, status: Order["status"]) => void;
}

const OrdersSection: React.FC<OrdersSectionProps> = ({
  orders,
  loading,
  error,
  onUpdateOrderStatus,
}) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-white">Gerenciamento de Pedidos</h2>
      <Link to="/reports" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-[1.02]">
        <Download size={20} />
        <span>Exportar Relatório</span>
      </Link>
    </div>
    {error && (
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )}
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-slate-700/50">
                <th className="text-left p-4 font-semibold text-slate-300">ID</th>
                <th className="text-left p-4 font-semibold text-slate-300">Cliente</th>
                <th className="text-left p-4 font-semibold text-slate-300">Total</th>
                <th className="text-left p-4 font-semibold text-slate-300">Status</th>
                <th className="text-left p-4 font-semibold text-slate-300">Data</th>
                <th className="text-left p-4 font-semibold text-slate-300">Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                >
                  <td className="p-4 font-medium text-white">#{order.id.slice(0, 8)}</td>
                  <td className="p-4 text-slate-300">{order.user?.name || "N/A"}</td>
                  <td className="p-4 text-white font-semibold">R$ {order.total.toFixed(2)}</td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        onUpdateOrderStatus(order.id, e.target.value as Order["status"])
                      }
                      className="bg-slate-700/50 border border-slate-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <option value="PENDING">Pendente</option>
                      <option value="PROCESSING">Processando</option>
                      <option value="SHIPPED">Enviado</option>
                      <option value="DELIVERED">Entregue</option>
                      <option value="CANCELLED">Cancelado</option>
                    </select>
                  </td>
                  <td className="p-4 text-slate-300">{new Date(order.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td className="p-4">
                    <button className="text-purple-400 hover:text-purple-300 transition-colors">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Nenhum pedido encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

export default OrdersSection;
