import "keen-slider/keen-slider.min.css";
import { Link } from 'react-router-dom';
import Carousel from "../components/ui/Carousel";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// COMPONENTE PRINCIPAL (HOME)
function Home() {
  return (
    <>
      <Header />
      <div className="w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-12 pb-25 min-h-screen">
        {/* Carrossel no topo */}
        <Carousel />        {/* Seção de Promoções */}
        <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl shadow-xl mx-4 mt-8 border border-slate-700/30">
          <h2 className="text-2xl font-bold text-purple-400 mb-4 flex items-center gap-2">
            <span className="text-purple-300">🔥</span> PROMOÇÕES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">            {/* Produto 1 */}
            <Link to="/product/1" className="group bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:shadow-2xl hover:border-purple-500/30 transition-all duration-300 transform hover:scale-[1.02] block">
              <img
                src="public/assets/promo5.png"
                alt="Produto em promoção"
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3">
                <h3 className="font-semibold text-purple-100 group-hover:text-purple-200 transition-colors">Don Macacone</h3>
                <div className="flex items-center mt-1">
                  <span className="text-purple-400 font-bold">R$ 199</span>
                  <span className="text-slate-500 text-sm line-through ml-2">
                    R$ 299
                  </span>
                </div>
              </div>
            </Link>            {/* Produto 2 */}
            <Link to="/product/2" className="group bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:shadow-2xl hover:border-purple-500/30 transition-all duration-300 transform hover:scale-[1.02] block">
              <img
                src="public/assets/promo2.png"
                alt="Mouse RGB"
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3">
                <h3 className="font-semibold text-purple-100 group-hover:text-purple-200 transition-colors">
                  caboclo tu gosta de leite?
                </h3>
                <div className="flex items-center mt-1">
                  <span className="text-purple-400 font-bold">R$ 129</span>
                  <span className="text-slate-500 text-sm line-through ml-2">
                    R$ 189
                  </span>
                </div>
              </div>
            </Link>            {/* Produto 3 */}
            <Link to="/product/3" className="group bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:shadow-2xl hover:border-purple-500/30 transition-all duration-300 transform hover:scale-[1.02] block">
              <img
                src="public/assets/promo3.png"
                alt="Produto especial"
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3">
                <h3 className="font-semibold text-purple-100 group-hover:text-purple-200 transition-colors">
                  COMUNISMO PORRAAAAAAA
                </h3>
                <div className="flex items-center mt-1">
                  <span className="text-purple-400 font-bold">R$ 129</span>
                  <span className="text-slate-500 text-sm line-through ml-2">
                    R$ 189
                  </span>
                </div>
              </div>
            </Link>            {/* Produto 4 */}
            <Link to="/product/4" className="group bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:shadow-2xl hover:border-purple-500/30 transition-all duration-300 transform hover:scale-[1.02] block">
              <img
                src="public/assets/promo4.png"
                alt="Produto premium"
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3">
                <h3 className="font-semibold text-purple-100 group-hover:text-purple-200 transition-colors">mo cheirao de mato</h3>
                <div className="flex items-center mt-1">
                  <span className="text-purple-400 font-bold">R$ 129</span>
                  <span className="text-slate-500 text-sm line-through ml-2">
                    R$ 189
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>        {/* Seção de Novos Produtos */}
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl mx-4 mt-12 border border-slate-700/20">
          <h2 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
            <span className="text-purple-200">🆕</span> NOVIDADES
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">            {/* Produto novo 1 */}
            <Link to="/product/5" className="group bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:shadow-2xl hover:border-purple-400/30 transition-all duration-300 transform hover:scale-[1.02] block">
              <img
                src="/assets/produtos/novo1.jpg"
                alt="Novo produto"
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3">
                <h3 className="font-semibold text-purple-100 group-hover:text-purple-200 transition-colors">Teclado Mecânico</h3>
                <p className="text-purple-300 font-bold mt-1">R$ 349</p>
              </div>
            </Link>            {/* Produto novo 2 */}
            <Link to="/product/6" className="group bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:shadow-2xl hover:border-purple-400/30 transition-all duration-300 transform hover:scale-[1.02] block">
              <img
                src="/assets/produtos/novo1.jpg"
                alt="Novo produto"
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3">
                <h3 className="font-semibold text-purple-100 group-hover:text-purple-200 transition-colors">Mouse Gaming RGB</h3>
                <p className="text-purple-300 font-bold mt-1">R$ 249</p>
              </div>
            </Link>
            {/* Produto novo 3 */}
            <Link to="/product/7" className="group bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:shadow-2xl hover:border-purple-400/30 transition-all duration-300 transform hover:scale-[1.02] block">
              <img
                src="/assets/produtos/novo1.jpg"
                alt="Novo produto"
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3">
                <h3 className="font-semibold text-purple-100 group-hover:text-purple-200 transition-colors">Headset Wireless</h3>
                <p className="text-purple-300 font-bold mt-1">R$ 449</p>
              </div>
            </Link>
            {/* Produto novo 4 */}
            <Link to="/product/8" className="group bg-slate-900/70 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:shadow-2xl hover:border-purple-400/30 transition-all duration-300 transform hover:scale-[1.02] block">
              <img
                src="/assets/produtos/novo1.jpg"
                alt="Novo produto"
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3">
                <h3 className="font-semibold text-purple-100 group-hover:text-purple-200 transition-colors">Monitor 4K Gaming</h3>
                <p className="text-purple-300 font-bold mt-1">R$ 1299</p>
              </div>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Home;
