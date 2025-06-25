import { createContext, useState, type ReactNode } from 'react';
import { useNotification } from './useNotification';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  categoryId: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export { CartContext };

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { showCartNotification } = useNotification();

  function addToCart(item: CartItem) {
    setCart((prev) => {
      const existing = prev.find(p => p.productId === item.productId);
      if (existing) {
        // Produto já existe - atualiza quantidade
        return prev.map(p =>
          p.productId === item.productId ? { ...p, quantity: p.quantity + item.quantity } : p
        );
      }
      
      // Produto novo - adiciona ao carrinho
      return [...prev, item];
    });

    // Mostra notificação após atualizar o estado (apenas uma vez)
    showCartNotification(item.name, item.quantity);
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter(p => p.productId !== productId));
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
