import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Carrinho from './pages/Carrinho';
import Gamer from './pages/Gamer';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import PrivateRoute from './components/PrivateRoutes';
import AdminRoute from './components/AdminRoutes';

function App() {
  return (
    <Router>
      <div className="app">
        <div className="content">
          <Routes>            
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/gamer" element={<Gamer />} />

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
