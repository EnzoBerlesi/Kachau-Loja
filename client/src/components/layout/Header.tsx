import { Link } from 'react-router-dom';
import { CircleUserRound, House, ShoppingCart, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function Header() {
  const { token, logout } = useAuth();

return (
  <>
    <nav className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 fixed top-0 left-0 w-full z-50 shadow-lg p-4 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center">
        {/* Logo */}
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 cursor-pointer select-none">
            Kachau Loja
          </h1>
        </div>

        {/* Search bar centralizada */}
        <div className="flex-1 flex justify-center">
          <input
            type="search"
            placeholder="Buscar produtos..."
            className="bg-slate-700/50 text-white placeholder-slate-400 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

        {/* Ícones à direita */}
        <div className="flex-1 flex justify-end items-center space-x-6 text-white text-xl">
          {token ? (
            <>
              <Link to="/" title="Home" className="hover:text-pink-400 transition">
                <House />
              </Link>
              <Link to="/profile" title="Perfil" className="hover:text-pink-400 transition">
                <CircleUserRound />
              </Link>
              <Link to="/carrinho" title="Carrinho" className="hover:text-pink-400 transition">
                <ShoppingCart />
              </Link>
              <Link to="/admin" title="Administração" className="hover:text-pink-400 transition">
                <Settings />
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-1 text-sm text-pink-400 hover:text-pink-300 font-semibold transition px-3 py-1 rounded-md bg-purple-700/70 hover:bg-purple-700"
                title="Sair"
              >
                <span>Sair</span>
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <Link to="/login" title="Login" className="hover:text-pink-400 transition">
              <CircleUserRound />
            </Link>
          )}
        </div>
      </div>
    </nav>

      <div className="bg-gradient-to-r from-purple-700 to-purple-900 flex justify-center space-x-8 mt-18 py-3 text-sm text-gray-300 select-none border-t border-purple-600">
        <Link to="/gamer" className="hover:text-pink-400 transition">
          | Gamer |
        </Link>
        <Link to="/escritorio" className="hover:text-pink-400 transition">
          | Escritório |
        </Link>
        <Link to="/perifericos" className="hover:text-pink-400 transition">
          | Periféricos |
        </Link>
        <Link to="/notebooks" className="hover:text-pink-400 transition">
          | Notebooks |
        </Link>
        <Link to="/hardware" className="hover:text-pink-400 transition">
          | Hardware |
        </Link>
      </div>
    </>
  );
}

export default Header;
