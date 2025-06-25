import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Carrinho from "./pages/shop/Carrinho";
import Gamer from "./pages/shop/Gamer";
import Escritorio from "./pages/shop/Escritorio";
import Notebooks from "./pages/shop/notebooks";
import Hardware from "./pages/shop/hardware";
import Perifericos from "./pages/shop/perifericos";
import Register from "./pages/auth/Register";
import Profile from "./pages/user/Profile";
import Admin from "./pages/admin/Admin";
import Product from "./pages/Product";
import Products from "./pages/Products";
import { PrivateRoutes as PrivateRoute } from "./components/ui";
import { AdminRoutes as AdminRoute } from "./components/admin";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider } from "./context/NotificationContext";
import { AuthProvider } from "./context/AuthContext";
import { useCart } from "./context/useCart";
import { VendasPage, ListaVendasPage, DashboardVendas } from "./pages/vendas";
import OrderConfirmation from "./pages/orders/OrderConfirmation";
import MyOrders from "./pages/orders/MyOrders";
import OrderDetails from "./pages/orders/OrderDetails";

function AppContent() {
  const { clearCart } = useCart();

  return (
    <AuthProvider onLogout={clearCart}>
      <div className="app">
        <div className="content">
        {" "}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/gamer" element={<Gamer />} />
          <Route path="/escritorio" element={<Escritorio />} />
          <Route path="/notebooks" element={<Notebooks />} />
          <Route path="/hardware" element={<Hardware />} />
          <Route path="/perifericos" element={<Perifericos />} />
          <Route path="/product/:id" element={<Product />} />

          {/* Rotas protegidas */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/carrinho" element={<Carrinho />} />
             <Route path="/orders" element={<MyOrders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/vendas" element={<DashboardVendas />} />
            <Route path="/vendas/nova" element={<VendasPage />} />
            <Route path="/vendas/historico" element={<ListaVendasPage />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </div>
    </div>
    </AuthProvider>
  );
}

function App() {
  return (
    <Router>
      <NotificationProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </NotificationProvider>
    </Router>
  );
}

export default App;
