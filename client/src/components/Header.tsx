import { Link } from 'react-router-dom';
import {CircleUserRound, House, ShoppingCart} from 'lucide-react';

function Header() {
  return (<>

    <nav className="bg-gray-900/90 fixed top-0 left-0 w-full z-50 shadow-md p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-x3 font-bold">Kachau Loja</h1>
        <input className='bg-zinc-200 rounded-md pl-3 pr-28'></input>
        <div className="flex space-x-4">
          <Link to="/login"><CircleUserRound/></Link>
          <Link to="/"><House/></Link>
          <Link to="/Carrinho"><ShoppingCart/></Link>
        </div>
      </div>
    </nav>

    <div className="bg-purple-600 flex justify-center space-x-6 mt-14 text-sm text-gray-700  ">
      <Link to='/gamer'>| Gamer |</Link>
      <Link to='/escritorio'>| Escritório |</Link>
      <Link to='/perifericos'>| Periféricos |</Link>
      <Link to='/notebooks'>| Notebooks |</Link>
      <Link to='/hardware'>| Hardware |</Link>
    </div>
  </>



  );
}

export default Header;
