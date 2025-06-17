import React from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import Carousel from '../components/Carousel';


// COMPONENTE DO CARROSSEL
function Carousel1() {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1 },
  });

  return (
    <div
      ref={sliderRef}
      className="keen-slider w-1/3 h-[200px] mx-auto overflow-hidden"
    >
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <div
          key={num}
          className="keen-slider__slide flex items-center justify-center !min-w-0"
        >
          <img
            src={`/assets/promo${num}.png`}
            alt={`Promoção ${num}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ))}
    </div>
  );

}

// COMPONENTE PRINCIPAL (HOME)
function Home() {
  return (
    <div className="w-full bg-gray-900/80 pt-12 pb-25">
      {/* Carrossel no topo */}
      <Carousel />

      {/* Seção de Promoções */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md mx-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">🔥 PROMOÇÕES</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Produto 1 */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all">
            <img
              src="public/assets/promo5.png"
              alt="Produto em promoção"
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <h3 className="font-semibold text-white">Don Macacone</h3>
              <div className="flex items-center mt-1">
                <span className="text-red-600 font-bold">R$ 199</span>
                <span className="text-gray-500 text-sm line-through ml-2">R$ 299</span>
              </div>
            </div>
          </div>

          {/* Produto 2 - vai pra direita automaticamente */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all">
            <img
              src="public/assets/promo2.png"
              alt="Mouse RGB"
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <h3 className="font-semibold text-white">caboclo tu gosta de leite?</h3>
              <div className="flex items-center mt-1">
                <span className="text-red-600 font-bold">R$ 129</span>
                <span className="text-gray-500 text-sm line-through ml-2">R$ 189</span>
              </div>
            </div>
          </div>

          {/* Produto 2 - vai pra direita automaticamente */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all">
            <img
              src="public/assets/promo3.png"
              alt="Mouse RGB"
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <h3 className="font-semibold text-white">COMUNISMO PORRAAAAAAA</h3>
              <div className="flex items-center mt-1">
                <span className="text-red-600 font-bold">R$ 129</span>
                <span className="text-gray-500 text-sm line-through ml-2">R$ 189</span>
              </div>
            </div>
          </div>

          {/* Produto 2 - vai pra direita automaticamente */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all">
            <img
              src="public/assets/promo4.png"
              alt="Mouse RGB"
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <h3 className="font-semibold text-white">mo cheirao de mato</h3>
              <div className="flex items-center mt-1">
                <span className="text-red-600 font-bold">R$ 129</span>
                <span className="text-gray-500 text-sm line-through ml-2">R$ 189</span>
              </div>
            </div>
          </div>
        </div> 
      </div>


        {/* Seção de Novos Produtos */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-md mx-4 mt-12">
          <h2 className="text-2xl font-bold text-blue-500 mb-4">🆕 NOVIDADES</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-all">
              <img
                src="/assets/produtos/novo1.jpg"
                alt="Novo produto"
                className="w-full h-40 object-cover"
              />
              <div className="p-3">
                <h3 className="font-semibold text-white">Teclado Mecânico</h3>
                <p className="text-green-400 font-bold mt-1">R$ 349</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
}

      export default Home;
