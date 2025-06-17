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
    <div ref={sliderRef} className="keen-slider w-15 h-[300px]">
      <div className="keen-slider__slide">
        <img src="/assets/promo1.png" alt="Promoção 1" className="w-full h-full object-cover object-center" />
      </div>
      <div className="keen-slider__slide">
        <img src="/assets/promo2.png" alt="Promoção 2" className="w-full h-full object-cover" />
      </div>
      <div className="keen-slider__slide">
        <img src="/assets/promo3.png" alt="Promoção 3" className="w-full h-full object-cover" />
      </div>
      <div className="keen-slider__slide">
        <img src="/assets/promo4.png" alt="Promoção 4" className="w-full h-full object-cover" />
      </div>
      <div className="keen-slider__slide">
        <img src="/assets/promo5.png" alt="Promoção 5" className="w-full h-full object-cover" />
      </div>
      <div className="keen-slider__slide">
        <img src="/assets/promo6.png" alt="Promoção 6" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

// COMPONENTE PRINCIPAL (HOME)
function Home() {
  return (
    <div className="w-full bg-gray-900/80 pt-12">
      {/* Carrossel no topo */}
      <Carousel />

      {/* Seção de Promoções */}
      <div className="p-4 bg-gray-900/60">
        <h2 className="text-2xl font-bold text-red-600 mb-4">🔥 PROMOÇÕES</h2>
        
        <div className=" grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Produto 1 */}
          <div className=" border rounded-lg overflow-hidden hover:shadow-lg transition-all">
            <img 
              src="/assets/produtos/promo1.jpg" 
              alt="Produto em promoção"
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <h3 className="font-semibold">Headphone Gamer</h3>
              <div className="flex items-center mt-1">
                <span className="text-red-600 font-bold">R$ 199</span>
                <span className="text-gray-500 text-sm line-through ml-2">R$ 299</span>
              </div>
            </div>
          </div>
          
          {/* Adicione mais produtos aqui... */}
        </div>
      </div>

      {/* Seção de Novos Produtos */}
      <div className="p-4 mt-6 purple">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">🆕 NOVIDADES</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Produto 1 */}
          <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-all">
            <img 
              src="/assets/produtos/novo1.jpg" 
              alt="Novo produto"
              className="w-full h-40 object-cover"
            />
            <div className="p-3">
              <h3 className="font-semibold">Teclado Mecânico</h3>
              <p className="text-gray-900 font-bold mt-1">R$ 349</p>
            </div>
          </div>
          
          {/* Adicione mais produtos aqui... */}
        </div>
      </div>
    </div>
  );
}

export default Home;
