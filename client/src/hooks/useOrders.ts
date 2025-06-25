import { useState, useEffect } from "react";
import { orderService, type Order } from "../services/orderService";

/**
 * Hook customizado para gerenciar pedidos do usuário
 */
export const useUserOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const userOrders = await orderService.getMyOrders();
      setOrders(userOrders);
    } catch (err: any) {
      console.error('Erro ao carregar pedidos:', err);
      setError(err.response?.data?.message || 'Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const refreshOrders = () => {
    loadOrders();
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    refreshOrders
  };
};

/**
 * Hook customizado para gerenciar um pedido específico
 */
export const useOrder = (orderId: string | undefined) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrder = async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const orderData = await orderService.getOrderById(orderId);
      setOrder(orderData);
    } catch (err: any) {
      console.error('Erro ao carregar pedido:', err);
      setError(err.response?.data?.message || 'Erro ao carregar pedido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  return {
    order,
    loading,
    error,
    refreshOrder: loadOrder
  };
};
