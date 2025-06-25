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
import VendasAdmin from "./pages/vendas/VendasAdmin";
import { PrivateRoutes as PrivateRoute } from "./components/ui";
import { AdminRoutes as AdminRoute } from "./components/admin";
import { CartProvider } from "./context/CartContext";
import { VendasPage, ListaVendasPage, DashboardVendas } from "./pages/vendas";

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="app">
          <div className="content">
            {" "}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
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
                <Route path="/vendas" element={<DashboardVendas />} />
                <Route path="/vendas/nova" element={<VendasPage />} />
                <Route path="/vendas/historico" element={<ListaVendasPage />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<Admin />} />
                <Route path="/vendas" element={<VendasAdmin />} />
              </Route>
            </Routes>
          </div>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
