import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-800 shadow-md p-4">
      <div className="flex justify-between items-center">
        <p>Sidebar</p>
        <h1 className="text-x3 font-bold">Kachau Loja</h1>
        <p>Search bar</p>
        <div className="flex space-x-4">
          <Link to="/login">Login</Link>
          <Link to="/">Home</Link>
          <Link to="/Carrinho">Carrinho</Link>
        </div>
      </div>
      <div className="flex justify-center space-x-6 mt-4 text-sm text-gray-700">
        <Link to='/gamer'>Gamer</Link>
        <Link to='/escritorio'> Escritório </Link>
        <Link to='/perifericos'> Periféricos </Link>
        <Link to='/notebooks'> Notebooks </Link>
        <Link to='/hardware'> Hardware </Link>
      </div>
    </nav>
  );
}

export default Header;
