import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Carrinho from './pages/shop/Carrinho';
import Gamer from './pages/shop/Gamer';
import Register from './pages/auth/Register';
import Profile from './pages/user/Profile';
import Admin from './pages/admin/Admin';
import Product from './pages/Product';
import { PrivateRoutes as PrivateRoute } from './components/ui';
import { AdminRoutes as AdminRoute } from './components/admin';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="content">          <Routes>            
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/gamer" element={<Gamer />} />
            <Route path="/product/:id" element={<Product />} />

            {/* Rotas protegidas */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/carrinho" element={<Carrinho />} />
            </Route>

            <Route element={<AdminRoute />} >
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
