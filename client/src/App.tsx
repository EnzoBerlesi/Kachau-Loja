import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css'

import Header from './components/Header';
import Footer from './components/footer';

import Home from './pages/Home';
import Login from './pages/Login';
import Carrinho from './pages/Carrinho';
import Gamer from './pages/Gamer';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Footer />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/gamer" element={<Gamer />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
