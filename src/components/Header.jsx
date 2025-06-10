import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="header">
      <p>Sidebar</p>
      <h1>Kachau Loja</h1>
      <p>Search bar</p>
      <div className="links">
        <Link to="/login">Login</Link>
        <Link to="/">Home(logo)</Link>
        <Link to="/Carrinho">Carrinho</Link>
      </div>
      <div className="departamentos">
        <Link to='/gamer'>Gamer</Link>
        Escritório 
        Perifericos 
        Notebooks 
        Hardware
      </div>
    </nav>
  );
}

export default Header;
